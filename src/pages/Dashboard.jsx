import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Chat Area (Placeholder for now) */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="h-16 border-b border-outline/20 flex items-center px-6 bg-surface-container/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="text-outline">#</span> general
          </h2>
          <span className="mx-4 text-outline/30">|</span>
          <p className="text-sm text-outline">Company-wide announcements and general chatter.</p>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end">
          <div className="text-center text-outline font-mono text-sm mb-4">
            Welcome to the #general channel!
          </div>
        </div>

        {/* Message Input Area */}
        <div className="p-4 bg-background">
          <div className="bg-surface-container border border-outline/20 rounded-lg p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <input 
              type="text" 
              placeholder="Message #general..." 
              className="w-full bg-transparent text-on-surface focus:outline-none px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;