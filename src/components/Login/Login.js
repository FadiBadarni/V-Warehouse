import React, { useState } from "react";
import { loginUser } from "../../api/UserService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.scss";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(username, password);
      if (result.token) {
        window.localStorage.setItem("token", result.token);
        login(result.token);
        navigate("/dashboard");
      } else {
        navigate("/auth/login-failed");
        console.log("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      navigate("/auth/error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">{t("login.title")}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              {t("login.username")}
            </label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              {t("login.password")}
            </label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="forgot-password">
            <a href="/auth/forgot-password" className="forgot-password-link">
              {t("login.forgotPassword")}
            </a>
          </div>
          <button type="submit" className="login-button">
            {t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
