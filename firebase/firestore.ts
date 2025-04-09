import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "./config";

export const db = getFirestore(app);

export interface FirestoreUser {
  created_time: string;
  department: string;
  display_name: string;
  email: string;
  grade: string;
  is_admin: boolean;
  is_beta: boolean;
  photo_url: string;
  profile_id: string;
  uid: string;
}

export async function getUserData(uid: string): Promise<FirestoreUser | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
