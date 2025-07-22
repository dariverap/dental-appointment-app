import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";

// Collections
const APPOINTMENTS_COLLECTION = "appointments";
const DENTISTS_COLLECTION = "dentists";
const TREATMENTS_COLLECTION = "treatments";

// Create new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user appointments
export const getUserAppointments = async (userId) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      });
    });

    return {
      success: true,
      appointments
    };
  } catch (error) {
    console.error("Error getting appointments:", error);
    return {
      success: false,
      error: error.message,
      appointments: []
    };
  }
};

// Update appointment
export const updateAppointment = async (appointmentId, updateData) => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await updateDoc(appointmentRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Cancel appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await updateDoc(appointmentRef, {
      status: "cancelada",
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get available dentists
export const getDentists = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, DENTISTS_COLLECTION));
    const dentists = [];
    
    querySnapshot.forEach((doc) => {
      dentists.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      dentists
    };
  } catch (error) {
    console.error("Error getting dentists:", error);
    return {
      success: false,
      error: error.message,
      dentists: []
    };
  }
};

// Get available treatments
export const getTreatments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TREATMENTS_COLLECTION));
    const treatments = [];
    
    querySnapshot.forEach((doc) => {
      treatments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      treatments
    };
  } catch (error) {
    console.error("Error getting treatments:", error);
    return {
      success: false,
      error: error.message,
      treatments: []
    };
  }
};

// Initialize default data (run once to populate collections)
export const initializeDefaultData = async () => {
  try {
    // Default treatments
    const defaultTreatments = [
      { id: 'limpieza', name: 'Limpieza dental', duration: '30 min', price: 50 },
      { id: 'caries', name: 'Tratamiento de caries', duration: '45 min', price: 80 },
      { id: 'ortodoncia', name: 'Consulta ortodoncia', duration: '60 min', price: 100 },
      { id: 'extraccion', name: 'Extracción dental', duration: '45 min', price: 70 },
      { id: 'endodoncia', name: 'Endodoncia', duration: '90 min', price: 150 },
      { id: 'blanqueamiento', name: 'Blanqueamiento dental', duration: '60 min', price: 120 },
      { id: 'implante', name: 'Consulta implantes', duration: '45 min', price: 200 },
      { id: 'revision', name: 'Revisión general', duration: '30 min', price: 40 }
    ];

    // Default dentists
    const defaultDentists = [
      { id: 'juan', name: 'Dr. Juan Carlos', specialty: 'Odontología general', available: true },
      { id: 'carla', name: 'Dra. Carla Mendoza', specialty: 'Endodoncia', available: true },
      { id: 'miguel', name: 'Dr. Miguel Torres', specialty: 'Ortodoncia', available: true },
      { id: 'sofia', name: 'Dra. Sofía Ramírez', specialty: 'Cirugía oral', available: true },
      { id: 'ricardo', name: 'Dr. Ricardo López', specialty: 'Periodoncia', available: true }
    ];

    // Add treatments
    for (const treatment of defaultTreatments) {
      await addDoc(collection(db, TREATMENTS_COLLECTION), treatment);
    }

    // Add dentists
    for (const dentist of defaultDentists) {
      await addDoc(collection(db, DENTISTS_COLLECTION), dentist);
    }

    console.log("Default data initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("Error initializing default data:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
