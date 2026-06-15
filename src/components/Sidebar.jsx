import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WorkspaceContext } from '../context/WorkspaceContext'; // අලුතින් ගෙනාවා
import { 
  FiHash, FiMessageSquare, FiSettings, FiUser, 
  FiLogOut, FiPlus, FiFolder, FiX 
} from 'react-icons/fi';
import axios from 'axios';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  

  const { activeWorkspace, setActiveWorkspace, activeChannel, setActiveChannel } = useContext(WorkspaceContext);
  
  // Workspace Modal & Data States
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  
  // Channel Modal & Data States
  const [channels, setChannels] = useState([]);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/workspaces', config);
        setWorkspaces(data);
        if (data.length > 0) {
          setActiveWorkspace(data[0]);
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    fetchWorkspaces();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  useEffect(() => {
    const fetchChannels = async () => {
      if (!activeWorkspace) return;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const { data } = await axios.get(`/api/channels/${activeWorkspace._id}`, config);
        setChannels(data);
        
        if (data.length > 0) {
          setActiveChannel(data[0]);
        } else {
          setActiveChannel(null); 
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    fetchChannels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace]); 

  
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        '/api/workspaces', 
        { name: newWorkspaceName, description: newWorkspaceDesc }, 
        config
      );
      setWorkspaces([...workspaces, data]);
      setActiveWorkspace(data);
      setIsModalOpen(false); 
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("Failed to create workspace!");
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim() || !activeWorkspace) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.post(
        '/api/channels', 
        { name: newChannelName, workspaceId: activeWorkspace._id }, 
        config
      );
      
      setChannels([...channels, data]);
      setActiveChannel(data);
      setIsChannelModalOpen(false); 
      setNewChannelName('');
    } catch (error) {
      console.error("Error creating channel:", error);
      alert("Failed to create channel!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-[280px] h-screen bg-surface-container border-r border-outline/20 flex flex-col z-10 relative">
        
        {/* Dynamic Workspace Header */}
        <div className="p-4 border-b border-outline/20 flex items-center justify-between group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary-container font-bold text-lg shrink-0">
              {activeWorkspace ? activeWorkspace.name.substring(0, 2).toUpperCase() : 'DS'}
            </div>
            <div className="truncate">
              <h2 className="font-bold text-on-surface tracking-wide truncate">
                {activeWorkspace ? activeWorkspace.name : 'No Workspaces'}
              </h2>
              <p className="text-xs text-outline font-mono truncate">
                {activeWorkspace ? 'Team Workspace' : 'Create one below'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-outline hover:text-primary transition-colors p-1.5 rounded bg-surface-bright/50 opacity-0 group-hover:opacity-100"
            title="Create Workspace"
          >
            <FiPlus />
          </button>
        </div>

        {/* Navigation Areas */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* Workspaces List Section */}
          {workspaces.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">Your Workspaces</span>
              </div>
              <ul className="space-y-1">
                {workspaces.map((ws) => (
                  <li key={ws._id}>
                    <button 
                      onClick={() => setActiveWorkspace(ws)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                        activeWorkspace?._id === ws._id 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-outline hover:bg-surface-bright/50 hover:text-on-surface'
                      }`}
                    >
                      <FiFolder className="text-sm shrink-0" />
                      <span className="text-sm truncate">{ws.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dynamic Channels Section */}
          {activeWorkspace && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">Channels</span>
                <button 
                  onClick={() => setIsChannelModalOpen(true)}
                  className="text-outline hover:text-primary transition-colors"
                  title="Create Channel"
                >
                  <FiPlus />
                </button>
              </div>
              
              {channels.length === 0 ? (
                <p className="text-xs text-outline px-2 italic">No channels yet.</p>
              ) : (
                <ul className="space-y-1">
                  {channels.map((channel) => (
                    <li key={channel._id}>
                      <button 
                        onClick={() => setActiveChannel(channel)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                          activeChannel?._id === channel._id
                            ? 'bg-secondary-container/20 text-secondary font-medium'
                            : 'text-outline hover:bg-surface-bright/50 hover:text-on-surface'
                        }`}
                      >
                        <FiHash className="text-sm shrink-0" />
                        <span className="text-sm truncate">{channel.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-outline/20">
          <div className="flex items-center gap-2 mb-4 px-2">
             <div className="w-8 h-8 bg-surface-bright rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium text-on-surface truncate">{user?.name || 'User'}</p>
               <p className="text-[10px] text-outline truncate">{user?.email}</p>
             </div>
          </div>
          <div className="flex justify-between px-2 text-outline">
            <button className="hover:text-primary transition-colors p-1"><FiSettings /></button>
            <button className="hover:text-primary transition-colors p-1"><FiUser /></button>
            <button onClick={logout} className="hover:text-error transition-colors p-1"><FiLogOut /></button>
          </div>
        </div>
      </div>

      {/* Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface-container w-full max-w-md p-6 rounded-2xl border border-outline/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface">Create Workspace</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-error transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleCreateWorkspace}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-on-surface mb-1">Name</label>
                <input 
                  type="text" required value={newWorkspaceName} onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full bg-background border border-outline/30 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. Engineering Team"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                <textarea 
                  value={newWorkspaceDesc} onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  className="w-full bg-background border border-outline/30 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary resize-none"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-outline hover:text-on-surface">Cancel</button>
                <button type="submit" disabled={isLoading || !newWorkspaceName.trim()} className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm">
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Channel Modal  */}
      {isChannelModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface-container w-full max-w-sm p-6 rounded-2xl border border-outline/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface">Create Channel</h3>
              <button onClick={() => setIsChannelModalOpen(false)} className="text-outline hover:text-error transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-on-surface mb-1">Channel Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">#</span>
                  <input 
                    type="text" 
                    required
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full bg-background border border-outline/30 rounded-lg pl-8 pr-4 py-2.5 text-on-surface focus:outline-none focus:border-primary"
                    placeholder="e.g. bug-reports"
                  />
                </div>
                <p className="text-[10px] text-outline mt-1">Names must be lowercase, without spaces.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsChannelModalOpen(false)} className="px-4 py-2 text-sm text-outline hover:text-on-surface">Cancel</button>
                <button type="submit" disabled={isLoading || !newChannelName.trim()} className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm">
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;