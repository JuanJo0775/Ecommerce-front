import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UserInfo.module.css';
import pic from '../../assets/default_profile.png';

const UserInfo = ({ userInfo }) => {
    return (
        <div className="row mb-4">
            <div className={`col-md-3 py-3 card ${styles.textCenter}`}>
                <img
                    src={pic}
                    alt="User Profile"
                    className={`img-fluid rounded-circle mb-3 mx-auto ${styles.profileImage}`}
                />
                <h4>{userInfo.first_name} {userInfo.last_name}</h4>
                <p className="text-muted">{userInfo.email}</p>
                <div className="d-grid gap-2">
                    <Link to="/profile/edit" className="btn" style={{ backgroundColor: '#6050DC', color: 'white' }}>
                        Editar perfil
                    </Link>
                    <Link to="/profile/change-password" className="btn btn-outline-secondary">
                        Cambiar contraseña
                    </Link>
                </div>
            </div>
            <div className="col-md-9">
                <div className="card mb-4">
                    <div className="card-header" style={{ backgroundColor: '#6050DC', color: 'white' }}>
                        <h5 className="mb-0">Datos</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Nombre:</strong> {userInfo.first_name || 'No especificado'} {userInfo.last_name || ''}</p>
                                <p><strong>Email:</strong> {userInfo.email || 'No especificado'}</p>
                                <p><strong>Teléfono:</strong> {userInfo.phone || 'No especificado'}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Usuario:</strong> {userInfo.username || 'No especificado'}</p>
                                <p><strong>Ciudad:</strong> {userInfo.city || 'No especificada'}</p>
                                <p><strong>Dirección:</strong> {userInfo.address || 'No especificada'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;