import React, { useState, useEffect, useRef } from 'react';
import './ChatbotPage.css';
import { FaSearch, FaUser } from 'react-icons/fa';
import { BASE_URL } from '../../api';
import api from '../../api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  // Sugerencias populares de búsqueda
  const popularSearches = [
    "Electrónicos",
    "Ropa deportiva",
    "Muebles de oficina",
    "Accesorios para celular",
    "Computadoras",
    "Camisetas",
    "Zapatos deportivos"
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
    
    // Marcar que se ha realizado una búsqueda
    setSearchSubmitted(true);
    
    // Agregar mensaje del usuario
    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      const response = await api.post('/chatbot/message/', {
        message: inputText,
        session_id: sessionId
      });
      
      // Calcular un retraso proporcional al tamaño de la respuesta
      const typingDelay = Math.min(1000 + response.data.response.length * 3, 2500);
      
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
          text: 'Lo siento, estoy teniendo problemas para procesar tu búsqueda. Por favor, intenta de nuevo más tarde.' 
        }]);
        setIsTyping(false);
      }, 500);
    }
    
    // Limpiar el input después de enviar
    setInputText('');
  };

  // Función para manejar búsquedas populares
  const handlePopularSearch = (search) => {
    setInputText(search);
    // Enviar automáticamente la búsqueda
    const syntheticEvent = { preventDefault: () => {} };
    handleSubmit(syntheticEvent);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header" style={{ backgroundColor: '#6050DC' }}>
          <h3>Buscador Inteligente</h3>
          <div className="search-info">
            <span className="search-type-badge">Búsqueda Avanzada</span>
          </div>
        </div>
        
        {/* Formulario de búsqueda principal */}
        <div className="search-form-container">
          <form className="search-input-form" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Buscar productos, categorías o hacer preguntas..."
                disabled={isTyping}
                className="search-input"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                className="search-button"
                style={{ backgroundColor: '#6050DC' }}
              >
                <FaSearch /> Buscar
              </button>
            </div>
          </form>
          
          {/* Mostrar búsquedas populares solo si no se ha realizado una búsqueda */}
          {!searchSubmitted && (
            <div className="popular-searches">
              <h5>Búsquedas populares:</h5>
              <div className="popular-searches-tags">
                {popularSearches.map((search, index) => (
                  <span 
                    key={index} 
                    className="popular-search-tag"
                    onClick={() => handlePopularSearch(search)}
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Mostrar resultados solo después de realizar una búsqueda */}
        {searchSubmitted && (
          <div className="search-results">
            <div className="chat-area">
              {/* Panel de conversación */}
              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                    <div className="message-avatar">
                      {msg.sender === 'bot' ? <FaSearch /> : <FaUser />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && <div className="typing-indicator"><div></div><div></div><div></div></div>}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Productos sugeridos */}
              {suggestedProducts.length > 0 && (
                <div className="suggested-products">
                  <h4>Resultados encontrados</h4>
                  <div className="product-cards">
                    {suggestedProducts.map(productId => (
                      <ProductCard key={productId} productId={productId} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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