import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, logEvent } from "firebase/analytics";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAP7r-qSq6UGrQEg-_sc68BRj0xKNneup8",
  authDomain: "data-base-ee506.firebaseapp.com",
  projectId: "data-base-ee506",
  storageBucket: "data-base-ee506.appspot.com",
  messagingSenderId: "1006198489804",
  appId: "1:1006198489804:web:2f7b6db02659b5d1123869",
  measurementId: "G-RF9M16FNPL",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Storage
export const storage = getStorage(app);

// Inicializa o Firebase Analytics
export const analytics = getAnalytics(app);

/**
 * Função para registrar eventos no Firebase Analytics.
 * 
 * @param {string} eventName - Nome do evento.
 * @param {object} eventParams - (Opcional) Parâmetros adicionais do evento.
 */
export function trackEvent(eventName, eventParams = {}) {
  try {
    logEvent(analytics, eventName, eventParams);
    console.log(`Evento '${eventName}' registrado com sucesso!`, eventParams);
  } catch (error) {
    console.error("Erro ao registrar evento:", error);
  }
}
