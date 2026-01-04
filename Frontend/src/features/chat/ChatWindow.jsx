import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import Input from '../../components/ui/Input';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'user', content: input }]);
      setInput('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage key={index} type={message.type} content={message.content} />
        ))}
      </div>
      <div className="chat-input">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
