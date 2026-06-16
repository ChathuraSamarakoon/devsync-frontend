import { createContext, useState } from 'react';

export const WorkspaceContext = createContext();

// eslint-disable-next-line react/prop-types
export const WorkspaceProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  
  
  const [activeDMUser, setActiveDMUser] = useState(null);

  
  const [showTasks, setShowTasks] = useState(false); 

  return (
    <WorkspaceContext.Provider 
      value={{ 
        activeWorkspace, setActiveWorkspace, 
        activeChannel, setActiveChannel,
        activeDMUser, setActiveDMUser,
        showTasks, setShowTasks 
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};