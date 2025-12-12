import { useContext } from "react";
import { useAuth } from "@app/providers/AuthProvider";


const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-4.5l-4 4m0 0l4 4m-4-4h12" />
    </svg>
);
// --- LOGOUT MODAL COMPONENT ---
export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
            {/* Modal */}
            <div className="relative w-full max-w-sm p-6 mx-4 bg-white rounded-2xl shadow-xl transform transition-all animate-scale-in">
                <div className="flex flex-col items-center text-center">
                    
                    {/* Icon */}
                    <div className="p-4 bg-red-50 rounded-full">
                         <LogoutIcon />
                    </div>

                    {/* Text Content */}
                    <h3 className="mt-5 text-2xl font-bold text-gray-800">Oh no! You're leaving...</h3>
                    <p className="mt-2 text-base text-gray-600">Are you sure you want to log out?</p>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full mt-8 space-y-3">
                        <button 
                            onClick={onConfirm}
                            className="w-full px-4 py-3 text-lg font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-300"
                        >
                            Yes, Log Me Out
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full px-4 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors duration-300"
                        >
                            Naah, Just Kidding
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};