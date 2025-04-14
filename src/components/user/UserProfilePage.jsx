import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import OrderHistoryItemContainer from './OrderHistoryItemContainer';
import api from '../../api';
import Spinner from '../ui/Spinner';

const UserProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [orderitems, setOrderitems] = useState({})
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("user_info/")
      .then(res => {
        setUserInfo(res.data);
        setOrderitems(res.data.items)
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner loading={loading} />;

  return (
    <div className="container my-5 px-0"> 
      <div className="row gx-0"> 

        <div className="col-12">
          <UserInfo userInfo={userInfo} />
        </div>


        <div className="col-12">
          <OrderHistoryItemContainer orderitems={orderitems} />
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;
