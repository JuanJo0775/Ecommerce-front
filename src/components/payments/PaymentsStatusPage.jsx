import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api'; // Assuming your API utility

const PaymentStatusPage = ({ setNumberCartItems }) => {
  const [statusMessage, setStatusMessage] = useState('¡Estamos verificando tu pago!');
  const [statusSubMessage, setStatusSubMessage] = useState('Esto tomará solo unos segundos. Gracias por tu paciencia.');
  const location = useLocation();


  useEffect(() => {}, [])


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('paymentStatus');
    const txRef = queryParams.get('ref');
    const transactionId = queryParams.get('transaction_id'); 

    if (status && txRef && transactionId) {
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
          <Link to="/orders" className="btn btn-outline-light btn-lg px-4 py-2">
            Ver detalles del pedido
          </Link>
          <Link to="/shop" className="btn btn-outline-light btn-lg px-4 py-2">
            Continuar comprando
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentStatusPage;