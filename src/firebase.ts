// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore,QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore"
import { collection, doc, getDoc, addDoc, deleteDoc } from "firebase/firestore";
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

export class TimeInterval {
  start: number;
  end: number;
  constructor(startTime: number, endTime: number) {
    this.start = startTime;
    this.end = endTime;
  }
  toString() {
    return this.start+ '-' + this.end;
  }
};

//custom TimeInterval converter for firebase
const TimeIntervalConverter = {
  toFirestore: (interval:TimeInterval) => {
      return {
          start: interval.start,
          end: interval.end,
          };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
      const data = snapshot.data(options);
      return new TimeInterval(data.start, data.end);
  }
};
// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// interface functions

export async function getMeetingData(meetID: string) {
  const docRef = doc(db, "Meetings", meetID);
  const meeting = await getDoc(docRef);
  return meeting.data();
}

export async function createMeeting(initialData: { [x: string]: any }): Promise<string> {
  const docRef = await addDoc(collection(db, "Meetings"), initialData);
  //const userRef = await addDoc(collection(db, "Meetings", docRef.id, "Users"), {});
  return docRef.id;
}