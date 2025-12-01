import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUser, FaWeight, FaPhone, FaEnvelope, FaWhatsapp, FaCreditCard } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BookingModal = ({ isOpen, onClose, serviceName = '', initialService = '' }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  // Available time slots
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // Available services
  const services = [
    { id: 'express', name: 'Express Dry Cleaning', price: 'Rs 140-200/kg', duration: '4-6 hours' },
    { id: 'regular', name: 'Regular Laundry', price: 'Rs 120/kg', duration: '24 hours' },
    { id: 'stain', name: 'Stain Removal', price: 'Rs 50-200/item', duration: '1-2 days' },
    { id: 'ironing', name: 'Ironing Service', price: 'Rs 80/kg', duration: 'Same day' },
    { id: 'bulk', name: 'Bulk Service', price: 'Custom Quote', duration: '2-3 days' }
  ];

  const formik = useFormik({
    initialValues: {
      service: initialService || serviceName || '',
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
      weight: '1',
      notes: '',
      pickupType: 'store',
      paymentMethod: 'cash'
    },
    validationSchema: Yup.object({
      service: Yup.string().required('Service is required'),
      date: Yup.string().required('Date is required'),
      time: Yup.string().required('Time is required'),
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      phone: Yup.string()
        .matches(/^[0-9+\-\s()]{10,}$/, 'Valid phone number required')
        .required('Phone number is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      weight: Yup.string()
        .matches(/^\d+(\.\d+)?$/, 'Please enter a valid weight')
        .required('Weight is required'),
      pickupType: Yup.string().required('Please select pickup option'),
      paymentMethod: Yup.string().required('Please select payment method')
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        // Format booking data for WhatsApp
        const selectedService = services.find(s => s.name === values.service);
        const whatsappMessage = `*New Booking Request*
        
📋 *Service:* ${values.service}
📅 *Date:* ${values.date}
⏰ *Time:* ${values.time}
👤 *Customer:* ${values.name}
📞 *Phone:* ${values.phone}
📧 *Email:* ${values.email}
⚖️ *Weight:* ${values.weight} kg
📍 *Pickup:* ${values.pickupType === 'store' ? 'Store Drop-off' : 'Request Pickup'}
💳 *Payment:* ${values.paymentMethod}
📝 *Notes:* ${values.notes || 'None'}

💰 *Estimated Price:* ${selectedService?.price}
⏱️ *Estimated Time:* ${selectedService?.duration}

_Booking requested via website_`;

        // Send to Formspree
        const formspreeResponse = await fetch('https://formspree.io/f/movgdlwl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            _subject: `New Booking: ${values.service} - ${values.name}`,
            _replyto: values.email,
            whatsappMessage
          }),
        });

        if (formspreeResponse.ok) {
          setSubmitStatus('success');
          
          // Open WhatsApp for confirmation
          const encodedMessage = encodeURIComponent(whatsappMessage);
          const whatsappUrl = `https://wa.me/9779845810557?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
          
          // Reset form after delay
          setTimeout(() => {
            resetForm();
            setStep(1);
            onClose();
          }, 3000);
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('Booking submission error:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const nextStep = () => {
    if (step === 1 && (!formik.values.service || !formik.values.date)) return;
    if (step === 2 && (!formik.values.name || !formik.values.phone || !formik.values.email)) return;
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Service Details';
      case 2: return 'Customer Information';
      case 3: return 'Payment & Confirm';
      default: return 'Book Service';
    }
  };

  const getStepProgress = () => {
    return `${Math.round((step / 3) * 100)}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-3 text-blue-600" />
                Book Service
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition duration-300 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Step {step} of 3</span>
                <span>{getStepTitle()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: getStepProgress() }}
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <form onSubmit={formik.handleSubmit} className="p-6">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-gray-700 mb-3 font-medium flex items-center">
                    <FaWeight className="mr-2 text-blue-600" />
                    Select Service
                  </label>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                          formik.values.service === service.name
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.name}
                          checked={formik.values.service === service.name}
                          onChange={formik.handleChange}
                          className="mr-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{service.name}</span>
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>{service.price}</span>
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formik.touched.service && formik.errors.service && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.service}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-3 font-medium flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-600" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className={`w-full p-3 border rounded-lg transition duration-300 ${
                        formik.touched.date && formik.errors.date
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={formik.values.date}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.date && formik.errors.date && (
                      <p className="text-red-500 text-sm mt-2">{formik.errors.date}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-3 font-medium flex items-center">
                      <FaClock className="mr-2 text-blue-600" />
                      Select Time
                    </label>
                    <select
                      name="time"
                      className={`w-full p-3 border rounded-lg transition duration-300 ${
                        formik.touched.time && formik.errors.time
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={formik.values.time}
                      onChange={formik.handleChange}
                    >
                      <option value="">Choose time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {formik.touched.time && formik.errors.time && (
                      <p className="text-red-500 text-sm mt-2">{formik.errors.time}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-3 font-medium">
                    Estimated Weight (kg)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="weight"
                      min="0.5"
                      step="0.5"
                      className={`w-full p-3 border rounded-lg transition duration-300 ${
                        formik.touched.weight && formik.errors.weight
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={formik.values.weight}
                      onChange={formik.handleChange}
                      placeholder="Enter weight"
                    />
                    <span className="ml-3 text-gray-600 font-medium">kg</span>
                  </div>
                  {formik.touched.weight && formik.errors.weight && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.weight}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-2">
                    Minimum 0.5 kg • Average shirt: 0.2-0.3 kg
                  </p>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-gray-700 mb-3 font-medium flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full p-3 border rounded-lg transition duration-300 ${
                      formik.touched.name && formik.errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="John Doe"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-3 font-medium flex items-center">
                    <FaPhone className="mr-2 text-blue-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className={`w-full p-3 border rounded-lg transition duration-300 ${
                      formik.touched.phone && formik.errors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="+977 9845810557"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-3 font-medium flex items-center">
                    <FaEnvelope className="mr-2 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full p-3 border rounded-lg transition duration-300 ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="john@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-2">{formik.errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-3 font-medium">
                    Pickup/Delivery Option
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      formik.values.pickupType === 'store'
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="pickupType"
                        value="store"
                        checked={formik.values.pickupType === 'store'}
                        onChange={formik.handleChange}
                        className="sr-only"
                      />
                      <div className="text-2xl mb-2">🏪</div>
                      <span className="font-medium text-gray-800">Store Drop-off</span>
                      <span className="text-sm text-gray-600 mt-1">Fast & Easy</span>
                    </label>
                    
                    <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      formik.values.pickupType === 'pickup'
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="pickupType"
                        value="pickup"
                        checked={formik.values.pickupType === 'pickup'}
                        onChange={formik.handleChange}
                        className="sr-only"
                      />
                      <div className="text-2xl mb-2">🚚</div>
                      <span className="font-medium text-gray-800">Request Pickup</span>
                      <span className="text-sm text-gray-600 mt-1">Door-to-door</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-3 font-medium">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none"
                    placeholder="Special instructions, stain details, fabric type..."
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <FaCreditCard className="mr-2 text-blue-600" />
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                      formik.values.paymentMethod === 'cash'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formik.values.paymentMethod === 'cash'}
                        onChange={formik.handleChange}
                        className="mr-3 text-green-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Pay when you receive your clothes</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                      formik.values.paymentMethod === 'credit'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={formik.values.paymentMethod === 'credit'}
                        onChange={formik.handleChange}
                        className="mr-3 text-blue-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">Credit/Debit Card</span>
                        <p className="text-sm text-gray-600">Pay securely online</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                      formik.values.paymentMethod === 'esewa'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="esewa"
                        checked={formik.values.paymentMethod === 'esewa'}
                        onChange={formik.handleChange}
                        className="mr-3 text-purple-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">eSewa/Khalti</span>
                        <p className="text-sm text-gray-600">Mobile payment</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Booking Summary */}
                <div className="border rounded-xl p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-800">{formik.values.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium text-gray-800">{formik.values.date} at {formik.values.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium text-gray-800">{formik.values.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-800">{formik.values.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium text-gray-800">
                        {formik.values.pickupType === 'store' ? 'Store Drop-off' : 'Home Pickup'}
                      </span>
                    </div>
                    <hr className="my-2 border-blue-200" />
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>Estimated Total:</span>
                      <span>Rs {(parseFloat(formik.values.weight) * 140).toFixed(0)}-{(parseFloat(formik.values.weight) * 200).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">
                      ✅ Booking confirmed! Redirecting to WhatsApp for confirmation...
                    </p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 font-medium">
                      ❌ There was an error submitting your booking. Please try again or call us directly.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300 font-medium"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300 font-medium"
                >
                  Cancel
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaWhatsapp className="mr-2" />
                      Confirm via WhatsApp
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Help Text */}
            <p className="text-gray-500 text-sm text-center mt-4">
              Need help? Call us at <a href="tel:+9779845810557" className="text-blue-600 hover:underline">(+977) 9845810557</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;