import React from 'react';

const ChatMessage = ({ type, content }) => {
  return (
    <div className={`chat-message ${type}`}>
      <p>{content}</p>
    </div>
  );
};

export default ChatMessage;
