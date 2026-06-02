import React from 'react'
import { useAuth } from '../hooks/useAuthGuard';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {

    const { logout } = useAuth();
    const navigate = useNavigate();
     
    const handleLogout = () => {
        logout();
        navigate('/login');
    }; 

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Logout</h1>
            <p className="text-lg mb-4">Are you sure you want to logout?</p>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
                Logout
            </button> 
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 rounded" onClick={() => navigate('/')}>
                Cancel
            </button>
        </div>

    );
}

export default LogoutPage