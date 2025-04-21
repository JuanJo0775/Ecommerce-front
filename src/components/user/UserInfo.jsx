import React from 'react';
import styles from './UserInfo.module.css';

const UserInfo = ({ userInfo }) => {
    return (
        <div className={styles.userInfoContainer}>
            <div className={styles.userProfile}>
                <div className={styles.profileImageContainer}>
                    <img
                        src="/img/default_profile.png"
                        alt="Perfil de usuario"
                        className={styles.profileImage}
                    />
                    <div className={styles.imageOverlay}>
                        <span>Foto deliberadamente imperfecta</span>
                    </div>
                </div>
                <div className={styles.profileNameContainer}>
                    <h2 className={styles.profileName}>{userInfo.first_name} {userInfo.last_name}</h2>
                    <span className={styles.membershipType}>Miembro Incorrectamente Distinguido</span>
                </div>
            </div>
            
            <div className={styles.userInfoGrid}>
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Nombre de usuario</div>
                    <div className={styles.infoValue}>{userInfo.username || 'No especificado'}</div>
                </div>
                
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Correo electrónico</div>
                    <div className={styles.infoValue}>{userInfo.email || 'No especificado'}</div>
                </div>
                
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Teléfono</div>
                    <div className={styles.infoValue}>{userInfo.phone || 'No proporcionado'}</div>
                </div>
                
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Ciudad</div>
                    <div className={styles.infoValue}>{userInfo.city || 'No especificada'}</div>
                </div>
                
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Estado/Provincia</div>
                    <div className={styles.infoValue}>{userInfo.state || 'No especificado'}</div>
                </div>
                
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Dirección</div>
                    <div className={styles.infoValue}>{userInfo.address || 'No especificada'}</div>
                </div>
            </div>
            
            <div className={styles.incorrectBadge}>
                <div className={styles.badgeContent}>
                    <img src="/img/incorrect-frog-small.svg" alt="Insignia" className={styles.badgeIcon} />
                    <div className={styles.badgeTextContainer}>
                        <div className={styles.badgeTitle}>Cliente Imperfecto Nivel 1</div>
                        <div className={styles.badgeDesc}>Has adquirido al menos una pieza incorrecta</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;