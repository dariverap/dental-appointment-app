import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Register new user
export const registerUser = async (email, password, fullName) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: fullName
    });

    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullName,
      email: email,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        name: fullName,
        email: user.email
      }
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    return {
      success: true,
      user: {
        uid: user.uid,
        name: userData?.name || user.displayName || 'Usuario',
        email: user.email
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current user data
export const getCurrentUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
