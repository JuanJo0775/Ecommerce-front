import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import Error from '../ui/Error';
import { AuthContext } from '../context/AuthContext';
import styles from './RegisterPage.module.css';
import pic from '../../assets/incorrect-frog.png';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, get_username } = useContext(AuthContext);
    
    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '', // Confirmación de contraseña
        first_name: '',
        last_name: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validación básica
        if (formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden (y no de manera artística)');
            setLoading(false);
            return;
        }

        // Eliminamos password2 del objeto a enviar
        const { password2, ...registerData } = formData;

        api.post('register/', registerData)
            .then(res => {
                console.log('Registro exitoso:', res.data);
                
                // Iniciamos sesión automáticamente
                return api.post('token/', {
                    username: formData.username,
                    password: formData.password
                });
            })
            .then(res => {
                // Guardar tokens
                localStorage.setItem('access', res.data.access);
                localStorage.setItem('refresh', res.data.refresh);
                
                // Actualizar estado de autenticación
                setIsAuthenticated(true);
                get_username();
                
                // Redirigir al home
                navigate('/', { replace: true });
            })
            .catch(err => {
                console.error('Error:', err);
                let errorMsg = 'Error al registrar usuario (y no es parte de nuestra estética incorrecta)';
                
                // Manejar errores específicos del backend
                if (err.response && err.response.data) {
                    const serverErrors = err.response.data;
                    if (serverErrors.username) {
                        errorMsg = `Error de usuario: ${serverErrors.username}`;
                    } else if (serverErrors.email) {
                        errorMsg = `Error de email: ${serverErrors.email}`;
                    } else if (serverErrors.password) {
                        errorMsg = `Error de contraseña: ${serverErrors.password}`;
                    } else if (serverErrors.non_field_errors) {
                        errorMsg = serverErrors.non_field_errors[0];
                    } else if (typeof serverErrors === 'string') {
                        errorMsg = serverErrors;
                    }
                }
                
                setError(errorMsg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerForm}>
                {error && <Error error={error} />}
                
                <div className={styles.registerHeader}>
                    <div className={styles.logoContainer}>
                        <img src={pic} alt="La Tienda Incorrecta" className={styles.registerLogo} />
                    </div>
                    <h2 className={styles.registerTitle}>Únete a La Incorrección</h2>
                    <p className={styles.registerSubtitle}>Crea una cuenta para acceder a nuestro universo de imperfecciones deliberadas</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="first_name" className={styles.formLabel}>Nombre</label>
                            <input 
                                type="text" 
                                className={styles.formInput} 
                                id="first_name" 
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Tu nombre" 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="last_name" className={styles.formLabel}>Apellido</label>
                            <input 
                                type="text" 
                                className={styles.formInput} 
                                id="last_name" 
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Tu apellido" 
                            />
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.formLabel}>Nombre de usuario</label>
                        <input 
                            type="text" 
                            className={styles.formInput} 
                            id="username" 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Elige un nombre único (o incorrectamente común)" 
                            required 
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Correo electrónico</label>
                        <input 
                            type="email" 
                            className={styles.formInput} 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com" 
                            required 
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>Contraseña</label>
                        <input 
                            type="password" 
                            className={styles.formInput} 
                            id="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 8 caracteres, deliberadamente complicada" 
                            required 
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="password2" className={styles.formLabel}>Confirmar contraseña</label>
                        <input 
                            type="password" 
                            className={styles.formInput} 
                            id="password2" 
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="Repite la misma contraseña" 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.registerButton} 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.loadingSpinner}></span>
                        ) : (
                            "Unirme a la incorrección"
                        )}
                    </button>
                </form>
                
                <div className={styles.registerFooter}>
                    <p>
                        Al registrarte, aceptas nuestros <a href="#" className={styles.termsLink}>Términos Deliberadamente Confusos</a> y nuestra <a href="#" className={styles.termsLink}>Política de Privacidad Artísticamente Ambigua</a>.
                    </p>
                    <div className={styles.loginPrompt}>
                        <span>¿Ya tienes cuenta?</span>
                        <Link to="/login" className={styles.loginLink}>
                            Inicia sesión aquí
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;