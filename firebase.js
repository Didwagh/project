import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBwUK7tMp-UuOMzyWxDF7AD-y1WlnQtOuw",
  authDomain: "lnapp-b2bd0.firebaseapp.com",
  projectId: "lnapp-b2bd0",
  storageBucket: "lnapp-b2bd0.appspot.com",
  messagingSenderId: "1028192174321",
  appId: "1:1028192174321:web:51e26b41873230e5272950"
};


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export {firebase};