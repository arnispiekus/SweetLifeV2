'use client';

import { useState, useEffect } from 'react';
import { Send, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { sushiVariations, sushiSizes, getSizeByPieces } from '@/data/sushiData';
import { getMinDateTime, validatePickupDateTime } from '@/lib/sushiValidation';
import SectionHeader from '@/components/ui/SectionHeader';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  pickupDateTime: string;
  specialRequests: string;
}

const SushiOrderForm = () => {
  const [selectedVariation, setSelectedVariation] = useState('Mix');
  const [selectedSize, setSelectedSize] = useState(30);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateTimeError, setDateTimeError] = useState('');
  const [minDateTime, setMinDateTime] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    pickupDateTime: '',
    specialRequests: '',
  });

  useEffect(() => {
    setMinDateTime(getMinDateTime());
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'pickupDateTime') {
      const error = validatePickupDateTime(value);
      setDateTimeError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    const dateTimeValidationError = validatePickupDateTime(formData.pickupDateTime);
    if (dateTimeValidationError) {
      setDateTimeError(dateTimeValidationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPrice = getSizeByPieces(selectedSize);

      const response = await fetch('/api/sushi-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          variation: selectedVariation,
          pieces: selectedSize,
          price: selectedPrice?.price || 0,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPaymentLink(selectedPrice?.paymentLink || '');
        setShowConfirmation(true);
      } else {
        setSubmitError(
          result.error || 'There was an error submitting your order. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitError(
        'There was an error submitting your order. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowConfirmation(false);
    setPaymentLink('');
    setDateTimeError('');
    setSubmitError('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      pickupDateTime: '',
      specialRequests: '',
    });
  };

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.phone &&
      formData.email &&
      formData.pickupDateTime &&
      !dateTimeError
    );
  };

  const selectedPrice = getSizeByPieces(selectedSize);

  return (
    <section className="section bg-stone-50">
      <div className="container max-w-6xl">
        {/* Pre-order Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-16">
          <div className="flex items-start">
            <AlertTriangle size={24} className="text-yellow-500 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">Pre-Order Required</h3>
              <p className="text-yellow-600">
                Please pre-order at least 24 hours in advance to ensure freshness. Each piece is
                handcrafted and made to order using premium ingredients.
              </p>
            </div>
          </div>
        </div>

        {/* Variation Selection */}
        <SectionHeader
          title="Sushi Variations"
          subtitle="Choose your sushi type"
          centered={true}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {sushiVariations.map((variation) => (
            <motion.button
              key={variation.title}
              onClick={() => setSelectedVariation(variation.title)}
              className={`p-6 rounded-lg transition-colors duration-300 text-center ${
                selectedVariation === variation.title
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-stone-800 shadow-md'
              }`}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: selectedVariation === variation.title ? 1.05 : 1 }}
              transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="text-xl font-semibold mb-2">{variation.title}</div>
              <div
                className={`text-sm ${
                  selectedVariation === variation.title ? 'text-white/90' : 'text-stone-600'
                }`}
              >
                {variation.description}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Size Selection */}
        <SectionHeader
          title="Select Your Size"
          subtitle="Choose your preferred quantity"
          centered={true}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-24">
          {sushiSizes.map((option) => (
            <motion.button
              key={option.pieces}
              onClick={() => setSelectedSize(option.pieces)}
              className={`p-6 rounded-lg transition-colors duration-300 ${
                selectedSize === option.pieces
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-stone-800'
              }`}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: selectedSize === option.pieces ? 1.05 : 1 }}
              transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="text-2xl font-semibold mb-1">{option.pieces}</div>
              <div className="text-sm mb-2">pieces</div>
              <div
                className={`text-lg font-medium ${
                  selectedSize === option.pieces ? 'text-white' : 'text-primary'
                }`}
              >
                £{option.price}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Order Form */}
        <SectionHeader
          title="Place Your Pre-Order"
          subtitle="Fill out the form below to request your sushi order"
          centered={true}
        />

        <div className="max-w-2xl mx-auto">
          {showConfirmation ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-8 rounded-lg mb-8 animate-fadeIn">
              <div className="flex items-start mb-4">
                <Check size={24} className="text-green-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Thanks for your order request!
                  </h3>
                  <p className="text-green-600 mb-4">
                    To complete your pre-order, please pay using the link below:
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
                <div className="text-sm text-stone-600 mb-2">Order Summary:</div>
                <div className="font-medium text-stone-800">
                  {selectedSize} pieces • {selectedVariation} • £{selectedPrice?.price}
                </div>
              </div>

              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mb-4"
              >
                Complete Payment
                <ExternalLink size={18} className="ml-2" />
              </a>

              <div className="text-sm text-green-600">
                <p>We&apos;ll contact you within 24 hours to confirm your pickup time.</p>
              </div>

              <button
                onClick={resetForm}
                className="mt-4 text-green-600 hover:text-green-700 underline text-sm"
              >
                Place another order
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
            >
              {/* Order Summary */}
              <div className="bg-stone-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-stone-600 mb-1">Your Selection:</div>
                <div className="font-medium text-stone-800">
                  {selectedSize} pieces • {selectedVariation} • £{selectedPrice?.price}
                </div>
              </div>

              {/* Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Pickup Date/Time */}
              <div>
                <label
                  htmlFor="pickupDateTime"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Preferred Pickup Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="pickupDateTime"
                  name="pickupDateTime"
                  required
                  min={minDateTime}
                  value={formData.pickupDateTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    dateTimeError ? 'border-red-300 bg-red-50' : 'border-stone-200'
                  }`}
                />
                {dateTimeError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{dateTimeError}</p>
                  </div>
                )}
                <div className="mt-2 text-sm text-stone-500">
                  <p className="mb-1">
                    <strong>Collection Hours:</strong>
                  </p>
                  <p>Monday - Saturday: 12:00 PM - 6:00 PM</p>
                  <p>Sunday: 12:00 PM - 5:00 PM</p>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label
                  htmlFor="specialRequests"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={4}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Any special requests or notes for your order?"
                ></textarea>
              </div>

              {/* Notice */}
              <div className="bg-stone-50 p-4 rounded-lg text-sm text-stone-600">
                Sushi orders must be placed at least 24 hours in advance. We will contact you to
                confirm availability and pickup time.
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="w-full btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Pre-Order'}
                <Send size={18} className="ml-2" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SushiOrderForm;
