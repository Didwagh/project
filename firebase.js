import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCaIvCAWBxLps5dakPTD3VUudASiorE2GY",
  authDomain: "thisproject-e2260.firebaseapp.com",
  projectId: "thisproject-e2260",
  storageBucket: "thisproject-e2260.appspot.com",
  messagingSenderId: "433497637906",
  appId: "1:433497637906:web:e1fb0d4a135806248684cb"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export {firebase};