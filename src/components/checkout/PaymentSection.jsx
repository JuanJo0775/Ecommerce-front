import React, { useState, useEffect } from 'react';
import styles from './PaymentSection.module.css';
import { useNavigate } from 'react-router-dom'; 
import api from '../../api';

const PaymentSection = () => {
  const [loading, setLoading] = useState(false);
  const [epaycoLoading, setEpaycoLoading] = useState(false);
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const navigate = useNavigate(); 
  const cart_code = localStorage.getItem("cart_code");

  // Cargar el script de ePayco al montar el componente
  useEffect(() => {
    // Verificar si el script ya existe para evitar duplicados
    if (!document.getElementById('epayco-script')) {
      const script = document.createElement('script');
      script.id = 'epayco-script';
      script.src = 'https://checkout.epayco.co/checkout.js';
      script.async = true;
      
      // Manejar errores al cargar el script
      script.onerror = () => {
        console.error('Error al cargar el script de ePayco');
        setError('No se pudo cargar el procesador de pagos de ePayco');
      };
      
      document.body.appendChild(script);
    }
    
    // Limpiar el script al desmontar si es necesario
    return () => {
      // Opcional: remover el script al desmontar
      // Comentado porque podría ser útil mantenerlo para otras páginas
      // const scriptElement = document.getElementById('epayco-script');
      // if (scriptElement) document.body.removeChild(scriptElement);
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
    
    // Verificar si está disponible el SDK de ePayco
    if (!window.ePayco) {
      setError("El procesador de pago ePayco no está disponible. Por favor, recarga la página e intenta de nuevo.");
      setEpaycoLoading(false);
      return;
    }
    
    // Verificaciones básicas
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
    
    // Verificar el carrito antes de pagar
    const isCartValid = await verifyCartBeforePayment();
    if (!isCartValid) {
      setEpaycoLoading(false);
      return;
    }
    
    // Iniciar el pago con ePayco
    api.post("initiate_epayco_payment/", { cart_code: cart_code })
      .then(res => {
        console.log("Respuesta ePayco:", res.data);
        
        // Configurar el handler de ePayco con los datos recibidos
        try {
          const handler = window.ePayco.checkout.configure({
            key: res.data.public_key,
            test: res.data.test
          });
          
          // Abrir el modal de pago de ePayco
          handler.open({
            //Parametros obligatorios
            name: "Productos Shoppit",
            description: res.data.description,
            invoice: res.data.invoice,
            currency: res.data.currency,
            amount: res.data.amount,
            tax_base: res.data.tax_base,
            tax: res.data.tax,
            country: res.data.country,
            lang: "es",

            test: true, 
            
            //Parametros opcionales
            external: res.data.external,
            extra1: res.data.extra1,
            response: res.data.response,
            
            // Datos del cliente
            name_billing: res.data.name,
            last_name_billing: res.data.last_name,
            email_billing: res.data.email,
            address_billing: res.data.address,
            mobilephone_billing: res.data.cell_phone,
            type_doc_billing: "cc" // Tipo de documento por defecto
          });
          
          // Manejador para cuando se cierra el modal de ePayco (cancelación)
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

          {/* ePayco Button */}
          <button 
            className={`btn btn-warning w-100 ${styles.epaycoButton}`} 
            id="epayco-button"
            onClick={epaycoPayment}
            disabled={epaycoLoading || !cart_code || !authStatus}
            style={{ backgroundColor: '#00a1ff', borderColor: '#00a1ff', color: 'white' }}
          >
            <i className="bi bi-credit-card"></i> {epaycoLoading ? "Cargando..." : "Pagar con ePayco"}
          </button>
          
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