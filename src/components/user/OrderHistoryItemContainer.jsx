import React from 'react';
import OrderHistoryItem from './OrderHistoryItem';

const OrderHistoryItemContainer = ({ orderitems = [] }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div
            className="card-header sticky-top"
            style={{
              backgroundColor: '#6050DC',
              color: 'white',
              zIndex: 10,
              top: 0
            }}
          >
            <h5 className="mb-0">Historial de ordenes</h5>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {orderitems.length > 0 ? (
              orderitems.map(item => (
                <OrderHistoryItem key={item.id} item={item} />
              ))
            ) : (
              <p className="p-3">No hay órdenes registradas aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItemContainer;
