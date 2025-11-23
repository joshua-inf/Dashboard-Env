import { UsersType } from '@/types/Customers'
import { Building2, Mail, MoreVertical, Trash2, UserX } from 'lucide-react'
import React from 'react'
interface TableProps {
    User: UsersType[] | null | undefined
    selectedMembers: string[]
    filteredMembers: UsersType[] | null | undefined
    setActionMenuOpen: (data: string | null) => void
    toggleSelectAll: () => void
    toggleMemberSelection: (member: string) => void
    actionMenuOpen: string | null
    handleResendInvite: (data: string) => void
    handleDelete: (data: string) => void
    statusFilter: string
    searchQuery: string
    roleFilter: string
    handleDeactivate: (data: string) => void
}
export const TeamMembersTable = ({ handleDeactivate, searchQuery, statusFilter, roleFilter, User, selectedMembers, filteredMembers, handleResendInvite, setActionMenuOpen, toggleSelectAll, handleDelete, toggleMemberSelection, actionMenuOpen }: TableProps) => {
    return (
        <>
            {/* Team Members Table */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-700">
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.length === filteredMembers?.length && filteredMembers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Member
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Role
                                </th>
                                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Join Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Last Active
                                </th> */}
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                            {filteredMembers?.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(member.id)}
                                            onChange={() => toggleMemberSelection(member.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {member.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                                            <Shield className="w-3 h-3" />
                                            {member.role}
                                        </span> */}
                                    </td>
                                   
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <button
                                                onClick={() => setActionMenuOpen(actionMenuOpen === member.id ? null : member.id)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {actionMenuOpen === member.id && (
                                                <div className="absolute right-0 top-10 z-10 w-48 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg py-1">
                                                    <button
                                                        disabled
                                                        onClick={() => handleDeactivate(member.id)}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                        Deactivate
                                                    </button>
                                                    <button
                                                        disabled
                                                        onClick={() => handleDelete(member.id)}
                                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredMembers?.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                                ? 'No team members match your filters'
                                : 'No team members found'
                            }
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
