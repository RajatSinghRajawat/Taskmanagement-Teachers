import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  MdClose,
  MdLogout
} from 'react-icons/md';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsOpen(true);
      } else {
        setIsMobile(false);
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:7001/api/auth/logout", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (e) { console.error(e); }
    finally {
      localStorage.clear();
      navigate("/");
      window.location.reload();
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdSpaceDashboard size={22} /> },
    { name: "Assignments", path: "/tasks", icon: <MdTaskAlt size={22} /> },
    { name: "Student Directory", path: "/students", icon: <MdPeopleOutline size={22} /> },
    { name: "Performance Analytics", path: "/reports", icon: <MdInsertChartOutlined size={22} /> },
    { name: "Learning Assets", path: "/materials", icon: <MdOutlineFolderZip size={22} /> },
    { name: "Notifications", path: "/notifications", icon: <MdNotificationsNone size={22} /> },
    { name: "Account Settings", path: "/profile", icon: <MdOutlinePersonOutline size={22} /> },
  ];

  const sidebarVariants = {
    open: { width: 280, transition: { duration: 0.3 } },
    closed: { width: 88, transition: { duration: 0.3 } },
    mobile: { x: 0, width: 280, transition: { duration: 0.3 } },
    mobileClosed: { x: -280, width: 280, transition: { duration: 0.3 } }
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        animate={isMobile ? (isMobileOpen ? 'mobile' : 'mobileClosed') : (isOpen ? 'open' : 'closed')}
        className={`${isMobile ? 'fixed' : 'relative'} h-screen bg-white text-slate-700 z-50 flex flex-col border-r border-slate-200 shadow-sm overflow-hidden font-sans`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
              <span className="font-display font-bold text-xl">T</span>
            </div>
            {(isMobile || isOpen) && (
              <span className="font-display font-bold text-2xl tracking-tight text-slate-800 whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                Tips-<span className="text-indigo-600">G</span>
              </span>
            )}
          </div>
          <button 
            onClick={isMobile ? () => setIsMobileOpen(false) : toggleSidebar} 
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 border border-slate-100 hover:border-indigo-100 shrink-0"
          >
            {isMobile ? <MdClose size={20} /> : (isOpen ? <MdMenuOpen size={20} /> : <MdMenu size={20} />)}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1 custom-scrollbar">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${isActive
                  ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-medium'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                    {item.icon}
                  </div>
                  {(isMobile || isOpen) && (
                    <span className="font-sans tracking-wide whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                      {item.name}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-indigo-600 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Profile Section */}
        <div className="p-4 mt-auto">
          <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-all duration-300 ${(!isMobile && !isOpen) ? 'flex flex-col items-center gap-4' : 'flex items-center gap-3'}`}>
            <Link 
              to="/profile" 
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={`flex items-center gap-3 flex-1 overflow-hidden group`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-sm shrink-0 relative group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-[10px] bg-white overflow-hidden flex items-center justify-center font-bold text-indigo-600 text-xs">
                   {user?.profileImage ? (
                     <img 
                       src={`http://localhost:7001/${user.profileImage}`} 
                       alt="Profile" 
                       className="w-full h-full object-cover" 
                     />
                   ) : (
                     user?.name ? user.name.charAt(0).toUpperCase() : 'T'
                   )}
                </div>
              </div>
              
              {(isMobile || isOpen) && (
                <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                  <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1 font-display">
                    {user?.name ? `${user.name.split(' ')[0]} ${user.gender === 'Female' ? 'Mam' : 'Sir'}` : 'Teacher'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Admin
                  </p>
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90 shrink-0`}
              title="Logout"
            >
              <MdLogout size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
