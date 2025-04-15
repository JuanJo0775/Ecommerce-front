import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Error from '../ui/Error';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css'; // Reutilizamos los estilos del login

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
            setError('Las contraseñas no coinciden');
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
                let errorMsg = 'Error al registrar usuario';
                
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
        <div className="login-container my-5">
            <div className="login-card shadow">
                {error && <Error error={error} />}
                <h2 className="login-title">Crear cuenta</h2>
                <p className="login-subtitle">Complete el formulario para registrarse</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="first_name" className="form-label">Nombre</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="first_name" 
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Tu nombre" 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="last_name" className="form-label">Apellido</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="last_name" 
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Tu apellido" 
                            />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Nombre de usuario</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Elije un nombre de usuario" 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com" 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Crea una contraseña" 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="password2" className="form-label">Confirmar contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password2" 
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="Repite la contraseña" 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100" 
                        disabled={loading}
                        style={{ backgroundColor: '#6050DC', borderColor: '#6050DC' }}
                    >
                        {loading ? "Procesando..." : "Registrarse"}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;