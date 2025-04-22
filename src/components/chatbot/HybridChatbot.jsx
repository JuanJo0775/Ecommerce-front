import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaComments, FaTimes } from 'react-icons/fa';
import api from '../../api';
import './HybridChatbot.css';

// Tiempo de espera antes de usar el chatbot local (en milisegundos)
const CHATBASE_TIMEOUT = 6000;

const HybridChatbot = () => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [chatConfig, setChatConfig] = useState(null);
  const [usingLocalBot, setUsingLocalBot] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente virtual de Shoppit. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);
  const chatbaseResponseTimeoutRef = useRef(null);

  // Sugerencias iniciales para el usuario
  const initialSuggestions = [
    "¿Cómo realizo una compra?",
    "¿Cuáles son los métodos de pago?",
    "¿Tienen servicio de envío?",
    "¿Cómo encuentro productos electrónicos?"
  ];

  // Obtener la configuración de Chatbase del backend
  useEffect(() => {
    const fetchChatbaseConfig = async () => {
      try {
        const response = await api.get('/chatbase/config/');
        setChatConfig(response.data);
      } catch (error) {
        console.error('Error al obtener configuración de Chatbase:', error);
        // Configuración de respaldo si el backend no responde
        setChatConfig({
          embedId: '9n0GIwiCpgFkyUxwqfl0l',
          domain: 'www.chatbase.co'
        });
      }
    };

    // Generar un ID de sesión al cargar
    if (!sessionId) {
      setSessionId(`session_${Date.now()}`);
    }

    fetchChatbaseConfig();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar Chatbase cuando tengamos la configuración
  useEffect(() => {
    if (!chatConfig) return;

    // Inicializar el script de Chatbase
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...params) => target(prop, ...params);
        }
      });
    }

    // Cargar el script de Chatbase
    if (!document.getElementById(chatConfig.embedId)) {
      const script = document.createElement("script");
      script.src = `https://${chatConfig.domain}/embed.min.js`;
      script.id = chatConfig.embedId;
      script.domain = chatConfig.domain;
      document.body.appendChild(script);

      script.onload = () => {
        setIsInitialized(true);
        updateUserInfo();
        
        // Configurar Chatbase para estar oculto por defecto
        window.chatbase('hide');
        
        // Registrar evento para interceptar mensajes de Chatbase
        window.chatbase('on', 'message:received', (event) => {
          console.log('Mensaje recibido de Chatbase:', event);
          // Puedes añadir lógica para registrar respuestas de Chatbase en tu sistema
        });
      };
    } else if (!isInitialized) {
      setIsInitialized(true);
      updateUserInfo();
    }

    return () => {
      // Limpiar el chatbot cuando el componente se desmonte
      if (window.chatbase) {
        window.chatbase('hide');
      }
      // Limpiar el timeout si existe
      if (chatbaseResponseTimeoutRef.current) {
        clearTimeout(chatbaseResponseTimeoutRef.current);
      }
    };
  }, [chatConfig, isAuthenticated, username]);

  // Función para obtener el hash del backend y actualizar la info del usuario en Chatbase
  const updateUserInfo = async () => {
    if (isAuthenticated && username) {
      try {
        // Obtener el hash seguro desde el backend
        const response = await api.get('/chatbase/get_hash/');
        
        // Configurar usuario en Chatbase con el hash generado en el backend
        window.chatbase('updateUser', {
          userId: response.data.userId,
          userHash: response.data.userHash,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName
        });

        console.log('Usuario autenticado con Chatbase');
      } catch (error) {
        console.error('Error al obtener hash para Chatbase:', error);
        
        // Si falla la autenticación segura, podemos seguir usando Chatbase sin identificación
        window.chatbase('updateUser', {
          firstName: username
        });
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para alternar la visibilidad del chat
  const toggleChat = () => {
    if (isVisible) {
      setIsVisible(false);
      // Si estamos usando Chatbase y no el bot local, ocultarlo
      if (!usingLocalBot && window.chatbase) {
        window.chatbase('hide');
      }
    } else {
      setIsVisible(true);
      // Si no estamos usando el bot local, mostrar Chatbase
      if (!usingLocalBot && window.chatbase && isInitialized) {
        window.chatbase('show');
      }
    }
  };

  // Cambiar entre chat local y Chatbase
  const toggleChatType = () => {
    setUsingLocalBot(!usingLocalBot);
    
    if (!usingLocalBot) {
      // Cambiando a bot local, ocultar Chatbase
      if (window.chatbase) {
        window.chatbase('hide');
      }
    } else {
      // Cambiando a Chatbase, ocultar el bot local mostrando Chatbase
      if (window.chatbase && isInitialized && isVisible) {
        window.chatbase('show');
      }
    }
  };

  // Función para usar el chatbot local
  const handleLocalChatSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Enviar mensaje al backend (chatbot local)
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
      console.error('Error al comunicarse con el chatbot local:', error);
      
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

  // Función para combinar ambos chatbots
  const handleHybridSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Si estamos usando explícitamente el bot local, usarlo
    if (usingLocalBot) {
      handleLocalChatSubmit(e);
      return;
    }
    
    // De lo contrario, intentar con Chatbase primero, con fallback al bot local
    if (isInitialized && window.chatbase) {
      // Agregar mensaje del usuario a la interfaz
      const userMessage = { sender: 'user', text: inputText };
      setMessages(prev => [...prev, userMessage]);
      
      // Mostrar indicador de escritura
      setIsTyping(true);
      
      // Enviar mensaje a Chatbase
      window.chatbase('sendMessage', inputText);
      
      // Limpiar el input
      setInputText('');
      
      // Establecer un timeout para usar el bot local si Chatbase no responde a tiempo
      chatbaseResponseTimeoutRef.current = setTimeout(() => {
        console.log('Chatbase no respondió a tiempo, usando bot local');
        
        // Enviar al chatbot local como respaldo
        api.post('/chatbot/message/', {
          message: userMessage.text,
          session_id: sessionId
        })
        .then(response => {
          setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
        })
        .catch(error => {
          console.error('Error en el bot local de respaldo:', error);
          setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: 'Lo siento, no pude procesar tu consulta en este momento. Por favor, intenta de nuevo más tarde.' 
          }]);
        })
        .finally(() => {
          setIsTyping(false);
        });
      }, CHATBASE_TIMEOUT);
      
      // Registrar el evento de mensaje recibido para limpiar el timeout
      window.chatbase('on', 'message:received', () => {
        if (chatbaseResponseTimeoutRef.current) {
          clearTimeout(chatbaseResponseTimeoutRef.current);
          chatbaseResponseTimeoutRef.current = null;
          setIsTyping(false);
        }
      });
    } else {
      // Si Chatbase no está inicializado, usar bot local directamente
      handleLocalChatSubmit(e);
    }
  };

  // Función para manejar sugerencias predefinidas
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    // Enviar automáticamente la sugerencia
    const syntheticEvent = { preventDefault: () => {} };
    if (usingLocalBot) {
      handleLocalChatSubmit(syntheticEvent);
    } else {
      handleHybridSubmit(syntheticEvent);
    }
  };

  // Renderizar el bot local
  const renderLocalBot = () => (
    <div className="chatbot-window">
      {/* Cabecera */}
      <div className="chatbot-header" style={{ backgroundColor: '#6050DC' }}>
        <div className="chatbot-title">
          <FaComments className="chatbot-icon" />
          <h5>Asistente de Shoppit</h5>
        </div>
        <div className="chatbot-controls">
          <button 
            className="chatbot-toggle-type" 
            onClick={toggleChatType}
            title="Cambiar a Chatbase"
          >
            CB
          </button>
          <button className="close-button" onClick={toggleChat}>
            <FaTimes />
          </button>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
            <div className="message-avatar">
              {msg.sender === 'bot' ? <FaComments /> : <FaComments />}
            </div>
            <div className="message-content">
              <div className="message-text">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicador de "escribiendo..." */}
        {isTyping && <div className="typing-indicator"><div></div><div></div><div></div></div>}
        
        {/* Sugerencias (solo se muestran al inicio) */}
        {messages.length === 1 && (
          <div className="chatbot-suggestions">
            {initialSuggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="chat-suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Formulario de entrada */}
      <form className="chatbot-input" onSubmit={handleLocalChatSubmit}>
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
          <FaComments />
        </button>
      </form>
    </div>
  );

  return (
    <div className="hybrid-chatbot-container">
      {/* Botón para abrir/cerrar chat */}
      <button 
        className={`hybrid-chatbot-toggle ${isVisible ? 'chatbot-active' : ''}`}
        onClick={toggleChat}
        style={{ backgroundColor: isVisible ? '#d84848' : '#6050DC' }}
        aria-label={isVisible ? "Cerrar asistente" : "Abrir asistente"}
      >
        {isVisible ? <FaTimes /> : <FaComments />}
      </button>
      
      {/* Mostrar el chatbot local cuando sea necesario */}
      {isVisible && usingLocalBot && renderLocalBot()}
    </div>
  );
};

export default HybridChatbot;