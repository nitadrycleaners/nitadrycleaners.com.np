import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaWrench, FaTools, FaCog, FaHeadset,
  FaCar, FaBus, FaParking,
  FaCheck, FaArrowRight, FaStar, FaUsers, FaAward,
  FaWhatsapp, FaRegCalendarAlt, FaShieldAlt, FaRocket,
  FaTshirt, FaBroom, FaFire
} from 'react-icons/fa';
import './index.css';
import BookingModal from './BookingModal.jsx';

// Components
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600 flex items-center">
              <FaWrench className="mr-2" />
              NitaDryCleaners
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
              <FaMapMarkerAlt className="mr-1" /> Home
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
              <FaTools className="mr-1" /> Services
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
              <FaStar className="mr-1" /> Reviews
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
              <FaHeadset className="mr-1" /> Contact
            </a>
            <a href="#location" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
              <FaMapMarkerAlt className="mr-1" /> Location
            </a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg flex items-center">
              <FaPhone className="mr-2" /> (+977) 9845810557
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsOpen(false)}>
                <FaMapMarkerAlt className="mr-2" /> Home
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsOpen(false)}>
                <FaTools className="mr-2" /> Services
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsOpen(false)}>
                <FaStar className="mr-2" /> Reviews
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsOpen(false)}>
                <FaHeadset className="mr-2" /> Contact
              </a>
              <a href="#location" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center" onClick={() => setIsOpen(false)}>
                <FaMapMarkerAlt className="mr-2" /> Location
              </a>
              <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-4 shadow-md flex items-center justify-center">
                <FaPhone className="mr-2" /> (+977) 9845810557
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Real Contact Form Component
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      preferredContact: 'email'
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
      service: Yup.string()
        .required('Please select a service'),
      message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .required('Message is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setSubmitStatus(null);
      
      try {
        const response = await fetch('https://formspree.io/f/movgdlwl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
            service: values.service,
            message: values.message,
            preferredContact: values.preferredContact,
            _subject: `New Contact Form Submission from ${values.name}`
          }),
        });
        
        if (response.ok) {
          setSubmitStatus('success');
          resetForm();
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const services = [
    'Express Dry Cleaning',
    'Regular Laundry',
    'Stain Removal',
    'Ironing Service',
    'Special Garment Care',
    'Bulk Service'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              className={`w-full p-3 border rounded-lg transition duration-300 ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              placeholder="John Doe"
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              className={`w-full p-3 border rounded-lg transition duration-300 ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              placeholder="john@example.com"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              placeholder="+977 9845810557"
              {...formik.getFieldProps('phone')}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Service Needed *
            </label>
            <select
              name="service"
              className={`w-full p-3 border rounded-lg transition duration-300 ${
                formik.touched.service && formik.errors.service
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              {...formik.getFieldProps('service')}
            >
              <option value="">Select a service</option>
              {services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {formik.touched.service && formik.errors.service && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.service}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Preferred Contact Method
          </label>
          <div className="flex space-x-4">
            {['email', 'phone', 'whatsapp'].map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  name="preferredContact"
                  value={method}
                  checked={formik.values.preferredContact === method}
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700 capitalize">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Message *
          </label>
          <textarea
            name="message"
            rows="5"
            className={`w-full p-3 border rounded-lg transition duration-300 resize-none ${
              formik.touched.message && formik.errors.message
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
            placeholder="Please describe your service needs in detail..."
            {...formik.getFieldProps('message')}
          />
          {formik.touched.message && formik.errors.message && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
          )}
        </div>

        {/* Submit Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">
              ✅ Thank you! Your message has been sent successfully. We'll contact you within 24 hours.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-medium">
              ❌ There was an error sending your message. Please try again or call us directly.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
          } text-white`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>

        <p className="text-gray-500 text-sm text-center">
          By submitting this form, you agree to our privacy policy. We'll never share your information.
        </p>
      </form>
    </div>
  );
};

// Real Service Data
const servicesData = [
  {
    id: 1,
    title: 'Express Dry Cleaning',
    description: 'Same-day premium dry cleaning service.',
    icon: <FaRocket className="w-8 h-8" />,
    color: 'bg-blue-100 text-blue-600',
    features: ['Same-day service', 'Delicate fabrics', 'Free pickup'],
    price: 'Rs 140-200 per kg',
    duration: '4-6 hours',
    whatsappMessage: 'Hello! I want to book Express Dry Cleaning service.'
  },
  {
    id: 2,
    title: 'Regular Laundry',
    description: 'Professional washing and folding service.',
    icon: <FaTshirt className="w-8 h-8" />,
    color: 'bg-green-100 text-green-600',
    features: ['Wash & fold', 'Eco-friendly', 'Affordable'],
    price: 'Rs 120 per kg',
    duration: '24 hours',
    whatsappMessage: 'Hello! I want to book Regular Laundry service.'
  },
  {
    id: 3,
    title: 'Stain Removal',
    description: 'Expert treatment for tough stains.',
    icon: <FaBroom className="w-8 h-8" />,
    color: 'bg-yellow-100 text-yellow-600',
    features: ['Free inspection', 'Guaranteed', 'All fabrics'],
    price: 'Rs 50-200 per item',
    duration: '1-2 days',
    whatsappMessage: 'Hello! I need Stain Removal service.'
  },
  {
    id: 4,
    title: 'Ironing Service',
    description: 'Professional pressing and ironing.',
    icon: <FaFire className="w-8 h-8" />,
    color: 'bg-red-100 text-red-600',
    features: ['Steam pressing', 'Crisp finish', 'Quick service'],
    price: 'Rs 80 per kg',
    duration: 'Same day',
    whatsappMessage: 'Hello! I want to book Ironing Service.'
  }
];

// Real Testimonials
const testimonialsData = [
  {
    id: 1,
    name: 'Prashant Bu dhathoki',
    role: 'Student',
    content: 'This laundry is so good.Its very clean, the machines are well-maintained, and the pickup services are so fast and easy. The staff were friendly and helpful, and my clothes came out perfectly clean with good smell of detergent',
    rating: 5,
    date: '2 weeks ago',
    avatar: 'PB'
  },
  {
    id: 2,
    name: 'Kamala Shreshtha',
    role: 'Homeowner',
    content: 'Neat and clean is nitu dry cleaner😍Friendly service 😍',
    rating: 5,
    date: '1 month ago',
    avatar: 'KS'
  },
  {
    id: 3,
    name: 'Dipesh Basnet',
    role: 'Office Manager',
    content: 'I am absolutely thrilled with the service at Nita Dry Cleaners! They did an amazing job on my dress, removing a tough stain that had been bothering me for weeks. The staff is friendly, efficient, and the prices are very reasonable. Ive found my new go-to dry cleaners! Highly recommend!',
    rating: 5,
    date: '3 months ago',
    avatar: 'DB'
  }
];

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <FaWrench className="text-blue-400 mr-2" />
              <h2 className="text-2xl font-bold">Nita Dry Cleaners</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Professional dry cleaning and laundry services in Kathmandu. Quality cleaning with quick turnaround time.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100089931079034" className="text-gray-400 hover:text-white transition duration-300 hover:scale-110">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/nitadrycleaners/" className="text-gray-400 hover:text-white transition duration-300 hover:scale-110">
                <FaInstagram size={20} />
              </a>
              <a href="" className="text-gray-400 hover:text-white transition duration-300 hover:scale-110">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 flex items-center"><FaArrowRight className="mr-2" /> Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 flex items-center"><FaArrowRight className="mr-2" /> Services</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 flex items-center"><FaArrowRight className="mr-2" /> Reviews</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 flex items-center"><FaArrowRight className="mr-2" /> Contact</a></li>
              <li><a href="#location" className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 flex items-center"><FaArrowRight className="mr-2" /> Location</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 cursor-pointer flex items-center"><FaCheck className="mr-2" /> Express Dry Cleaning</span></li>
              <li><span className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 cursor-pointer flex items-center"><FaCheck className="mr-2" /> Regular Laundry</span></li>
              <li><span className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 cursor-pointer flex items-center"><FaCheck className="mr-2" /> Stain Removal</span></li>
              <li><span className="text-gray-400 hover:text-white transition duration-300 hover:pl-2 cursor-pointer flex items-center"><FaCheck className="mr-2" /> Ironing Service</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center group">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:bg-blue-700 transition duration-300">
                  <FaMapMarkerAlt className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">Hariyali, Satungal</p>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">Kathmandu, Nepal</p>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:bg-blue-700 transition duration-300">
                  <FaPhone className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">(+977) 9845810557</p>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">24/7 Emergency Service</p>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:bg-blue-700 transition duration-300">
                  <FaEnvelope className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">nitadrycleaners@gmail.com</p>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:bg-blue-700 transition duration-300">
                  <FaClock className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">Mon-Fri: 7am-7pm</p>
                  <p className="text-gray-400 group-hover:text-white transition duration-300">Sat: 8am-6pm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Nita Dry Cleaners. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            <a href="#" className="hover:text-white transition duration-300">Privacy Policy</a> | 
            <a href="#" className="hover:text-white transition duration-300 ml-2">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  return (
    <div className="min-h-screen flex flex-col" id="home">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16">
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-shadow-lg">
              Professional <span className="text-yellow-300">Dry Cleaning</span> <br />
              <span className="text-3xl md:text-5xl lg:text-6xl">When You Need It Most</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Professional dry cleaning and laundry services in Kathmandu. Emergency response available. 
              Satisfaction guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in">
              <a
                href="#contact"
                className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <FaPhone className="mr-2" /> Get Free Quote
              </a>
              <a
                href="tel:+9779845810557"
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <FaWhatsapp className="mr-2" /> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
<section id="services" className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Professional Services</h2>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto">
        Comprehensive dry cleaning and laundry services backed by our 100% satisfaction guarantee
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {servicesData.map((service, index) => (
        <div 
          key={service.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="p-6">
            <div className={`w-16 h-16 ${service.color.split(' ')[0]} rounded-full flex items-center justify-center mb-6 mx-auto`}>
              <div className={service.color.split(' ')[1]}>
                {service.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{service.title}</h3>
            <p className="text-gray-600 mb-6 text-center leading-relaxed">{service.description}</p>
            
            <div className="space-y-3 mb-6">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Price and Duration section */}
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600 block">{service.price}</span>
                <p className="text-gray-500 text-sm mt-1">{service.duration}</p>
              </div>
            </div>
            
            {/* Only WhatsApp Button (removed the blue Book Now button) */}
            <a
              href={`https://wa.me/9779845810557?text=${encodeURIComponent(service.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              <FaWhatsapp className="mr-2" />
              Quick Book on WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            <p className="text-gray-600 text-lg">What our customers say about our services</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                
                <p className="text-gray-500 text-sm">{testimonial.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us Today</h2>
            <p className="text-gray-600 text-lg">Get a free quote or schedule a service appointment</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Get In Touch</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <FaPhone className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Call Us</h4>
                      <p className="text-gray-600">(+977) 9845810557</p>
                      <p className="text-gray-500 text-sm">24/7 Emergency Service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <FaEnvelope className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Email Us</h4>
                      <p className="text-gray-600">nitadrycleaners@gmail.com</p>
                      <p className="text-gray-500 text-sm">Response within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <FaClock className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600">Mon-Fri: 7:00 AM - 7:00 PM</p>
                      <p className="text-gray-600">Sat: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-500 text-sm">Emergency services available 24/7</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                      <FaShieldAlt className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Guarantee</h4>
                      <p className="text-gray-600">100% Satisfaction Guarantee</p>
                      <p className="text-gray-500 text-sm">Quality service guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Location</h2>
            <p className="text-gray-600 text-lg">Visit Nita Dry Cleaners at our convenient location</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <h3 className="text-2xl font-bold flex items-center">
                    <FaMapMarkerAlt className="mr-3" />
                    Nita Dry Cleaners Location
                  </h3>
                </div>
                
                {/* Your Google Maps Embed */}
                <div className="h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9131655187816!2d85.24778237550888!3d27.689078576193076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb23002568026b%3A0x6942a5bf254c3e8b!2sNita%20Dry%20Cleaners%20and%20laundry!5e0!3m2!1sen!2snp!4v1764576659500!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nita Dry Cleaners Location Map"
                    className="rounded-b-xl"
                  />
                </div>
                
                <div className="p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-800 mb-3">Service Area</h4>
                  <p className="text-gray-600">
                    We serve the entire Kathmandu area including:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kirtipur', 'Thimi', 'Madhyapur'].map((area) => (
                      <div key={area} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" size={12} />
                        <span className="text-gray-700 text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Info */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Visit Our Store</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <FaMapMarkerAlt className="text-blue-600 mr-2" />
                      Store Address
                    </h4>
                    <p className="text-gray-700 font-medium">Nita Dry Cleaners and Laundry</p>
                    <p className="text-gray-700">Hariyali, Satungal, Kathmandu 44600</p>
                    <p className="text-gray-700">Nepal</p>
                    <p className="text-gray-500 text-sm mt-2">Near Satungal Chowk, Easy to find location</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <FaClock className="text-purple-600 mr-2" />
                      Business Hours
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">Sunday - Friday:</span>
                        <span className="text-gray-700 font-bold">7:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">Saturday:</span>
                        <span className="text-gray-700 font-bold">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">Public Holidays:</span>
                        <span className="text-gray-700 font-bold">8:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <FaCar className="text-green-600 mr-2" />
                      Parking & Transportation
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <FaParking className="text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-700">Street Parking Available</p>
                          <p className="text-gray-500 text-sm">Ample parking space around the area</p>
                        </div>
                      </li>
                      <li className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <FaBus className="text-green-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-700">Bus Stop Nearby</p>
                          <p className="text-gray-500 text-sm">Satungal bus stop - 2 minutes walk</p>
                        </div>
                      </li>
                      <li className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <div className="text-yellow-500 mr-3">🚕</div>
                        <div>
                          <p className="font-medium text-gray-700">Taxi & Ride Sharing</p>
                          <p className="text-gray-500 text-sm">Easy access via Pathao, Indrive, Yango</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h4 className="font-bold text-gray-800 mb-3">Store Features</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Free pickup and delivery service</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Same-day service available</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Eco-friendly cleaning products</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Digital payment accepted</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">Waiting area available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Directions Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How to Reach Us</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-2xl">🚗</div>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">By Private Vehicle</h4>
                <p className="text-gray-600 text-sm">From Satungal: 1 minute drive via Hariyali Gate</p>
              </div>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaBus className="text-green-500 text-2xl" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">By Public Transport</h4>
                <p className="text-gray-600 text-sm">Any bus going to Thankot or Kalanki</p>
              </div>
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-2xl">🚶</div>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Walking Distance</h4>
                <p className="text-gray-600 text-sm">5 minutes walk from Gurujdhara or Naikap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote. No obligation, just professional advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="#contact"
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <FaRocket className="mr-2" /> Get Free Quote
            </a>
            <a
              href="tel:+9779845810557"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <FaPhone className="mr-2" /> Call Now
            </a>
          </div>
          <p className="text-blue-200 mt-8 text-sm">
            ⚡ Same-day service available • ⭐ 100% Satisfaction Guarantee • 📋 Professional Service
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;