import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { BusinessType } from "@/types/businesses"
import { softDeleteBusiness } from "@/services/api/apiBusiness"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"

type DeleteDiagProps = {
    isOpen: boolean
    onClose: () => void
    data: BusinessType
    getBusinessByUserID: () => void
}

export const DeleteDiag = ({ isOpen, onClose, data, getBusinessByUserID }: DeleteDiagProps) => {
    const [loading, setLoading] = useState(false)

    const onDelete = async () => {
        setLoading(true)
        try {
            await softDeleteBusiness(data?.id)
            onClose()
            getBusinessByUserID()
        } catch (err) {
            console.error("Error deleting business:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-red-200/50 dark:border-red-800/50 shadow-2xl p-6 z-[9999]">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Delete Business?
                    </DialogTitle>
                    
                    <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        You&apos;re about to delete <strong>{data.business_name}</strong>. This will permanently remove all business data and cannot be undone.
                    </DialogDescription>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </div>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}