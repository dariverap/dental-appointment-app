import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { createAppointment, getDentists, getTreatments } from '../firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import 'react-datepicker/dist/react-datepicker.css';

const NewAppointment = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    treatment: '',
    dentist: '',
    date: null,
    time: ''
  });
  const [treatments, setTreatments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Load treatments and dentists on component mount
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    setDataLoading(true);
    setError('');

    try {
      const [treatmentsResult, dentistsResult] = await Promise.all([
        getTreatments(),
        getDentists()
      ]);

      if (treatmentsResult.success) {
        setTreatments(treatmentsResult.treatments);
      } else {
        console.error('Error loading treatments:', treatmentsResult.error);
      }

      if (dentistsResult.success) {
        setDentists(dentistsResult.dentists);
      } else {
        console.error('Error loading dentists:', dentistsResult.error);
      }

      // If both failed, show error
      if (!treatmentsResult.success && !dentistsResult.success) {
        setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      }

    } catch (error) {
      console.error('Error loading form data:', error);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // Clear error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.treatment || !formData.dentist || !formData.date || !formData.time) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare appointment data for Firestore
      const appointmentData = {
        userId: user.uid,
        treatment: formData.treatment,
        dentist: formData.dentist,
        date: Timestamp.fromDate(formData.date),
        time: formData.time,
        status: 'reservada',
        patientName: user.name,
        patientEmail: user.email
      };

      const result = await createAppointment(appointmentData);
      
      if (result.success) {
        // Show success message and redirect
        alert('¡Cita reservada exitosamente!');
        navigate('/dashboard');
      } else {
        setError('Error al reservar la cita: ' + result.error);
      }
    } catch (error) {
      console.error('Appointment booking error:', error);
      setError('Error inesperado al reservar la cita. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTreatment = treatments.find(t => t.id === formData.treatment);
  const selectedDentist = dentists.find(d => d.id === formData.dentist);

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-dental-gray-50 pt-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-blue-600 mx-auto"></div>
              <p className="mt-4 text-dental-gray-600">Cargando formulario...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dental-gray-50 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dental-gray-900">
            Reservar Nueva Cita
          </h1>
          <p className="mt-2 text-dental-gray-600">
            Completa la información para agendar tu cita dental
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
              onClick={loadFormData}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Reintentar</span>
            </button>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-dental-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Treatment Selection */}
            <div>
              <label className="block text-sm font-medium text-dental-gray-700 mb-2">
                <Stethoscope className="inline h-4 w-4 mr-1" />
                Tipo de Tratamiento
              </label>
              <select
                value={formData.treatment}
                onChange={(e) => handleChange('treatment', e.target.value)}
                className="w-full px-3 py-3 border border-dental-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-blue-500 focus:border-transparent transition-colors duration-200"
                required
              >
                <option value="">Selecciona un tratamiento</option>
                {treatments.map((treatment) => (
                  <option key={treatment.id} value={treatment.id}>
                    {treatment.name} ({treatment.duration})
                  </option>
                ))}
              </select>
              {selectedTreatment && (
                <div className="mt-2 text-sm text-dental-gray-600">
                  <p>Duración estimada: {selectedTreatment.duration}</p>
                  {selectedTreatment.price && (
                    <p>Precio: ${selectedTreatment.price}</p>
                  )}
                </div>
              )}
            </div>

            {/* Dentist Selection */}
            <div>
              <label className="block text-sm font-medium text-dental-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Dentista
              </label>
              <select
                value={formData.dentist}
                onChange={(e) => handleChange('dentist', e.target.value)}
                className="w-full px-3 py-3 border border-dental-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-blue-500 focus:border-transparent transition-colors duration-200"
                required
              >
                <option value="">Selecciona un dentista</option>
                {dentists.filter(dentist => dentist.available).map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    {dentist.name} - {dentist.specialty}
                  </option>
                ))}
              </select>
              {selectedDentist && (
                <p className="mt-1 text-sm text-dental-gray-600">
                  Especialidad: {selectedDentist.specialty}
                </p>
              )}
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-dental-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Fecha
                </label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => handleChange('date', date)}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
                  filterDate={(date) => date.getDay() !== 0} // Exclude Sundays
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona una fecha"
                  className="w-full px-3 py-3 border border-dental-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                />
                <p className="mt-1 text-xs text-dental-gray-500">
                  * No atendemos los domingos
                </p>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-dental-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Hora
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-3 py-3 border border-dental-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-dental-gray-500">
                  * Horario de atención: 8:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            {/* Appointment Summary */}
            {formData.treatment && formData.dentist && formData.date && formData.time && (
              <div className="bg-dental-blue-50 border border-dental-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-dental-blue-900 mb-3">
                  Resumen de la Cita
                </h3>
                <div className="space-y-2 text-sm text-dental-blue-800">
                  <p><strong>Paciente:</strong> {user.name}</p>
                  <p><strong>Tratamiento:</strong> {selectedTreatment?.name}</p>
                  <p><strong>Dentista:</strong> {selectedDentist?.name}</p>
                  <p><strong>Fecha:</strong> {formData.date?.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p><strong>Hora:</strong> {formData.time}</p>
                  <p><strong>Duración:</strong> {selectedTreatment?.duration}</p>
                  {selectedTreatment?.price && (
                    <p><strong>Precio:</strong> ${selectedTreatment.price}</p>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-dental-gray-300 text-dental-gray-700 font-medium rounded-lg hover:bg-dental-gray-50 focus:outline-none focus:ring-2 focus:ring-dental-blue-500 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.treatment || !formData.dentist || !formData.date || !formData.time}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-white font-medium rounded-lg bg-dental-blue-600 hover:bg-dental-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dental-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Reservando...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Cita
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;
