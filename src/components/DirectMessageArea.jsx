import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { FiSend, FiUser, FiImage, FiX } from 'react-icons/fi'; 
import axios from 'axios';

const DirectMessageArea = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { activeDMUser } = useContext(WorkspaceContext);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // File Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Typing state
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeDMUser) return;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/dms/${activeDMUser._id}`, config);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching direct messages:", error);
      }
    };
    fetchMessages();
  }, [activeDMUser]);

  
  useEffect(() => {
    if (!socket || !activeDMUser) return;

    const handleReceiveDM = (newMessage) => {
      const isFromActiveUser = newMessage.sender._id === activeDMUser._id;
      const isFromMe = newMessage.sender._id === user._id;
      const isToActiveUser = newMessage.receiver === activeDMUser._id;

      if ((isFromActiveUser && !isFromMe) || (isFromMe && isToActiveUser)) {
         if (!isFromMe) {
           setMessages((prev) => [...prev, newMessage]);
         }
      }
    };

    const handleTyping = (data) => {
      if (data.userName === activeDMUser.name) {
        setTypingUser(data.userName);
      }
    };

    const handleStopTyping = () => {
      setTypingUser(null);
    };

    socket.on('new_dm', handleReceiveDM);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('new_dm', handleReceiveDM);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, activeDMUser, user._id]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (!socket || !activeDMUser) return;

    socket.emit('typing', { channelId: activeDMUser._id, userName: user.name });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { channelId: activeDMUser._id });
    }, 2000);
  };

  
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!inputValue.trim() && !selectedFile) || !activeDMUser) return;

    setIsSending(true);
    const messageContent = inputValue;
    setInputValue(''); 

    socket.emit('stop_typing', { channelId: activeDMUser._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      const token = localStorage.getItem('token');
      let attachmentUrl = null;

      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadConfig = {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          }
        };

        const uploadRes = await axios.post('/api/upload', formData, uploadConfig);
        attachmentUrl = uploadRes.data.url; 
        setSelectedFile(null); 
      }

      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const messageData = {
        content: messageContent,
        receiverId: activeDMUser._id,
        attachment: attachmentUrl, 
      };

      const { data } = await axios.post('/api/dms', messageData, config);

      setMessages((prev) => [...prev, data]);

    } catch (error) {
      console.error("Error sending direct message:", error);
      alert("Failed to send message!");
      setInputValue(messageContent); 
    } finally {
      setIsSending(false);
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!activeDMUser) return null;

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* DM Header */}
      <div className="h-16 border-b border-outline/20 flex items-center px-6 bg-surface-container/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-sm font-bold text-primary">
              {activeDMUser.name.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-container ${activeDMUser.status === 'online' ? 'bg-green-500' : 'bg-outline/50'}`}></div>
          </div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            {activeDMUser.name}
          </h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <FiUser className="text-4xl mb-4" />
            <p>This is the beginning of your direct message history with {activeDMUser.name}.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender._id === user?._id;
            return (
              <div key={msg._id} className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {msg.sender.name.charAt(0).toUpperCase()}
                </div>
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium text-on-surface">{msg.sender.name}</span>
                    <span className="text-[10px] text-outline font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-secondary-container text-on-secondary-container rounded-2xl rounded-tr-sm' : 'bg-surface-container-highest text-on-surface rounded-2xl rounded-tl-sm'}`}>
                    
                    {msg.attachment && (
                      <div className="mb-2">
                        <img 
                          src={`http://localhost:5000${msg.attachment}`} 
                          alt="attachment" 
                          className="max-w-xs md:max-w-sm rounded-md border border-outline/10"
                        />
                      </div>
                    )}
                    
                    {msg.content && <p>{msg.content}</p>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <div className="px-4 py-1 h-6 shrink-0 bg-background">
        {typingUser && (
          <div className="text-xs font-medium text-primary italic animate-pulse">
            {typingUser} is typing...
          </div>
        )}
      </div>

      {/* File Preview Area  */}
      {selectedFile && (
        <div className="px-6 py-2 bg-surface-container-highest border-t border-outline/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FiImage className="text-primary" />
            <span className="text-sm text-on-surface truncate max-w-xs">{selectedFile.name}</span>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }} 
            className="text-error hover:text-error/80 transition-colors p-1"
            title="Remove attachment"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-background shrink-0 border-t border-outline/10 pt-2">
        <form onSubmit={handleSendMessage} className="bg-surface-container border border-outline/20 rounded-lg p-1 flex items-center focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
          
          {/* File Upload Button */}
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2.5 ml-1 text-outline hover:text-primary transition-colors disabled:opacity-50"
            disabled={isSending}
            title="Attach an image"
          >
            <FiImage className="text-lg" />
          </button>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
          />

          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange} 
            placeholder={selectedFile ? "Add a message..." : `Message ${activeDMUser.name}...`} 
            disabled={isSending}
            className="flex-1 bg-transparent text-on-surface focus:outline-none px-3 py-2.5 disabled:opacity-50"
          />
          
          <button 
            type="submit"
            disabled={(!inputValue.trim() && !selectedFile) || isSending}
            className="p-2.5 mr-1 bg-secondary-container text-on-secondary-container rounded-md hover:bg-secondary hover:text-on-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectMessageArea;