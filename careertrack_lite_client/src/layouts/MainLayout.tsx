import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CareerTrack Lite
                    </h1>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
