
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const BASE_URL = "http://127.0.0.1:8001";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Agrega esto para enviar cookies de sesión si las usas
});

// Mejor manejo de tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;
        
        if (expiry_date > current_time) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token expirado, borra el token y redirige a login
          console.warn("Token expirado, sesión cerrada");
          localStorage.removeItem("access");
          // Si tienes un refresh token podrías renovar aquí
          // window.location.href = '/login';
        }
      } catch (error) {
        console.error("Error decodificando token:", error);
        localStorage.removeItem("access"); // Token inválido
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Agregar interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Sesión expirada o inválida");
      localStorage.removeItem("access");
      // Si estás usando refresh token, podrías intentar renovar aquí
      // De lo contrario, redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;