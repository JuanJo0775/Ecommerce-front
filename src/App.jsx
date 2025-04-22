import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./components/home/HomePage";
import NotFoundPage from "./components/ui/NotFoundPage";
import ProductPage from "./components/product/ProductPage";
import CartPage from "./components/cart/CartPage";
import { useState, useEffect } from "react";
import LoginPage from "./components/user/LoginPage"; 
import RegisterPage from "./components/user/RegisterPage";
import api from "./api";
import CheckoutPage from "./components/checkout/CheckoutPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";
import UserProfilePage from "./components/user/UserProfilePage";
import EditProfilePage from "./components/user/EditProfilePage";
import ChangePasswordPage from "./components/user/ChangePasswordPage";
import PaymentStatusPage from "./components/payments/PaymentsStatusPage";
import ChatbotPage from "./components/chatbot/ChatbotPage";


// Importa los componentes necesarios para Chatbase
import ChatbaseBot from "./components/chatbot/ChatbaseBot";

const App = () => {
  const [numCartItems, setNumberCartItems] = useState(0);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(() => {
    if (cart_code) {
      api.get(`get_cart_stat?cart_code=${cart_code}`)
        .then(res => {
          console.log(res.data);
          setNumberCartItems(res.data.num_of_items);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }, []);

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout numCartItems={numCartItems} />}>
          <Route index element={<HomePage />} />
          <Route path="products/:slug" element={<ProductPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="cart" element={<CartPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="profile/edit" element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
          <Route path="profile/change-password" element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          } />
          <Route path="payment-status" element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="chat" element={<ChatbotPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;