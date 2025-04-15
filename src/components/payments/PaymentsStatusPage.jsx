import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api';

const PaymentStatusPage = ({ setNumberCartItems }) => {
  const [statusMessage, setStatusMessage] = useState('¡Estamos verificando tu pago!');
  const [statusSubMessage, setStatusSubMessage] = useState('Esto tomará solo unos segundos. Gracias por tu paciencia.');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('paymentStatus');
    const txRef = queryParams.get('ref');
    const transactionId = queryParams.get('transaction_id');
    const method = queryParams.get('method');

    // Datos que puede enviar ePayco
    const epaycoRef = queryParams.get('ref_payco');
    const epaycoResponse = queryParams.get('x_response');
    const epaycoTransactionState = queryParams.get('x_transaction_state');
    const epaycoResponseCode = queryParams.get('x_response_reason_text');
    
    console.log('Params: ', { 
      status, txRef, transactionId, method, 
      epaycoRef, epaycoResponse, epaycoTransactionState 
    });

    // Verificar si la respuesta es de ePayco
    if (method === 'epayco' || epaycoRef || epaycoResponse) {
      console.log('Detectada respuesta de ePayco');
      
      // Si tenemos una referencia, verificar el estado con el backend
      if (txRef || epaycoRef) {
        const reference = txRef || epaycoRef;
        api.post(`/verify_epayco_payment/`, { ref: reference })
          .then(res => {
            console.log('Respuesta del servidor:', res.data);
            
            if (res.data.success) {
              setStatusMessage('¡Pago exitoso!');
              setStatusSubMessage('Tu pago ha sido procesado correctamente. Gracias por tu compra.');
              localStorage.removeItem('cart_code');
              setNumberCartItems(0);
            } else {
              let statusMsg = 'Pago pendiente';
              let subMsg = 'Tu transacción está siendo procesada. Te notificaremos cuando se complete.';
              
              // Si el pago fue rechazado o hay un error específico
              if (res.data.status === 'failed' || res.data.status === 'rejected') {
                statusMsg = '¡Pago no completado!';
                subMsg = 'Hubo un problema con tu pago. Por favor, inténtalo de nuevo o contacta a soporte.';
              }
              
              setStatusMessage(statusMsg);
              setStatusSubMessage(subMsg);
            }
          })
          .catch(err => {
            console.error('Error al verificar pago:', err);
            setStatusMessage('¡No se pudo verificar el estado del pago!');
            setStatusSubMessage('Hubo un problema al verificar tu pago. Por favor, contacta a soporte.');
          });
      } 
      // Si no tenemos referencia pero sí un estado del transaction_state
      else if (epaycoTransactionState) {
        if (epaycoTransactionState === 'Aceptada' || epaycoResponse === 'Aceptada') {
          setStatusMessage('¡Pago exitoso!');
          setStatusSubMessage('Tu pago ha sido procesado correctamente. Gracias por tu compra.');
          localStorage.removeItem('cart_code');
          setNumberCartItems(0);
        } else if (epaycoTransactionState === 'Pendiente' || epaycoResponse === 'Pendiente') {
          setStatusMessage('¡Pago en proceso!');
          setStatusSubMessage('Tu transacción está siendo procesada. Te notificaremos cuando se complete.');
        } else {
          setStatusMessage('¡Pago no completado!');
          setStatusSubMessage(`Hubo un problema con tu pago: ${epaycoResponseCode || 'Error desconocido'}. Por favor, inténtalo de nuevo.`);
        }
      }
      // Si no tenemos información suficiente
      else {
        setStatusMessage('Estado de pago desconocido');
        setStatusSubMessage('No pudimos determinar el estado de tu pago. Por favor, verifica en "Mis pedidos" o contacta a soporte.');
      }
    } 
    // Para PayPal y otros métodos existentes
    else if (status && txRef && transactionId) {
      api.post(`/payment_callback/status/${status}/ref/${txRef}/transaction/${transactionId}`)
        .then(res => {
          setStatusMessage(res.data.message);
          setStatusSubMessage(res.data.subMessage);
          localStorage.removeItem('cart_code');
          setNumberCartItems(0);
        })
        .catch(err => {
          console.log(err.message); 
          setStatusMessage('¡El pago no se pudo verificar!');
          setStatusSubMessage('Hubo un error al verificar tu pago. Por favor, contacta a soporte.');
        });
    } else if (status && txRef) {
      // Handle callbacks without transaction_id (e.g., PayPal)
      api.post(`/payment_callback/status/${status}/ref/${txRef}`)
        .then(res => {
          setStatusMessage(res.data.message);
          setStatusSubMessage(res.data.subMessage);
          localStorage.removeItem('cart_code');
          setNumberCartItems(0);
        })
        .catch(err => {
          console.log(err.message); // Moved console.log here
          setStatusMessage('¡El pago no se pudo verificar!');
          setStatusSubMessage('Hubo un error al verificar tu pago. Por favor, contacta a soporte.');
        });
    } else if (status === 'cancel' && txRef) {
      setStatusMessage('¡Pago cancelado!');
      setStatusSubMessage('Has cancelado tu pago.');
      // Optionally update backend about cancellation using txRef
    } else {
      setStatusMessage('Estado de pago desconocido.');
      setStatusSubMessage('No pudimos determinar el estado de tu pago.');
    }
  }, [location.search, setNumberCartItems]);

  return (
    <section className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#6050DC' }}>
      <div className="container text-center text-white px-4">
        <h1 className="display-4 fw-bold mb-3">{statusMessage}</h1>
        <p className="lead mb-4">{statusSubMessage}</p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/profile" className="btn btn-outline-light btn-lg px-4 py-2">
            Ver mis pedidos
          </Link>
          <Link to="/" className="btn btn-outline-light btn-lg px-4 py-2">
            Continuar comprando
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentStatusPage;