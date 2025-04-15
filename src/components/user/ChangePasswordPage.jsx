import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Error from '../ui/Error';
import { toast } from 'react-toastify';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

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
        if (formData.new_password !== formData.confirm_password) {
            setError('Las nuevas contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.new_password.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        api.post('change_password/', {
            current_password: formData.current_password,
            new_password: formData.new_password
        })
            .then(res => {
                toast.success('Contraseña actualizada correctamente');
                
                // Opcional: cerrar sesión y pedir que inicien de nuevo
                // localStorage.removeItem('access');
                // localStorage.removeItem('refresh');
                // navigate('/login');
                
                // Alternativa: redirigir al perfil
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            })
            .catch(err => {
                console.error('Error:', err);
                let errorMsg = 'Error al cambiar la contraseña';
                
                if (err.response && err.response.data) {
                    if (err.response.data.detail) {
                        errorMsg = err.response.data.detail;
                    } else if (err.response.data.error) {
                        errorMsg = err.response.data.error;
                    }
                }
                
                setError(errorMsg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="container my-5">
            <div className="card shadow" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="card-header" style={{ backgroundColor: '#6050DC', color: 'white' }}>
                    <h5 className="mb-0">Cambiar contraseña</h5>
                </div>
                <div className="card-body">
                    {error && <Error error={error} />}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="current_password" className="form-label">Contraseña actual</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="current_password"
                                name="current_password"
                                value={formData.current_password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="new_password" className="form-label">Nueva contraseña</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="new_password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                            <small className="form-text text-muted">
                                La contraseña debe tener al menos 8 caracteres
                            </small>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="confirm_password" className="form-label">Confirmar nueva contraseña</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                        </div>
                        
                        <div className="d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary" 
                                onClick={() => navigate('/profile')}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={loading}
                                style={{ backgroundColor: '#6050DC', borderColor: '#6050DC' }}
                            >
                                {loading ? "Procesando..." : "Cambiar contraseña"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;