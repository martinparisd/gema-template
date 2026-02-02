import { useState, useEffect } from 'react';
import { X, Calendar, User, Stethoscope, CheckCircle } from 'lucide-react';
import type { Doctor, Service, TimeSlot, BookingFormData, AvailableSlotsResponse } from '../types';
import { getAvailableSlots, createPublicBooking } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  medicalGroupId: string;
  doctors: Doctor[];
  services: Service[];
  preSelectedDoctor?: Doctor;
  preSelectedService?: Service;
}

type BookingStep = 'doctor' | 'service' | 'datetime' | 'form' | 'success';

export default function BookingModal({
  isOpen,
  onClose,
  slug,
  medicalGroupId,
  doctors,
  services,
  preSelectedDoctor,
  preSelectedService,
}: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>('doctor');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(preSelectedDoctor || null);
  const [selectedService, setSelectedService] = useState<Service | null>(preSelectedService || null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlotsResponse, setAvailableSlotsResponse] = useState<AvailableSlotsResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    patient_first_name: '',
    patient_last_name: '',
    patient_email: '',
    patient_phone: '',
    patient_date_of_birth: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (preSelectedDoctor && preSelectedService) {
        setStep('datetime');
      } else if (preSelectedDoctor) {
        setStep('service');
      } else if (preSelectedService) {
        setStep('doctor');
      } else {
        setStep('doctor');
      }
      setSelectedDoctor(preSelectedDoctor || null);
      setSelectedService(preSelectedService || null);
    }
  }, [isOpen, preSelectedDoctor, preSelectedService]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    setLoadingSlots(true);
    setError(null);
    try {
      const response = await getAvailableSlots(
        slug,
        selectedDoctor.id,
        selectedDate
      );
      setAvailableSlotsResponse(response);
    } catch (err) {
      setError('Failed to load available time slots');
      setAvailableSlotsResponse(null);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('service');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('datetime');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedService || !selectedSlot || !selectedDate) return;

    setSubmitting(true);
    setError(null);

    try {
      await createPublicBooking({
        medical_group_id: medicalGroupId,
        doctor_id: selectedDoctor.id,
        service_id: selectedService.id,
        appointment_date: selectedDate,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        ...formData,
      });
      setStep('success');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('doctor');
    setSelectedDoctor(preSelectedDoctor || null);
    setSelectedService(preSelectedService || null);
    setSelectedDate('');
    setSelectedSlot(null);
    setAvailableSlotsResponse(null);
    setFormData({
      patient_first_name: '',
      patient_last_name: '',
      patient_email: '',
      patient_phone: '',
      patient_date_of_birth: '',
      notes: '',
    });
    setError(null);
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Book an Appointment</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {step === 'doctor' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={24} />
                  Select a Doctor
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.filter(d => d.is_active).map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/10 transition"
                    >
                      <h5 className="font-semibold text-gray-900">
                        Dr. {doctor.nombre}
                      </h5>
                      <p className="text-sm text-primary">{doctor.especialidad}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'service' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Stethoscope size={24} />
                  Select a Service
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.filter(s => s.is_active).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/10 transition"
                    >
                      <h5 className="font-semibold text-gray-900">{service.name}</h5>
                      {service.description && (
                        <p className="text-sm text-gray-600">{service.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'datetime' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={24} />
                  Select Date & Time
                </h4>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots
                    </label>
                    {loadingSlots ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading available slots...
                      </div>
                    ) : !availableSlotsResponse || availableSlotsResponse.slots.filter(s => s.available).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {availableSlotsResponse?.message || 'No available slots for this date'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {availableSlotsResponse.slots.filter(s => s.available).map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/10 transition text-sm font-medium"
                          >
                            {slot.start}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 'form' && (
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={24} />
                  Patient Information
                </h4>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.patient_first_name}
                        onChange={(e) => setFormData({ ...formData, patient_first_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.patient_last_name}
                        onChange={(e) => setFormData({ ...formData, patient_last_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.patient_email}
                      onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.patient_phone}
                      onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.patient_date_of_birth}
                      onChange={(e) => setFormData({ ...formData, patient_date_of_birth: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('datetime')}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  Appointment Booked Successfully!
                </h4>
                <p className="text-gray-600 mb-6">
                  You will receive a confirmation email shortly with the appointment details.
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
