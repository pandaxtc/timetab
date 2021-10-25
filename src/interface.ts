// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app'
import { getFirestore } from "firebase/firestore"
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmgNMzMa4LLpdA458YzXDHcolsTiZ53bA",
  authDomain: "timetab-51a60.firebaseapp.com",
  projectId: "timetab-51a60",
  storageBucket: "timetab-51a60.appspot.com",
  messagingSenderId: "16185289622",
  appId: "1:16185289622:web:c3900b844cb3826e200bb7",
  measurementId: "G-FQ6CPF04HL"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// interface functions

export async function getMeetingData(meetID:string){
    const docRef = doc(db, "Meetings", meetID);
    const meeting = await getDoc(docRef);
    return meeting.data();
}

export async function createMeeting():Promise<string>{
  const docRef = await addDoc(collection(db, "Meetings"), {});
  return docRef.id;
}