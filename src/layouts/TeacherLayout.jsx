import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { MdMenu } from 'react-icons/md';

const TeacherLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-30">
          <div className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Tips-G<span className="font-light text-slate-500"> Alwar</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors active:scale-95"
          >
            <MdMenu size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
