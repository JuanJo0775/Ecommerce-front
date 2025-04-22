import React, { useState, useEffect, useRef } from 'react';
import './ChatbotPage.css';
import { FaRobot, FaUser, FaPaperPlane, FaChevronRight } from 'react-icons/fa';
import api from '../../api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente virtual de Shoppit. Puedo ayudarte a encontrar productos, responder preguntas sobre envíos, pagos y más. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sugerencias de preguntas para el usuario
  const suggestedQuestions = [
    "¿Tienen camisetas de algodón?",
    "Busco zapatos deportivos",
    "¿Cuáles son los métodos de pago?",
    "¿Cómo funcionan los envíos?",
    "Busco un teléfono Samsung",
    "Necesito una laptop para trabajar"
  ];

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
    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Enviar mensaje al chatbot
      const response = await api.post('/chatbot/message/', {
        message: inputText,
        session_id: sessionId
      });
      
      // Calcular un retraso proporcional al tamaño de la respuesta para simular escritura
      const typingDelay = Math.min(800 + response.data.response.length * 3, 2500);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
        
        // Mostrar productos sugeridos si los hay
        if (response.data.suggested_products && response.data.suggested_products.length > 0) {
          setSuggestedProducts(response.data.suggested_products);
        } else {
          setSuggestedProducts([]);
        }
        
        setIsTyping(false);
        // Foco en el input después de recibir respuesta
        inputRef.current?.focus();
      }, typingDelay);
    } catch (error) {
      console.error('Error al comunicarse con el chatbot:', error);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'Lo siento, estoy teniendo problemas para responder en este momento. Por favor, intenta de nuevo más tarde.' 
        }]);
        setIsTyping(false);
      }, 500);
    }
  };

  // Función para manejar sugerencias
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    // Enviar automáticamente la sugerencia
    const syntheticEvent = { preventDefault: () => {} };
    handleSubmit(syntheticEvent);
  };

  // Función para añadir producto al mensaje
  const handleProductSelect = (product) => {
    setInputText(`Me interesa el producto ${product.name}`);
    // Foco en el input
    inputRef.current?.focus();
  };

  return (
    <div className="chatbot-full-page">
      <div className="chatbot-container">
        <div className="chatbot-header" style={{ backgroundColor: '#6050DC' }}>
          <div className="chatbot-title">
            <FaRobot className="chatbot-icon" />
            <h3>Asistente de Shoppit</h3>
          </div>
        </div>
        
        <div className="chatbot-content">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                <div className="message-avatar">
                  {msg.sender === 'bot' ? <FaRobot /> : <FaUser />}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {suggestedProducts.length > 0 && (
            <div className="suggested-products">
              <h4>Productos encontrados</h4>
              <div className="product-cards">
                {suggestedProducts.map(productId => (
                  <ProductCard 
                    key={productId} 
                    productId={productId} 
                    onSelect={handleProductSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sugerencias */}
        {messages.length <= 2 && !isTyping && (
          <div className="suggested-questions">
            <h4>Prueba a preguntar</h4>
            <div className="question-chips">
              {suggestedQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="question-chip"
                  onClick={() => handleSuggestionClick(question)}
                >
                  <span>{question}</span>
                  <FaChevronRight className="chip-icon" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form className="chatbot-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu pregunta o búsqueda..."
            disabled={isTyping}
            className="chatbot-input"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isTyping}
            className="chatbot-send-btn"
            style={{ backgroundColor: '#6050DC' }}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente para mostrar tarjetas de producto
const ProductCard = ({ productId, onSelect }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Obtener detalles del producto
    api.get(`/product_detail_by_id/${productId}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener producto:', err);
        setLoading(false);
      });
  }, [productId]);
  
  if (loading) {
    return <div className="product-card-loading">Cargando...</div>;
  }
  
  if (!product) return null;
  
  return (
    <div className="product-card">
      <img 
        src={`${api.defaults.baseURL}${product.image}`} 
        alt={product.name} 
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/150x100?text=Producto';
        }}
      />
      <div className="product-info">
        <h5>{product.name}</h5>
        <p className="product-price">${product.price}</p>
        <div className="product-actions">
          <button 
            className="ask-about-btn"
            onClick={() => onSelect(product)}
          >
            Preguntar
          </button>
          <a 
            href={`/products/${product.slug}`} 
            className="product-link"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;