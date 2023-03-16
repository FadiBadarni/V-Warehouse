// import { useState, useEffect } from "react";

// function useAuth() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const updateAuthStatus = () => {
//     const token = window.localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   };

//   useEffect(() => {
//     updateAuthStatus();

//     const handleStorageChange = (e) => {
//       if (e.key === "token") {
//         updateAuthStatus();
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   const login = (token) => {
//     window.localStorage.setItem("token", token);
//     setIsAuthenticated(true);
//   };
//   useEffect(() => {
//     console.log("isAuthenticated:", isAuthenticated);
//   }, [isAuthenticated]);

//   const logout = () => {
//     window.localStorage.removeItem("token");
//     setIsAuthenticated(false);
//   };

//   return { isAuthenticated, login, logout };
// }

// export default useAuth;
