import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <ChatArea />
    </div>
  );
};

export default Dashboard;