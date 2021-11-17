// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore,QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore"
import { collection, doc, getDoc, addDoc, setDoc, getDocs} from "firebase/firestore";
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
  toFirestore: (intervals:Map<number,Array<TimeInterval>>) => {
    let fbMap = new Map<number,any>();
    intervals.forEach((intervalArr, rowNum)=>{
    fbMap.set(rowNum,intervalArr.map((interval)=>{
      return {"start": interval.start,
              "end" : interval.end}
      }));
    });
    return Object.fromEntries(fbMap);
  },
  fromFireStore: (snapsnot:QueryDocumentSnapshot)=>{
    let data = snapsnot.data();
    let timeIntervals = new Map<number,Array<TimeInterval>>();
    for(const rowNum in data.intervals){
      timeIntervals.set(parseInt(rowNum), data.intervals[rowNum].map((interval:{start:number, end:number})=>{
        return new TimeInterval(interval.start,interval.end);
      }));
    }
    data.intervals = timeIntervals;
    return data;
  }
}

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// interface functions

export async function getMeetingData(meetID: string) {
  const docRef = doc(db, "Meetings", meetID);
  const meeting = await getDoc(docRef);
  return meeting.data();
}

export async function getAllUserData(meetID: string) {
  const userData = await getDocs(collection(db, "Meetings", meetID, "Users"));
  let parsedUserData = new Map<string,any>();
  userData.forEach((userDoc)=>{
    parsedUserData.set(userDoc.id,TimeIntervalConverter.fromFireStore(userDoc));
  });
  return parsedUserData;
}


export async function createMeeting(initialData: { [x: string]: any }): Promise<string> {
  const docRef = await addDoc(collection(db, "Meetings"), initialData);
  return docRef.id;
}

export async function setUserInfo(meetID:string, name:string, intervals:Map<number,Array<TimeInterval>>){
  await setDoc(doc(db, "Meetings", meetID, "Users", name), {'intervals':TimeIntervalConverter.toFirestore(intervals)});
}
