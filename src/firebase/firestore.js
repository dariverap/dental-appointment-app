import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
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
    console.log(" Buscando citas para usuario:", userId);
    
    // First, try a simple query without orderBy to avoid index issues
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    console.log(" Documentos encontrados:", querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(" Documento encontrado:", doc.id, data);
      
      appointments.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      });
    });

    // Sort appointments by date in JavaScript (newest first)
    appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log(" Citas procesadas:", appointments.length);

    return {
      success: true,
      appointments
    };
  } catch (error) {
    console.error(" Error getting appointments:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      userId: userId
    });
    
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
      { id: 'implante', name: 'Implante dental', duration: '120 min', price: 800 },
      { id: 'corona', name: 'Corona dental', duration: '90 min', price: 400 }
    ];

    // Default dentists
    const defaultDentists = [
      { id: 'juan', name: 'Dr. Juan Carlos', specialty: 'Odontología general', available: true },
      { id: 'maria', name: 'Dra. María González', specialty: 'Odontología estética', available: true },
      { id: 'carlos', name: 'Dr. Carlos Mendoza', specialty: 'Cirugía oral', available: true },
      { id: 'ana', name: 'Dra. Ana Ruiz', specialty: 'Ortodoncia', available: true },
      { id: 'luis', name: 'Dr. Luis Herrera', specialty: 'Endodoncia', available: true }
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

// Initialize complete data set (improved version)
export const initializeData = async () => {
  try {
    console.log(" Iniciando carga de datos completos...");
    
    // Complete treatments with more details
    const completeTreatments = [
      {
        name: "Limpieza dental",
        duration: "30 min",
        price: 50,
        description: "Limpieza profunda y eliminación de placa bacteriana",
        category: "preventiva"
      },
      {
        name: "Tratamiento de caries",
        duration: "45 min",
        price: 80,
        description: "Eliminación de caries y restauración dental",
        category: "restaurativa"
      },
      {
        name: "Consulta ortodoncia",
        duration: "60 min",
        price: 100,
        description: "Evaluación y plan de tratamiento ortodóntico",
        category: "ortodoncia"
      },
      {
        name: "Extracción dental",
        duration: "45 min",
        price: 70,
        description: "Extracción de pieza dental dañada",
        category: "cirugía"
      },
      {
        name: "Endodoncia",
        duration: "90 min",
        price: 150,
        description: "Tratamiento de conducto radicular",
        category: "endodoncia"
      },
      {
        name: "Blanqueamiento dental",
        duration: "60 min",
        price: 120,
        description: "Tratamiento estético para blanquear dientes",
        category: "estética"
      },
      {
        name: "Implante dental",
        duration: "120 min",
        price: 800,
        description: "Colocación de implante dental",
        category: "implantología"
      },
      {
        name: "Coronas de porcelana",
        duration: "90 min",
        price: 400,
        description: "Colocación de corona de porcelana",
        category: "restaurativa"
      }
    ];

    // Complete dentists with more details
    const completeDentists = [
      {
        name: "Dr. Juan Carlos",
        specialty: "Odontología general",
        available: true,
        schedule: ["lunes", "martes", "miércoles", "jueves", "viernes"],
        experience: "10 años",
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Dra. María González",
        specialty: "Odontología estética",
        available: true,
        schedule: ["lunes", "miércoles", "viernes"],
        experience: "8 años",
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Dr. Carlos Mendoza",
        specialty: "Cirugía oral",
        available: true,
        schedule: ["martes", "jueves", "sábado"],
        experience: "12 años",
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Dra. Ana Ruiz",
        specialty: "Ortodoncia",
        available: true,
        schedule: ["lunes", "martes", "miércoles", "jueves", "viernes"],
        experience: "6 años",
        image: "https://via.placeholder.com/150"
      },
      {
        name: "Dr. Luis Herrera",
        specialty: "Endodoncia",
        available: true,
        schedule: ["martes", "miércoles", "jueves"],
        experience: "15 años",
        image: "https://via.placeholder.com/150"
      }
    ];

    console.log(" Agregando tratamientos...");
    // Add treatments in parallel
    const treatmentPromises = completeTreatments.map(treatment => 
      addDoc(collection(db, TREATMENTS_COLLECTION), {
        ...treatment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    );
    await Promise.all(treatmentPromises);
    console.log(` ${completeTreatments.length} tratamientos agregados`);

    console.log(" Agregando dentistas...");
    // Add dentists in parallel
    const dentistPromises = completeDentists.map(dentist => 
      addDoc(collection(db, DENTISTS_COLLECTION), {
        ...dentist,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    );
    await Promise.all(dentistPromises);
    console.log(` ${completeDentists.length} dentistas agregados`);

    console.log(" ¡Datos inicializados exitosamente!");
    return { success: true };
    
  } catch (error) {
    console.error("Error initializing data:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
