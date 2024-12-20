import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAP7r-qSq6UGrQEg-_sc68BRj0xKNneup8",
    authDomain: "data-base-ee506.firebaseapp.com",
    projectId: "data-base-ee506",
    storageBucket: "data-base-ee506.appspot.com",
    messagingSenderId: "1006198489804",
    appId: "1:1006198489804:web:2f7b6db02659b5d1123869",
    measurementId: "G-RF9M16FNPL"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Storage
export const storage = getStorage(app);

// Inicializa o Firebase Analytics (somente no cliente)
export let analytics = null;

if (typeof window !== "undefined") {
    isSupported()
        .then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
                console.log("Firebase Analytics foi inicializado.");
            } else {
                console.warn("Firebase Analytics não é suportado neste ambiente.");
            }
        })
        .catch((error) => console.error("Erro ao verificar suporte para Firebase Analytics:", error));
}
