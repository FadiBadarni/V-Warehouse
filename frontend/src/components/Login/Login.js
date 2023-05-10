import React, { useState } from "react";
import { loginUser } from "../../api/UserService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { InputAdornment, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import images from "../../constants/images";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { animated, useSpring } from "react-spring";
import "./Login.scss";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(username, password);
      if (result.token) {
        window.localStorage.setItem("token", result.token);
        login(result.token);
        if (result.userInfo.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(error.message);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-section">
            <h1 className="login-title">{t("login.title")}</h1>
            <form onSubmit={handleSubmit} className="login-form">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}>
                  <div className="input-group">
                    <label htmlFor="username" className="input-label">
                      {t("login.username")}
                    </label>
                    <animated.div
                      className="input-wrapper"
                      style={useSpring({
                        from: {
                          opacity: 0,
                          transform: "translate3d(-100%, 0, 0)",
                        },
                        to: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
                        delay: 200,
                      })}>
                      <InputAdornment position="start">
                        <IconButton className="icon-button">
                          <AccountCircle />
                        </IconButton>
                      </InputAdornment>

                      <input
                        id="username"
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                      />
                    </animated.div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="password" className="input-label">
                      {t("login.password")}
                    </label>
                    <animated.div
                      className="input-wrapper"
                      style={useSpring({
                        from: {
                          opacity: 0,
                          transform: "translate3d(-100%, 0, 0)",
                        },
                        to: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
                        delay: 400,
                      })}>
                      <InputAdornment position="start">
                        <IconButton
                          onClick={handleShowPassword}
                          className="icon-button">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                      />
                    </animated.div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="forgot-password">
                <a
                  href="/auth/forgot-password"
                  className="forgot-password-link">
                  {t("login.forgotPassword")}
                </a>
              </div>
              <button type="submit" className="login-button">
                {t("login.submit")}
              </button>
              <div className="error-message">{error}</div>
            </form>
          </div>
          <div className="login-image-section">
            <motion.img
              src={images.loginbg}
              alt="Login illustration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="login-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
