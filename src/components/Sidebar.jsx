import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiHash, FiMessageSquare, FiSettings, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="w-[280px] h-screen bg-surface-container border-r border-outline/20 flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 border-b border-outline/20 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary-container font-bold text-lg">
          DS
        </div>
        <div>
          <h2 className="font-bold text-on-surface tracking-wide">DevSync</h2>
          <p className="text-xs text-outline font-mono">Engineering Team</p>
        </div>
      </div>

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        {/* Channels Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Channels</span>
            <button className="text-outline hover:text-primary transition-colors">
              <FiPlus />
            </button>
          </div>
          <ul className="space-y-1">
            {/* Active Channel Example */}
            <li>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 bg-secondary-container/20 text-secondary rounded-md">
                <FiMessageSquare className="text-sm" />
                <span className="font-medium text-sm">#general</span>
              </button>
            </li>
            {/* Inactive Channel Example */}
            <li>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-outline hover:bg-surface-bright/50 hover:text-on-surface rounded-md transition-colors">
                <FiHash className="text-sm" />
                <span className="text-sm">#frontend-dev</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-outline hover:bg-surface-bright/50 hover:text-on-surface rounded-md transition-colors">
                <FiHash className="text-sm" />
                <span className="text-sm">#bug-reports</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Direct Messages Section */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Direct Messages</span>
            <button className="text-outline hover:text-primary transition-colors">
              <FiPlus />
            </button>
          </div>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-outline hover:bg-surface-bright/50 hover:text-on-surface rounded-md transition-colors">
                <div className="relative">
                  <div className="w-5 h-5 bg-tertiary-container rounded-full flex items-center justify-center text-[10px] text-on-tertiary-container font-bold">
                    A
                  </div>
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-secondary rounded-full border border-surface-container"></div>
                </div>
                <span className="text-sm">Alex Chen</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-outline/20">
        <div className="flex items-center gap-2 mb-4 px-2">
           <div className="w-8 h-8 bg-surface-bright rounded-full flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-sm font-medium text-on-surface truncate">{user?.name || 'User'}</p>
             <p className="text-xs text-outline truncate">{user?.email}</p>
           </div>
        </div>
        <div className="flex justify-between px-2 text-outline">
          <button className="hover:text-primary transition-colors p-1"><FiSettings /></button>
          <button className="hover:text-primary transition-colors p-1"><FiUser /></button>
          <button onClick={logout} className="hover:text-error transition-colors p-1"><FiLogOut /></button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;