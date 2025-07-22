import { initializeDefaultData } from '../firebase/firestore';

// Script to initialize default data in Firestore
// Run this once after setting up Firebase to populate the database

const initializeData = async () => {
  console.log('🔄 Inicializando datos por defecto en Firestore...');
  
  try {
    const result = await initializeDefaultData();
    
    if (result.success) {
      console.log('✅ Datos inicializados exitosamente');
      console.log('📋 Se han agregado:');
      console.log('   - 8 tratamientos dentales');
      console.log('   - 5 dentistas disponibles');
      console.log('');
      console.log('🎉 ¡La aplicación está lista para usar!');
    } else {
      console.error('❌ Error al inicializar datos:', result.error);
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
};

// Uncomment the line below and run this script once to initialize data
// initializeData();

export default initializeData;
