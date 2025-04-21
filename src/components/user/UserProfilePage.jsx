import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import OrderHistoryItemContainer from './OrderHistoryItemContainer';
import api from '../../api';
import Spinner from '../ui/Spinner';
import styles from './UserProfilePage.module.css';
import { Link } from 'react-router-dom';

const UserProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [orderitems, setOrderitems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    setLoading(true);
    api.get("user_info/")
      .then(res => {
        setUserInfo(res.data);
        setOrderitems(res.data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <Spinner loading={loading} />
    </div>
  );

  return (
    <div className={styles.profileContainer}>
      <div className="container py-5">
        <div className={styles.profileHeader}>
          <h1 className={styles.profileTitle}>Mi espacio incorrectamente personal</h1>
          <p className={styles.profileSubtitle}>Gestiona tus datos y tus adquisiciones imperfectas</p>
          <div className={styles.decorativeLine}></div>
        </div>
        
        <div className={styles.profileTabs}>
          <button 
            className={`${styles.profileTab} ${activeTab === 'info' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Información personal
          </button>
          <button 
            className={`${styles.profileTab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Historial de incorrecciones
          </button>
          <button 
            className={`${styles.profileTab} ${activeTab === 'certificates' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificados de imperfección
          </button>
        </div>
        
        <div className={styles.profileContent}>
          {activeTab === 'info' && (
            <div className={styles.infoSection}>
              <UserInfo userInfo={userInfo} />
              
              <div className={styles.actionButtons}>
                <Link to="/profile/edit" className={styles.actionButton}>
                  Editar información
                </Link>
                <Link to="/profile/change-password" className={styles.actionButton}>
                  Cambiar contraseña
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className={styles.ordersSection}>
              <OrderHistoryItemContainer orderitems={orderitems} />
              
              {orderitems.length === 0 && (
                <div className={styles.emptyState}>
                  <img src="/img/incorrect-frog-small.svg" alt="Sin órdenes" className={styles.emptyStateImage} />
                  <h3 className={styles.emptyStateTitle}>Aún no tienes incorrecciones adquiridas</h3>
                  <p className={styles.emptyStateDesc}>
                    Tu colección de productos imperfectos está vacía. ¡Es hora de explorar nuestra tienda y descubrir piezas únicas!
                  </p>
                  <Link to="/" className={styles.shopButton}>
                    Explorar La Tienda Incorrecta
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'certificates' && (
            <div className={styles.certificatesSection}>
              <div className={styles.certificatesHeader}>
                <h2 className={styles.certificatesTitle}>Tus certificados de imperfección</h2>
                <p className={styles.certificatesDesc}>
                  Cada producto adquirido en La Tienda Incorrecta viene con su certificado que garantiza que contiene al menos 3 incorrecciones deliberadas.
                </p>
              </div>
              
              {orderitems.length > 0 ? (
                <div className={styles.certificatesList}>
                  {orderitems.map(item => (
                    <div key={item.id} className={styles.certificateItem}>
                      <div className={styles.certificateHeader}>
                        <img src="/img/incorrect-frog-small.svg" alt="Certificado" className={styles.certificateIcon} />
                        <h4 className={styles.certificateProductName}>{item.product.name}</h4>
                      </div>
                      <div className={styles.certificateBody}>
                        <p className={styles.certificateText}>
                          Certificamos que este producto contiene al menos 3 incorrecciones deliberadas que lo hacen único y adecuadamente imperfecto.
                        </p>
                        <div className={styles.certificateDetails}>
                          <span className={styles.certificateNumber}>Nº INCO-{item.id}</span>
                          <span className={styles.certificateDate}>Fecha: {new Date(item.order_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <img src="/img/incorrect-frog-small.svg" alt="Sin certificados" className={styles.emptyStateImage} />
                  <h3 className={styles.emptyStateTitle}>No tienes certificados de imperfección</h3>
                  <p className={styles.emptyStateDesc}>
                    Adquiere productos incorrectamente perfectos para obtener tus certificados de imperfección artesanal.
                  </p>
                  <Link to="/" className={styles.shopButton}>
                    Descubrir productos incorrectos
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;