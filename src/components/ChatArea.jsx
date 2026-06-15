import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { WorkspaceContext } from '../context/WorkspaceContext';
import { FiSend, FiHash, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';

const ChatArea = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { activeChannel } = useContext(WorkspaceContext);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChannel) return;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/messages/${activeChannel._id}`, config);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [activeChannel]);

  
  useEffect(() => {
    if (!socket || !activeChannel) return;

    socket.emit('join_channel', String(activeChannel._id));

    const handleReceiveMessage = (newMessage) => {
      
      if (newMessage.sender._id !== user._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.emit('leave_channel', String(activeChannel._id));
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeChannel, user._id]);

  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChannel) return;

    setIsSending(true);
    const messageContent = inputValue;
    setInputValue(''); 

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const messageData = {
        content: messageContent,
        channelId: activeChannel._id,
      };

      const { data } = await axios.post('/api/messages', messageData, config);

      
      setMessages((prev) => [...prev, data]);

      
      socket.emit('send_message', { ...data, channelId: activeChannel._id });

    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message!");
      setInputValue(messageContent); 
    } finally {
      setIsSending(false);
    }
  };

  if (!activeChannel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background relative">
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-outline/10">
          <FiMessageSquare className="text-4xl text-primary/40" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Welcome to DevSync</h2>
        <p className="text-outline text-sm max-w-md text-center">
          Select a workspace and choose a channel from the sidebar to start collaborating with your team.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative h-full">
      <div className="h-16 border-b border-outline/20 flex items-center px-6 bg-surface-container/50 backdrop-blur-sm shrink-0">
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <FiHash className="text-outline" /> {activeChannel.name}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <FiMessageSquare className="text-4xl mb-4" />
            <p>No messages here yet. Start the conversation!</p>
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
                  <div className={`px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-primary-container text-on-primary-container rounded-2xl rounded-tr-sm' : 'bg-surface-container-highest text-on-surface rounded-2xl rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background shrink-0 border-t border-outline/10">
        <form onSubmit={handleSendMessage} className="bg-surface-container border border-outline/20 rounded-lg p-1 flex items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${activeChannel.name}...`} 
            disabled={isSending}
            className="flex-1 bg-transparent text-on-surface focus:outline-none px-3 py-2.5 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="p-2.5 mr-1 bg-primary-container text-on-primary-container rounded-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;