
export default function DeleteBox({showDeleteModal, cancelDelete, confirmDelete}) {

    return 
<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                        {/* Modal box only */}
                        <div className="relative bg-white rounded-2xl p-6 w-80 max-w-sm shadow-xl border border-gray-100 pointer-events-auto">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h2>
                            <p className="text-sm text-gray-500 mb-5">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
}