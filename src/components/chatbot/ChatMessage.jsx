import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`chat-message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-avatar">
        {isBot ? <FaRobot /> : <FaUser />}
      </div>
      <div className="message-content">
        <div className="message-text">
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;