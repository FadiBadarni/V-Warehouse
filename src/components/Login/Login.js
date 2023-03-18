import React, { useState } from "react";
import { loginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(email, password, login);
      if (result.token) {
        window.localStorage.setItem("token", result.token);
        login(result.token);
        navigate("/dashboard"); // Redirect to the dashboard page
      } else {
        navigate("/auth/login-failed"); // Redirect to a login failed page
        console.log("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      navigate("/auth/error"); // Redirect to an error page
    }
  };

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
