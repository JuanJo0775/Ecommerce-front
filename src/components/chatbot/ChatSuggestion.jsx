import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const ChatSuggestion = ({ text, onClick }) => {
  return (
    <div className="chat-suggestion" onClick={onClick}>
      <span>{text}</span>
      <FaChevronRight className="suggestion-icon" />
    </div>
  );
};

export default ChatSuggestion;