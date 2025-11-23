'use client'
import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Building2,
    Shield,
    Edit3,
    Trash2,
    UserX,
    UserCheck,
    Filter,
    Download,
    Eye,
    EyeOff
} from 'lucide-react';
import { getData, getOrgData } from '@/lib/createCookie';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { TeamMembersTable } from './components/TeamMembersTable';
import { UsersType } from '@/types/Customers';
import InviteUsersPopup from './components/InviteUsersPopup ';
import { addToTeamMultiple, chechAccess, getBusinessMembers } from '@/services/businesses/Businesses';
import { hasAccesse } from '../Authorization/HasAccess';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';



const TeamMembersPage = () => {
    const [hasAccess, setHasAccess] = useState<boolean | undefined>(false)
    const [teamMembers, setTeamMembers] = useState<UsersType[] | null>();
    const [loading, setLoading] = useState(true);
    const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
    const businessId = getOrgData();
    const userData = useSelector((state: RootState) => state.userDetails)

    // Fetch team members data

    useEffect(() => {
        const checkifHasAccess = async () => {
            let response = await hasAccesse();

            console.log("has access: ", response)

            setHasAccess(response)
        }

        const fetchTeamMembers = async () => {
            setLoading(true);
            try {
                // Replace with your actual API call
                const response = await getBusinessMembers(userData.id, businessId?.id);
                if (response) {
                    setTeamMembers(response);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching team members:', error);
                setLoading(false);
            }
        };

        if (businessId?.id) {
            fetchTeamMembers();
        }

        checkifHasAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter team members based on search and filters
    const filteredMembers = teamMembers?.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())


        return matchesSearch;
    });

    // Handle member selection
    const toggleMemberSelection = (memberId: string) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    // Handle select all / toggle
    const toggleSelectAll = () => {
        if (!filteredMembers || filteredMembers.length === 0) {
            setSelectedMembers([]);
            return;
        }

        setSelectedMembers(prev =>
            prev.length === filteredMembers.length
                ? []
                : filteredMembers.map((m: any) => m.id)
        );
    };

    // Action handlers
    const handleResendInvite = (memberId: string) => {
        console.log('Resending invite to:', memberId);
        setActionMenuOpen(null);
    };

    const handleDeactivate = (memberId: string) => {
        console.log('Deactivating member:', memberId);
        setActionMenuOpen(null);
    };

    const handleDelete = (memberId: string) => {
        console.log('Deleting member:', memberId);
        setActionMenuOpen(null);
    };

    const handleBulkAction = (action: string) => {
        console.log(`Performing ${action} on:`, selectedMembers);
        setSelectedMembers([]);
    };

    // Handle inviting users
    const handleInviteUsers = async ({ users, role, businessId }: { users: UsersType[]; role: string; businessId?: string }) => {
        setIsLoading(true);
        try {

            let response = await addToTeamMultiple(users, role, businessId)

            // Success handling
            console.log(response, ' Invites sent successfully');
        } catch (error) {
            console.error('Failed to send invites:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <>
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className=" gap-4">
                    <div className='flex flex-col items-start'>
                        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                            Team Members
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 ">
                            Manage team members and their access permissions
                        </p>
                    </div>
                    <div className='flex flex-col items-end'>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {teamMembers?.length} members
                            </span>
                            <button disabled={!hasAccess} onClick={() => setIsInvitePopupOpen(true)} className={` ${hasAccess ? " transition-all duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-purple-600 " : " opacity-[0.5] "}
                                flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-xl font-semibold  shadow-lg
                                `}>
                                <Plus className="w-5 h-5" />
                                Invite Member
                            </button>
                        </div>
                        <div className='text-red-300'>
                            {hasAccess ? " " : "you do not have access to this resource"}
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                    <div className="flex flex-col  gap-4 lg:gap-6 items-start lg:items-center">

                        {/* Search Input */}
                        <div className="relative flex-1 w-full grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search team members by name, email, or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        {/* Filters & Export */}
                        <div className="flex justify-end- gap-3 w-full  justify-start lg:justify-end">

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Analyst">Analyst</option>
                                <option value="Viewer">Viewer</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            {/* Export Button */}
                            <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50">
                                <Download className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>



                {/* Bulk Actions */}
                {selectedMembers.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-blue-700 dark:text-blue-300 font-medium">
                                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkAction('deactivate')}
                                    className="px-3 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                >
                                    <UserX className="w-4 h-4 inline mr-1" />
                                    Deactivate
                                </button>
                                <button
                                    onClick={() => handleBulkAction('delete')}
                                    className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 inline mr-1" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <TeamMembersTable handleDeactivate={handleDeactivate}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    roleFilter={roleFilter}
                    User={teamMembers}
                    selectedMembers={selectedMembers}
                    filteredMembers={filteredMembers}
                    handleResendInvite={handleResendInvite}
                    setActionMenuOpen={setActionMenuOpen}
                    toggleSelectAll={toggleSelectAll}
                    handleDelete={handleDelete}
                    toggleMemberSelection={toggleMemberSelection}
                    actionMenuOpen={actionMenuOpen} />
            </div>

            <InviteUsersPopup
                isOpen={isInvitePopupOpen}
                onClose={() => setIsInvitePopupOpen(false)}
                business={businessId}
                existingUsers={teamMembers} // Pass existing team members to avoid duplicates
                onInviteUsers={handleInviteUsers}
                isLoading={isLoading}
            />
        </>
    );
};


export default TeamMembersPage;