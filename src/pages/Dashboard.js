import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Plus, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getUserAppointments, cancelAppointment, getDentists, getTreatments } from '../firebase/firestore';

const Dashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsDataInitialization, setNeedsDataInitialization] = useState(false);
  const [initializingData, setInitializingData] = useState(false);

  // Load data on component mount
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Load appointments, dentists, and treatments in parallel
      const [appointmentsResult, treatmentsResult, dentistsResult] = await Promise.all([
        getUserAppointments(user.uid),
        getTreatments(),
        getDentists()
      ]);

      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.appointments);
      } else {
        console.error('Error loading appointments:', appointmentsResult.error);
      }

      if (treatmentsResult.success) {
        setTreatments(treatmentsResult.treatments);
      }

      if (dentistsResult.success) {
        setDentists(dentistsResult.dentists);
      }

      // Check if we need to initialize data
      const needsInitialization = 
        (!treatmentsResult.success || treatmentsResult.treatments.length === 0) ||
        (!dentistsResult.success || dentistsResult.dentists.length === 0);

      setNeedsDataInitialization(needsInitialization);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadDashboardData();
    }
  }, [loadDashboardData, user]);

  const initializeData = async () => {
    setInitializingData(true);
    try {
      // Import and execute the data loading function
      const { loadAllData } = await import('../scripts/loadAllData');
      await loadAllData();
      
      // Reload dashboard data
      await loadDashboardData();
      
      alert('¡Datos inicializados exitosamente! Ya puedes crear citas.');
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Error al inicializar datos. Por favor, intenta nuevamente.');
    } finally {
      setInitializingData(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      const result = await cancelAppointment(appointmentId);
      if (result.success) {
        // Update local state
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'cancelada' }
              : apt
          )
        );
        alert('Cita cancelada exitosamente');
      } else {
        alert('Error al cancelar la cita: ' + result.error);
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Error inesperado al cancelar la cita');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reservada':
        return <AlertCircle className="h-5 w-5 text-dental-blue-600" />;
      case 'atendida':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelada':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-dental-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reservada':
        return 'bg-dental-blue-100 text-dental-blue-800';
      case 'atendida':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-dental-gray-100 text-dental-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get dentist and treatment names by ID
  const getDentistName = (dentistId) => {
    const dentist = dentists.find(d => d.id === dentistId);
    return dentist?.name || dentistId;
  };

  const getTreatmentName = (treatmentId) => {
    const treatment = treatments.find(t => t.id === treatmentId);
    return treatment?.name || treatmentId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dental-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-blue-600 mx-auto"></div>
              <p className="mt-4 text-dental-gray-600">Cargando tus citas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (needsDataInitialization) {
    return (
      <div className="min-h-screen bg-dental-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-dental-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-dental-gray-900">
                No hay datos disponibles
              </h3>
              <p className="mt-2 text-dental-gray-600">
                Por favor, inicializa los datos para comenzar a crear citas.
              </p>
              <div className="mt-6">
                <button 
                  onClick={initializeData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dental-blue-600 hover:bg-dental-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dental-blue-500"
                >
                  {initializingData ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {initializingData ? 'Iniciando...' : 'Inicializar Datos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dental-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dental-gray-900">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="mt-2 text-dental-gray-600">
            Gestiona tus citas dentales de manera fácil y rápida
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Reintentar</span>
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            to="/new-appointment"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-dental-blue-600 hover:bg-dental-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dental-blue-500 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Reservar Nueva Cita
          </Link>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-dental-gray-200">
          <div className="px-6 py-4 border-b border-dental-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-dental-gray-900">
                Mis Citas
              </h2>
              <p className="text-sm text-dental-gray-600 mt-1">
                Historial y próximas citas programadas
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              className="flex items-center space-x-1 text-dental-blue-600 hover:text-dental-blue-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Actualizar</span>
            </button>
          </div>

          {/* Appointments List */}
          <div className="divide-y divide-dental-gray-200">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-dental-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(appointment.status)}
                        <h3 className="text-lg font-medium text-dental-gray-900">
                          {getTreatmentName(appointment.treatment)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-dental-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{getDentistName(appointment.dentist)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for future appointments */}
                    {appointment.status === 'reservada' && (
                      <div className="ml-4 flex space-x-2">
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-dental-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-dental-gray-900">
                  No tienes citas programadas
                </h3>
                <p className="mt-2 text-dental-gray-600">
                  Comienza reservando tu primera cita dental
                </p>
                <div className="mt-6">
                  <Link
                    to="/new-appointment"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dental-blue-600 hover:bg-dental-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dental-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Reservar Cita
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-dental-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-dental-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dental-gray-600">
                  Citas Programadas
                </p>
                <p className="text-2xl font-bold text-dental-gray-900">
                  {appointments.filter(apt => apt.status === 'reservada').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-dental-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dental-gray-600">
                  Citas Completadas
                </p>
                <p className="text-2xl font-bold text-dental-gray-900">
                  {appointments.filter(apt => apt.status === 'atendida').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-dental-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dental-gray-600">
                  Citas Canceladas
                </p>
                <p className="text-2xl font-bold text-dental-gray-900">
                  {appointments.filter(apt => apt.status === 'cancelada').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
