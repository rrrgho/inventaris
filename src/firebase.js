// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAsRiseFF5xjPTNyGR7AhBXT96ez5Jevmo",
    authDomain: "inventaris-2a78d.firebaseapp.com",
    projectId: "inventaris-2a78d",
    storageBucket: "inventaris-2a78d.appspot.com",
    messagingSenderId: "977444649835",
    appId: "1:977444649835:web:17743f776a1c3c25dcea2e",
    measurementId: "G-CY4VCNKV4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)