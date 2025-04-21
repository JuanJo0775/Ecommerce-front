import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';
import api from '../../api';
import ChatMessage from './ChatMessage';
import ChatSuggestion from './ChatSuggestion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente virtual de Shoppit. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);
  
  // Sugerencias iniciales para el usuario
  const initialSuggestions = [
    "¿Cómo realizo una compra?",
    "¿Cuáles son los métodos de pago?",
    "¿Tienen servicio de envío?",
    "¿Cómo encuentro productos electrónicos?"
  ];

  // Generar un ID de sesión al cargar
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}`);
    }
    scrollToBottom();
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Enviar mensaje al backend
      const response = await api.post('/chatbot/message/', {
        message: inputText,
        session_id: sessionId
      });
      
      // Calcular un retraso proporcional al tamaño de la respuesta para simular escritura
      const typingDelay = Math.min(1000 + response.data.response.length * 5, 3000);
      
      // Agregar respuesta del bot después de un retraso para efecto natural
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
        setIsTyping(false);
      }, typingDelay);
    } catch (error) {
      console.error('Error al comunicarse con el chatbot:', error);
      
      // Respuesta de fallback en caso de error
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'Lo siento, estoy teniendo problemas para responder. Por favor, intenta de nuevo más tarde.' 
        }]);
        setIsTyping(false);
      }, 500);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    // Opcionalmente, enviar automáticamente la sugerencia
    const syntheticEvent = { preventDefault: () => {} };
    handleSubmit(syntheticEvent);
  };

  return (
    <div className="chatbot-container">
      {/* Botón flotante para abrir/cerrar el chat */}
      <button 
        className="chatbot-toggle"
        onClick={toggleChat}
        style={{ backgroundColor: '#6050DC' }}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
      
      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Cabecera */}
          <div className="chatbot-header" style={{ backgroundColor: '#6050DC' }}>
            <div className="chatbot-title">
              <FaRobot className="chatbot-icon" />
              <h5>Asistente de Shoppit</h5>
            </div>
            <button className="close-button" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          
          {/* Área de mensajes */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            
            {/* Indicador de "escribiendo..." */}
            {isTyping && <div className="typing-indicator"><div></div><div></div><div></div></div>}
            
            {/* Sugerencias (solo se muestran al inicio) */}
            {messages.length === 1 && (
              <div className="chatbot-suggestions">
                {initialSuggestions.map((suggestion, index) => (
                  <ChatSuggestion 
                    key={index} 
                    text={suggestion} 
                    onClick={() => handleSuggestionClick(suggestion)} 
                  />
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Formulario de entrada */}
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              style={{ backgroundColor: '#6050DC' }}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;