'use client';

import { MessageCircle, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppBookingCTA = () => {
  const whatsappMessage = encodeURIComponent(
    "Hi! I'd like to enquire about booking your private event space."
  );

  return (
    <div className="bg-primary/10 p-8 rounded-2xl text-center max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-4">
        Ready to Book?
      </h2>
      <p className="text-stone-700 mb-8">
        Contact us to check availability and discuss your event requirements.
      </p>

      {/* Primary WhatsApp Button */}
      <motion.a
        href={`https://wa.me/447716508513?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 shadow-lg mb-8"
        whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <MessageCircle size={24} className="mr-3" />
        Book via WhatsApp
      </motion.a>

      {/* Alternative Contact Options */}
      <div className="border-t border-stone-200 pt-6">
        <p className="text-stone-600 text-sm mb-4">Or contact us via:</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:+447716508513"
            className="inline-flex items-center justify-center text-stone-700 hover:text-primary transition-colors"
          >
            <Phone size={18} className="mr-2" />
            +447716508513
          </a>
          <a
            href="mailto:info@sweetlife.cafe"
            className="inline-flex items-center justify-center text-stone-700 hover:text-primary transition-colors"
          >
            <Mail size={18} className="mr-2" />
            info@sweetlife.cafe
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBookingCTA;
