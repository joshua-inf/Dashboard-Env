import { useState, useEffect } from 'react';
import {
    Search,
    X,
    Plus,
    Check,
    User,
    Mail,
    Phone,
    MapPin,
    Crown,
    Shield,
    Eye,
    ChartBar,
    Settings
} from 'lucide-react';
import { UsersType } from '@/types/Customers';
import { getUserByEmail } from '@/services/apiUsers';

interface InviteUsersPopupType {
    isOpen: boolean
    onClose: () => void
    business: { id?: string; name?: string } | null
    existingUsers: UsersType[] | null | undefined
    onInviteUsers: (payload: { users: UsersType[]; role: string; businessId?: string }) => Promise<void> | void
    isLoading: boolean
}

const InviteUsersPopup = ({
    isOpen,
    onClose,
    business,
    existingUsers,
    onInviteUsers,
    isLoading
}: InviteUsersPopupType) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<UsersType[]>([]);
    const [role, setRole] = useState('viewer');
    const [availableUsers, setAvailableUsers] = useState<UsersType[] | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<UsersType[] | null>(null);


    const getSerchUser = () => {
        console.log(searchQuery)
        getUserByEmail(searchQuery)
            .then((res) => {
                if (res) {
                    setAvailableUsers(res);
                    setFilteredUsers(res);
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })
    }

    // Role options with descriptions
    const roleOptions = [
        {
            value: 'viewer',
            label: 'Viewer',
            description: 'Can view business data only',
            icon: Eye
        },
        {
            value: 'analyst',
            label: 'Analyst',
            description: 'Can view and analyze data',
            icon: ChartBar
        },
        {
            value: 'manager',
            label: 'Manager',
            description: 'Can manage team and data',
            icon: Settings
        },
        {
            value: 'admin',
            label: 'Admin',
            description: 'Full access to all features',
            icon: Crown
        }
    ];

    const onClosed = () => {
        setFilteredUsers([])
        setSearchQuery('')
        setAvailableUsers([])

        onClose()
    }

    // Fetch available users (replace with your API)
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(availableUsers);
        } else {
            const filtered = availableUsers?.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered || null);
        }

        if (isOpen) {
            setSearchQuery('');
            setSelectedUsers([]);
            setRole('viewer');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleUserSelection = (user: UsersType) => {
        if (user) {
            setSelectedUsers(prev =>
                prev.some(u => u.id === user.id)
                    ? prev.filter(u => u.id !== user.id)
                    : [...prev, user]
            );
        }
    };

    const isUserSelected = (user: UsersType) => {
        return selectedUsers.some(u => u.id === user.id);
    };

    const handleInvite = async () => {
        if (selectedUsers.length === 0) return;

        try {
            await onInviteUsers({
                users: selectedUsers,
                role: role,
                businessId: business?.id
            });

            // Close popup on success
            onClosed();
        } catch (error) {
            console.error('Error inviting users:', error);
        }
    };

    const getCustomerTypeColor = (type: string) => {
        switch (type) {
            case 'new':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'returning':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const isUserAlreadyInTeam = (userId: string) => {
        return existingUsers?.some(user => user.id == userId);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
                            Invite Team Members
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                            Add users to {business?.name || 'your business'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Role Selection */}
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Assign Role
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {roleOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => option.value != "viewer" ? "" : setRole(option.value)}
                                className={`p-3 rounded-xl border text-left ${option.value != "viewer" ? " opacity-[0.5] " : "  "} transition-all duration-200 ${role === option.value
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20'
                                    : 'bg-white dark:bg-gray-800 border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <option.icon className={`w-4 h-4 ${role === option.value
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`} />
                                    <span className={`text-sm font-medium ${role === option.value
                                        ? 'text-blue-900 dark:text-blue-300'
                                        : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {option.label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {option.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 gap-4 flex border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="relative grow ">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                    <button className=' items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg' onClick={() => getSerchUser()}>


                        search</button>
                </div>

                {/* Selected Users Count */}
                {selectedUsers.length > 0 && (
                    <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                )}

                {/* Users List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredUsers?.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery ? 'No users match your search' : 'No users available to invite'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {filteredUsers?.map((user) => {
                                const isSelected = isUserSelected(user);
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => !isUserAlreadyInTeam(user.id) && toggleUserSelection(user)}
                                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer 
    ${isUserAlreadyInTeam(user.id)
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:scale-[1.02]'
                                            }
    ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20'
                                                : 'bg-gray-50/50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {user.name}
                                                        </h3>
                                                        {user.hasSubscription && (
                                                            <Crown className="w-4 h-4 text-yellow-500" />
                                                        )}
                                                    </div>

                                                    {/* Write-up if user is already in the team */}
                                                    {isUserAlreadyInTeam(user.id) && (
                                                        <p className="text-xs text-red-500 mb-1">
                                                            This user is already part of the team!
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            {user.email}
                                                        </div>
                                                        {user.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-4 h-4" />
                                                                {user.phone}
                                                            </div>
                                                        )}
                                                        {user.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {user.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(user.customer_type)}`}>
                                                    {user.customer_type}
                                                </span>

                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                    ? 'bg-blue-500 border-blue-500 text-white'
                                                    : 'border-gray-300 dark:border-gray-500'
                                                    }`}>
                                                    {isSelected && <Check className="w-3 h-3" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected • {role} role
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={onClosed}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInvite}
                            disabled={selectedUsers.length === 0 || isLoading}
                            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${selectedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    Send Invites ({selectedUsers.length})
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default InviteUsersPopup;