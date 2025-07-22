import { 
  collection, 
  addDoc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";

// Todos los tratamientos completos
const allTreatments = [
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

// Todos los dentistas completos
const allDentists = [
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

// Función para cargar todos los tratamientos
const loadAllTreatments = async () => {
  console.log("📋 Cargando tratamientos...");
  
  try {
    const promises = allTreatments.map(treatment => 
      addDoc(collection(db, "treatments"), {
        ...treatment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    );
    
    await Promise.all(promises);
    console.log(`✅ ${allTreatments.length} tratamientos cargados exitosamente`);
    return true;
  } catch (error) {
    console.error("❌ Error cargando tratamientos:", error);
    return false;
  }
};

// Función para cargar todos los dentistas
const loadAllDentists = async () => {
  console.log("👨‍⚕️ Cargando dentistas...");
  
  try {
    const promises = allDentists.map(dentist => 
      addDoc(collection(db, "dentists"), {
        ...dentist,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    );
    
    await Promise.all(promises);
    console.log(`✅ ${allDentists.length} dentistas cargados exitosamente`);
    return true;
  } catch (error) {
    console.error("❌ Error cargando dentistas:", error);
    return false;
  }
};

// Función principal para cargar todo
export const loadAllData = async () => {
  console.log("🚀 Iniciando carga masiva de datos...");
  console.log("⏳ Esto puede tomar unos segundos...");
  
  const startTime = Date.now();
  
  try {
    // Cargar tratamientos y dentistas en paralelo
    const [treatmentsSuccess, dentistsSuccess] = await Promise.all([
      loadAllTreatments(),
      loadAllDentists()
    ]);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    if (treatmentsSuccess && dentistsSuccess) {
      console.log("🎉 ¡CARGA COMPLETADA EXITOSAMENTE!");
      console.log(`⚡ Tiempo total: ${duration} segundos`);
      console.log("📊 Resumen:");
      console.log(`   • ${allTreatments.length} tratamientos agregados`);
      console.log(`   • ${allDentists.length} dentistas agregados`);
      console.log("✨ Tu aplicación ya tiene todos los datos necesarios");
    } else {
      console.log("⚠️ Carga completada con algunos errores");
    }
    
  } catch (error) {
    console.error("💥 Error durante la carga:", error);
  }
};

// Para ejecutar desde consola del navegador:
// loadAllData();
