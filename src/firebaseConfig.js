import Firebase from "firebase"
import FirebaseContext from "./firebase/context"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIC-2-asQlV579M2UNijeJoDxyPU0N9u0",
    authDomain: "straypetsfinder.firebaseapp.com",
    databaseURL: "https://straypetsfinder.firebaseio.com",
    projectId: "straypetsfinder",
    storageBucket: "straypetsfinder.appspot.com",
    messagingSenderId: "232809998121",
    appId: "1:232809998121:web:c9aa19e52be184a7f6b938",
    measurementId: "G-Y3S6M8VEY0"
  };

  let app = Firebase.initializeApp(firebaseConfig);
  Firebase.analytics();
  Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);

export const db = app.firestore();
export const storage = app.storage();
export const auth = app.auth();
export {FirebaseContext};