import React, { useState, useEffect } from 'react';
import styles from './PaymentSection.module.css';
import { useNavigate } from 'react-router-dom'; 
import api from '../../api';

const PaymentSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const navigate = useNavigate(); 
  const cart_code = localStorage.getItem("cart_code");

  // Verificar autenticación y cart_code al inicio
  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    console.log("Token existe:", !!accessToken);
    setAuthStatus(!!accessToken);
    
    console.log("Cart code:", cart_code, typeof cart_code);
    if (!cart_code) {
      setError('No se encontró el código del carrito');
    }
  }, [cart_code]);

  // Función para verificar el carrito antes del pago
  async function verifyCartBeforePayment() {
    try {
      // Verificar si el carrito está asociado al usuario
      const response = await api.post('verify_cart/', { cart_code: cart_code });
      console.log("Verificación de carrito exitosa:", response.data);
      return true;
    } catch (error) {
      console.error("Error en verificación de carrito:", error);
      if (error.response && error.response.status === 400) {
        // Intentar asociar el carrito al usuario
        try {
          const associateResponse = await api.post('associate_cart_to_user/', { cart_code: cart_code });
          console.log("Carrito asociado:", associateResponse.data);
          return true;
        } catch (associateError) {
          console.error("Error al asociar carrito:", associateError);
          setError('No se pudo asociar el carrito a tu cuenta. Por favor, inicia sesión nuevamente.');
          return false;
        }
      }
      setError('Error al verificar el carrito. Por favor, intenta de nuevo más tarde.');
      return false;
    }
  }

  async function paypalPayment() {
    setLoading(true);
    setError('');
    
    // Verificar si el usuario está autenticado
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("Debes iniciar sesión para continuar");
      setLoading(false);
      // Opcional: Redirigir a login
      // setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    if (!cart_code) {
      setError("No se encontró el código del carrito");
      setLoading(false);
      return;
    }
    
    console.log("Iniciando pago con cart_code:", cart_code);
    console.log("Usando token de autenticación:", !!accessToken);
    
    // Verificar el carrito antes de pagar
    const isCartValid = await verifyCartBeforePayment();
    if (!isCartValid) {
      setLoading(false);
      return;
    }
    
    // Continuar con el pago normal
    api.post("initiate_paypal_payment/", { cart_code: cart_code })
      .then(res => {
        console.log("Respuesta completa:", res);
        setLoading(false);
        if (res.data && res.data.approval_url) {
          window.location.href = res.data.approval_url;
        } else {
          setError("No se recibió la URL de PayPal para continuar");
        }
      })
      .catch(err => {
        console.error('Error completo:', err);
        
        if (err.response) {
          console.error('Status:', err.response.status);
          console.error('Server response:', err.response.data);
          
          // Manejar distintos errores según el código de estado
          if (err.response.status === 401) {
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            // Opcional: redirigir a login
            // setTimeout(() => navigate('/login'), 2000);
          } else if (err.response.data.error === 'Invalid cart code') {
            setError('El código del carrito no es válido. Intenta recargar la página o volver a agregar productos al carrito.');
          } else {
            setError(err.response.data.error || 'Error al iniciar el pago');
          }
        } else {
          setError('Error de conexión con el servidor');
        }
        
        setLoading(false);
      });
  }


  return (
    <div className="col-md-4">
      <div className={`card ${styles.card}`}>
        <div className="card-header" style={{ backgroundColor: '#6050DC', color: 'white' }}>
          <h5>Opciones de pago</h5>
        </div>
        <div className="card-body">
          {!authStatus && (
            <div className="alert alert-warning mb-3" role="alert">
              Debes iniciar sesión para realizar el pago
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}
          
          {/* PayPal Button */}
          <button 
            className={`btn btn-primary w-100 mb-3 ${styles.paypalButton}`} 
            id="paypal-button"
            onClick={paypalPayment}
            disabled={loading || !cart_code || !authStatus}
          >
            <i className="bi bi-paypal"></i> {loading ? "Cargando..." : "Pagar con PayPal"}
          </button>

          {/* Flutterwave Button */}
          {/* <button 
            className={`btn btn-warning w-100 ${styles.flutterwaveButton}`} 
            id="flutterwave-button"
            onClick={flutterwavePayment}
            disabled={loading || !cart_code || !authStatus}
          >
            <i className="bi bi-credit-card"></i> Pagar con Flutterwave
          </button> */}
          
          {!cart_code && (
            <div className="mt-3 text-center text-danger">
              <small>No se ha encontrado un carrito válido</small>
            </div>
          )}
          
          {!authStatus && (
            <div className="mt-3 text-center">
              <button 
                className="btn btn-link" 
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;