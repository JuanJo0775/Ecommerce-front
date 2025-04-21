import React, { useState, useEffect, useRef } from 'react';
import './ChatbotPage.css';
import ChatMessage from './ChatMessage';
import { BASE_URL } from '../../api';
import api from '../../api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente virtual de Shoppit. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generar un ID de sesión si no existe
    if (!sessionId) {
      setSessionId(`session_${Date.now()}`);
    }
    scrollToBottom();
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { sender: 'user', text: inputText }]);
    setInputText('');
    setIsTyping(true);
    
    try {
      const response = await api.post('/chatbot/message/', {
        message: inputText,
        session_id: sessionId
      });
      
      // Calcular un retraso proporcional al tamaño de la respuesta
      const typingDelay = Math.min(800 + response.data.response.length * 3, 2500);
      
      // Simular retraso para efecto natural
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
        
        if (response.data.suggested_products && response.data.suggested_products.length > 0) {
          setSuggestedProducts(response.data.suggested_products);
        }
        
        setIsTyping(false);
      }, typingDelay);
    } catch (error) {
      console.error('Error al comunicarse con el chatbot:', error);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'Lo siento, estoy teniendo problemas para responder. Por favor, intenta de nuevo más tarde.' 
        }]);
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container-full">
        <div className="chatbot-header-full" style={{ backgroundColor: '#6050DC' }}>
          <h3>Asistente Virtual de Shoppit</h3>
        </div>
        
        <div className="chat-area">
          {/* Mensajes */}
          <div className="messages-container">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            
            {isTyping && <div className="typing-indicator"><div></div><div></div><div></div></div>}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Productos sugeridos */}
          {suggestedProducts.length > 0 && (
            <div className="suggested-products">
              <h4>Productos relacionados</h4>
              <div className="product-cards">
                {suggestedProducts.map(productId => (
                  <ProductCard key={productId} productId={productId} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Input */}
        <form className="chatbot-input-full" onSubmit={handleSubmit}>
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
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente para mostrar tarjetas de producto
const ProductCard = ({ productId }) => {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    // Obtener detalles del producto
    api.get(`/product_detail_by_id/${productId}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error al obtener producto:', err));
  }, [productId]);
  
  if (!product) return null;
  
  return (
    <div className="product-card">
      <img src={`${BASE_URL}${product.image}`} alt={product.name} />
      <div className="product-info">
        <h5>{product.name}</h5>
        <p>${product.price}</p>
        <a href={`/products/${product.slug}`} className="product-link">
          Ver detalles
        </a>
      </div>
    </div>
  );
};

export default ChatbotPage;