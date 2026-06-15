import { createContext, useState } from 'react';

export const WorkspaceContext = createContext();

// eslint-disable-next-line react/prop-types
export const WorkspaceProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);

  return (
    <WorkspaceContext.Provider 
      value={{ 
        activeWorkspace, setActiveWorkspace, 
        activeChannel, setActiveChannel 
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};