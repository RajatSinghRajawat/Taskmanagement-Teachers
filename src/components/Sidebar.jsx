import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdSpaceDashboard, 
  MdTaskAlt, 
  MdPeopleOutline, 
  MdInsertChartOutlined, 
  MdOutlineFolderZip,
  MdNotificationsNone,
  MdOutlinePersonOutline,
  MdMenuOpen,
  MdMenu,
  MdClose
} from 'react-icons/md';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsOpen(true); // Always fully open when in mobile overlay mode
      } else {
        setIsMobile(false);
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdSpaceDashboard size={24} /> },
    { name: "Tasks", path: "/tasks", icon: <MdTaskAlt size={24} /> },
    { name: "Students", path: "/students", icon: <MdPeopleOutline size={24} /> },
    { name: "Reports", path: "/reports", icon: <MdInsertChartOutlined size={24} /> },
    { name: "Materials", path: "/materials", icon: <MdOutlineFolderZip size={24} /> },
    { name: "Notifications", path: "/notifications", icon: <MdNotificationsNone size={24} /> },
    { name: "Profile", path: "/profile", icon: <MdOutlinePersonOutline size={24} /> },
  ];

  const sidebarClasses = `
    ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative z-10'}
    h-screen bg-white text-slate-800 transition-all duration-300 ease-in-out flex flex-col shadow-xl border-r border-slate-200
    ${isMobile ? (isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72') : (isOpen ? 'w-72' : 'w-20')}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className={`font-bold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden transition-all duration-300 flex-1 whitespace-nowrap ${(!isMobile && !isOpen) ? 'opacity-0 -translate-x-full w-0 hidden' : 'opacity-100 translate-x-0'}`}>
            Tips-G<span className="font-light text-slate-500"> Alwar</span>
          </div>
          
          {/* Mobile Close Button or Desktop Toggle */}
          {isMobile ? (
            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95 flex-shrink-0"
            >
              <MdClose size={24} />
            </button>
          ) : (
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            >
              {isOpen ? <MdMenuOpen size={24} /> : <MdMenu size={24} />}
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
                if (isMobile) setIsMobileOpen(false);
              }}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-[inset_4px_0_0_0_rgba(37,99,235,1)] font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-500 font-medium'
                }
              `}
            >
              <div className={`transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${(!isMobile && !isOpen) ? 'mx-auto' : 'ml-1'}`}>
                {item.icon}
              </div>
              
              <span className={`tracking-wide whitespace-nowrap transition-all duration-300 ${(!isMobile && !isOpen) ? 'opacity-0 -translate-x-4 w-0 hidden' : 'opacity-100 translate-x-0'}`}>
                {item.name}
              </span>

              {/* Tooltip for collapsed state (Desktop only) */}
              {!isMobile && !isOpen && (
                <div className="absolute left-16 bg-white text-slate-700 text-sm font-semibold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 translate-x-[-10px] group-hover:translate-x-0">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Info (Bottom) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${(!isMobile && !isOpen) ? 'justify-center' : 'justify-start px-2'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md ring-2 ring-white">
              T
            </div>
            <div className={`transition-all duration-300 whitespace-nowrap flex-1 ${(!isMobile && !isOpen) ? 'opacity-0 -translate-x-4 w-0 hidden' : 'opacity-100 translate-x-0'}`}>
              <p className="text-sm font-bold text-slate-800 leading-tight">Teacher Name</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">teacher@school.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
