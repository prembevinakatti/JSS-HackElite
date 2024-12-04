import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

class FirebaseService {
  constructor() {
    ////should change this config
    this.firebaseConfig = {
      apiKey: "AIzaSyD7T4FKDtgJOH5dVsd1DfUk5mqZpyfIp6U",
      authDomain: "servo-e8fdf.firebaseapp.com",
      projectId: "servo-e8fdf",
      storageBucket: "servo-e8fdf.appspot.com",
      messagingSenderId: "169625164665",
      appId: "1:169625164665:web:7844e2658b83a699a1ada8",
      measurementId: "G-TZ70JLZ7QC",
    };
    this.vapidKey ="BDFIMSgxT6nNM-CDpgUlG05oHUjD69OG-ovq-VHBD5pHxqKp-RnOtiAOHu2tQQ3fU8AymC9erAlwnNrfpDnAvoE";
    this.app = initializeApp(this.firebaseConfig);
    this.messaging = getMessaging(this.app);
  }

  async requestToken() {
    try {
      const currentToken = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
      });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        return currentToken; // Return token if needed
      } else {
        console.warn("No registration token available. Request permission to generate one.");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
      throw error; // Re-throw for further handling if necessary
    }
  }
}
const firebaseService = new FirebaseService();
export default firebaseService;
