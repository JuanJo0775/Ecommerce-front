import React, { useContext, useState } from 'react';
import Error from '../ui/Error';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./LoginPage.css"
import api from '../../api';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const {setIsAuthenticated, get_username} = useContext(AuthContext)

    const location = useLocation()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const userInfo = {username, password}
   
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
        setLoading(true)
      
        api.post("token/", userInfo)
          .then(res => {
            console.log(res.data);
            localStorage.setItem("access", res.data.access)
            localStorage.setItem("refresh", res.data.refresh)
            setUsername("")
            setPassword("")
            setLoading(false)
            setIsAuthenticated(true)
            get_username()
            setError("")

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
            setError(err.message)
            setLoading(false)
          });
    }

    return (
        <div className="login-container my-5">
            <div className="login-card shadow">
                {error && <Error error={error}/>}
                <h2 className="login-title">Bienvenido</h2>
                <p className="login-subtitle">Inicie sesión por favor</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Usuario</label>
                        <input type="username" value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control" id="email" placeholder="Introduce tu usuario" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control" id="password" placeholder="Introduce tu contraseña" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Procesando..." : "Iniciar sesión"}
                    </button>
                </form>
                <div className="login-footer">
                    <p><a href="#">¿Olvidó su contraseña?</a></p>
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage