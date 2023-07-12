import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDiEGon8hqDFztY1kteIBir_mvTPHX0_J8",
	authDomain: "whatsapp-web-clone-fcabe.firebaseapp.com",
	projectId: "whatsapp-web-clone-fcabe",
	storageBucket: "whatsapp-web-clone-fcabe.appspot.com",
	messagingSenderId: "254557764141",
	appId: "1:254557764141:web:d26f8c99b0709cc789d6a4",
	measurementId: "G-JTDLY050W7",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
