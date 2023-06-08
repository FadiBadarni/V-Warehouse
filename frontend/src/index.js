import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";
i18n
  .use(HttpApi)
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "he"],
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/translations/{{lng}}/{{ns}}.json",
    },
    ns: [
      "home",
      "navbar",
      "login",
      "warehouse",
      "itemReservation",
      "sidebar",
      "borrowRequests",
      "dashboard",
      "adminHome",
      "userInfo",
      "rowDetailsQR",
      "terms",
    ],
    defaultNS: "home",
  });

const theme = createTheme({
  components: {
    MuiModal: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
});

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Router>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </Router>
);
