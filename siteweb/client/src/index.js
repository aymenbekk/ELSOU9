import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18next
    .use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
    supportedLngs: ['en', 'fr'],
    debug: true,
    detection: {
        order: ['path', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'subdomain'],
        caches: ['cookie']
    },
    backend: {
        loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
        useSuspense: false
    }
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
