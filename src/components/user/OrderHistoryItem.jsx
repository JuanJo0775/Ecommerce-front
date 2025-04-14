import React from 'react';
import styles from './OrderHistoryItem.module.css'; 
import { BASE_URL } from '../../api';
import { FormatDate } from '../../FormateDate';

const OrderHistoryItem = ({ item }) => {
  return (
    <div className="card-body">
      <div className={`mb-3 ${styles.orderItem}`}>
        <div className="row align-items-center">
          <div className="col-md-2">
            <img
              src={`${BASE_URL}${item.product.image}`}
              alt="Order Item"
              className={styles.orderImage}
            />
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold">{item.product.name}</h6>
            <p className="mb-1">{`Fecha de la orden: ${FormatDate(item.order_date)}`}</p>
            <p className="mb-0">{`Id de la orden: ${item.order_id}`}</p>
          </div>
          <div className="col-md-2 text-center">
            <h6 className="text-muted">{`Cantidad: ${item.quantity}`}</h6>
          </div>
          <div className="col-md-2 text-center">
            <h6 className="text-muted">{`$${item.product.price}`}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
