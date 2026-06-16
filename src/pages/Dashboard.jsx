import { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import DirectMessageArea from '../components/DirectMessageArea'; 
import TaskArea from '../components/TaskArea'; 
import { WorkspaceContext } from '../context/WorkspaceContext';
import { FiMessageSquare } from 'react-icons/fi';

const Dashboard = () => {
  
  const { activeChannel, activeDMUser, showTasks } = useContext(WorkspaceContext);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area Logic */}
      {showTasks ? (
        <TaskArea />  
      ) : activeChannel ? (
        <ChatArea />
      ) : activeDMUser ? (
        <DirectMessageArea />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-background relative">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-outline/10">
            <FiMessageSquare className="text-4xl text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Welcome to DevSync</h2>
          <p className="text-outline text-sm max-w-md text-center">
            Select a workspace and choose a channel, direct message, or tasks from the sidebar to start collaborating.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;