import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-end px-8">
            <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-slate-200">{user?.name}</span>
                    <span className="text-xs text-slate-400">{user?.email}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
