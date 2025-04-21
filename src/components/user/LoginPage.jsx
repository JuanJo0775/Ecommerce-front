import React, { useContext, useState } from 'react';
import Error from '../ui/Error';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./LoginPage.css"
import api from '../../api';
import { AuthContext } from '../context/AuthContext';
import styles from './LoginPage.module.css';
import pic from '../../assets/incorrect-frog.png';

const LoginPage = () => {
    const {setIsAuthenticated, get_username} = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const userInfo = {username, password};
   
    // Función para asociar el carrito al usuario después del inicio de sesión
    const associateCartToUser = (cartCode) => {
        return api.post("associate_cart_to_user/", { cart_code: cartCode })
            .then(res => {
                console.log("Carrito asociado correctamente:", res.data);
                return true;
            })
            .catch(err => {
                console.error("Error al asociar carrito:", err);
                // No interrumpimos el flujo de inicio de sesión si esto falla
                return false;
            });
    };

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
      
        api.post("token/", userInfo)
          .then(res => {
            console.log(res.data);
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            setUsername("");
            setPassword("");
            setLoading(false);
            setIsAuthenticated(true);
            get_username();
            setError("");

            // Verificar si hay un carrito en localStorage
            const cartCode = localStorage.getItem("cart_code");
            if (cartCode) {
                // Intentar asociar el carrito al usuario
                associateCartToUser(cartCode)
                    .then(() => {
                        const from = location?.state?.from?.pathname || "/";
                        navigate(from, {replace:true});
                    });
            } else {
                const from = location?.state?.from?.pathname || "/";
                navigate(from, {replace:true});
            }
          })
          .catch(err => {
            console.log(err.message);
            setError("Credenciales incorrectas (pero en el mal sentido)");
            setLoading(false);
          });
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                {error && <Error error={error}/>}
                <div className={styles.loginHeader}>
                    <div className={styles.logoContainer}>
                        <img src={pic} alt="La Tienda Incorrecta" className={styles.loginLogo} />
                    </div>
                    <h2 className={styles.loginTitle}>Bienvenido de vuelta</h2>
                    <p className={styles.loginSubtitle}>Inicia sesión para continuar tu experiencia incorrecta</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.formLabel}>Usuario</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.formInput} 
                            id="username" 
                            placeholder="Tu nombre de usuario" 
                            required 
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>Contraseña</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.formInput} 
                            id="password" 
                            placeholder="Tu contraseña incorrectamente segura" 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.loginButton} 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.loadingSpinner}></span>
                        ) : (
                            "Ingresar a lo incorrecto"
                        )}
                    </button>
                </form>
                
                <div className={styles.loginFooter}>
                    <Link to="/forgotpassword" className={styles.forgotLink}>
                        ¿Olvidaste tu contraseña incorrectamente?
                    </Link>
                    <div className={styles.registerPrompt}>
                        <span>¿No tienes cuenta?</span>
                        <Link to="/register" className={styles.registerLink}>
                            Regístrate aquí
                        </Link>
                    </div>
                </div>
                
                <div className={styles.loginNote}>
                    <p>Nota: Al iniciar sesión, aceptas nuestros Términos y Condiciones deliberadamente mal redactados.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;