import React, { useState, useEffect } from 'react';
import styles from './PaymentSection.module.css';
import { useNavigate } from 'react-router-dom'; 
import api from '../../api';
import { FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';

const PaymentSection = () => {
  const [loading, setLoading] = useState(false);
  const [epaycoLoading, setEpaycoLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const navigate = useNavigate(); 
  const cart_code = localStorage.getItem("cart_code");

  // Cargar el script de ePayco al montar el componente
  useEffect(() => {
    if (!document.getElementById('epayco-script')) {
      const script = document.createElement('script');
      script.id = 'epayco-script';
      script.src = 'https://checkout.epayco.co/checkout.js';
      script.async = true;
      
      script.onerror = () => {
        console.error('Error al cargar el script de ePayco');
        setError('No se pudo cargar el procesador de pagos de ePayco');
      };
      
      document.body.appendChild(script);
    }
    
    return () => {
      // Opcional: remover el script al desmontar
    };
  }, []);

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
      const response = await api.post('verify_cart/', { cart_code: cart_code });
      console.log("Verificación de carrito exitosa:", response.data);
      return true;
    } catch (error) {
      console.error("Error en verificación de carrito:", error);
      if (error.response && error.response.status === 400) {
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
    
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("Debes iniciar sesión para continuar");
      setLoading(false);
      return;
    }
    
    if (!cart_code) {
      setError("No se encontró el código del carrito");
      setLoading(false);
      return;
    }
    
    console.log("Iniciando pago con cart_code:", cart_code);
    console.log("Usando token de autenticación:", !!accessToken);
    
    const isCartValid = await verifyCartBeforePayment();
    if (!isCartValid) {
      setLoading(false);
      return;
    }
    
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
          
          if (err.response.status === 401) {
            setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
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

  async function epaycoPayment() {
    setEpaycoLoading(true);
    setError('');
    
    if (!window.ePayco) {
      setError("El procesador de pago ePayco no está disponible. Por favor, recarga la página e intenta de nuevo.");
      setEpaycoLoading(false);
      return;
    }
    
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("Debes iniciar sesión para continuar");
      setEpaycoLoading(false);
      return;
    }
    
    if (!cart_code) {
      setError("No se encontró el código del carrito");
      setEpaycoLoading(false);
      return;
    }
    
    const isCartValid = await verifyCartBeforePayment();
    if (!isCartValid) {
      setEpaycoLoading(false);
      return;
    }
    
    api.post("initiate_epayco_payment/", { cart_code: cart_code })
      .then(res => {
        console.log("Respuesta ePayco:", res.data);
        
        try {
          const handler = window.ePayco.checkout.configure({
            key: res.data.public_key,
            test: res.data.test
          });
          
          handler.open({
            name: "Productos Incorrectos",
            description: res.data.description,
            invoice: res.data.invoice,
            currency: res.data.currency,
            amount: res.data.amount,
            tax_base: res.data.tax_base,
            tax: res.data.tax,
            country: res.data.country,
            lang: "es",
            test: true, 
            
            external: res.data.external,
            extra1: res.data.extra1,
            response: res.data.response,
            
            name_billing: res.data.name,
            last_name_billing: res.data.last_name,
            email_billing: res.data.email,
            address_billing: res.data.address,
            mobilephone_billing: res.data.cell_phone,
            type_doc_billing: "cc"
          });
          
          window.ePayco.checkout.onCloseModal = function() {
            console.log('El usuario cerró el modal de pago');
          }
        } catch (e) {
          console.error('Error al inicializar ePayco:', e);
          setError('Error al inicializar el procesador de pagos. Por favor, intenta de nuevo.');
        }
        
        setEpaycoLoading(false);
      })
      .catch(err => {
        console.error('Error ePayco:', err);
        
        if (err.response) {
          setError(err.response.data.error || 'Error al iniciar el pago con ePayco');
        } else {
          setError('Error de conexión con el servidor');
        }
        
        setEpaycoLoading(false);
      });
  }

  return (
    <div className="col-lg-5">
      <div className={styles.paymentCard}>
        <div className={styles.paymentHeader}>
          <h3 className={styles.paymentTitle}>Métodos de pago incorrectos</h3>
        </div>
        
        <div className={styles.paymentBody}>
          {!authStatus && (
            <div className={styles.warningMessage}>
              <p>Debes iniciar sesión para realizar el pago</p>
            </div>
          )}
          
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}
          
          <p className={styles.paymentIntro}>
            Selecciona el método de pago que prefieras para adquirir tus incorrecciones deliberadas:
          </p>
          
          <div className={styles.paymentMethods}>
            <button 
              className={styles.paymentButton}
              onClick={paypalPayment}
              disabled={loading || !cart_code || !authStatus}
            >
              <div className={styles.buttonContent}>
                <FaPaypal className={styles.paymentIcon} />
                <span className={styles.buttonText}>
                  {loading ? "Procesando..." : "Pagar con PayPal"}
                </span>
              </div>
            </button>
            
            <div className={styles.divider}>
              <span>O</span>
            </div>
            
            <button 
              className={styles.paymentButton}
              onClick={epaycoPayment}
              disabled={epaycoLoading || !cart_code || !authStatus}
            >
              <div className={styles.buttonContent}>
                <FaCreditCard className={styles.paymentIcon} />
                <span className={styles.buttonText}>
                  {epaycoLoading ? "Procesando..." : "Pagar con tarjeta (ePayco)"}
                </span>
              </div>
            </button>
          </div>
          
          <div className={styles.securityInfo}>
            <FaLock className={styles.lockIcon} />
            <p className={styles.securityText}>
              Pago seguro (excepto por un margen deliberado del 1% de arte imprevisible)
            </p>
          </div>
        </div>
        
        {!authStatus && (
          <div className={styles.loginPrompt}>
            <p>¿Aún no has iniciado sesión?</p>
            <button 
              className={styles.loginButton} 
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.paymentNote}>
        <h4 className={styles.noteTitle}>Nota sobre nuestra pasarela de pago</h4>
        <p className={styles.noteText}>
          Por filosofía de marca, nuestro sistema de pago es deliberadamente impredecible. 
          Podrías encontrar pequeñas sorpresas durante el proceso. Si tienes algún problema, 
          no dudes en contactarnos — prometemos resolver tu inconveniente de manera artísticamente incorrecta.
        </p>
      </div>
    </div>
  );
};

export default PaymentSection;