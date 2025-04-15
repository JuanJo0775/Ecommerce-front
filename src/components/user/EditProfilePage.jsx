import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Error from '../ui/Error';
import Spinner from '../ui/Spinner';
import { toast } from 'react-toastify';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        city: '',
        state: '',
        address: '',
        phone: ''
    });

    // Cargar los datos del usuario
    useEffect(() => {
        setLoading(true);
        api.get('user_info/')
            .then(res => {
                const userData = res.data;
                setFormData({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    address: userData.address || '',
                    phone: userData.phone || ''
                });
            })
            .catch(err => {
                console.error('Error al cargar datos:', err);
                setError('No se pudieron cargar los datos del perfil');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
        setSubmitLoading(true);
        setError('');

        api.patch('update_profile/', formData)
            .then(res => {
                toast.success('Perfil actualizado correctamente');
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            })
            .catch(err => {
                console.error('Error:', err);
                setError('Error al actualizar el perfil');
            })
            .finally(() => {
                setSubmitLoading(false);
            });
    };

    if (loading) {
        return <Spinner loading={loading} />;
    }

    return (
        <div className="container my-5">
            <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#6050DC', color: 'white' }}>
                    <h5 className="mb-0">Editar perfil</h5>
                </div>
                <div className="card-body">
                    {error && <Error error={error} />}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="first_name" className="form-label">Nombre</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="last_name" className="form-label">Apellido</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
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
                            />
                        </div>
                        
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="city" className="form-label">Ciudad</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="state" className="form-label">Estado/Provincia</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Dirección</label>
                            <textarea 
                                className="form-control" 
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="phone" className="form-label">Teléfono</label>
                            <input 
                                type="tel" 
                                className="form-control" 
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
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
                                disabled={submitLoading}
                                style={{ backgroundColor: '#6050DC', borderColor: '#6050DC' }}
                            >
                                {submitLoading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;