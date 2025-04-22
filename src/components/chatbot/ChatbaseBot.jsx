import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaComments, FaTimes } from 'react-icons/fa';
import api from '../../api';
import './ChatbaseBot.css';

const ChatbaseBot = () => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [chatConfig, setChatConfig] = useState(null);

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

    fetchChatbaseConfig();
  }, []);

  // Inicializar el chatbot cuando tengamos la configuración
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

  // Función para alternar la visibilidad del chat
  const toggleChat = () => {
    if (isInitialized) {
      if (isVisible) {
        window.chatbase('hide');
        setIsVisible(false);
      } else {
        window.chatbase('show');
        setIsVisible(true);
      }
    }
  };

  return (
    <div className="chatbase-toggle-container">
      <button 
        className={`chatbase-toggle-button ${isVisible ? 'chatbase-active' : ''}`}
        onClick={toggleChat}
        style={{ backgroundColor: isVisible ? '#d84848' : '#6050DC' }}
        aria-label={isVisible ? "Cerrar asistente" : "Abrir asistente"}
      >
        {isVisible ? <FaTimes /> : <FaComments />}
      </button>
    </div>
  );
};

export default ChatbaseBot;