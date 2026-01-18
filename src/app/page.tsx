import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight, Phone, Mail, ShoppingBag, Check, MessageCircle } from 'lucide-react';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import GoogleReviews from '@/components/ui/GoogleReviews';

const FOODSERVE_URL = 'https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642';

export default function HomePage() {
  const sweetImageUrl = '/SweetLifeCafe_Hero_1.webp';

  return (
    <div className="overflow-x-hidden">
      <h1 className="sr-only">Sweet Life Cafe - Breakfast, Lunch & Coffee in Newry</h1>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center -mt-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${sweetImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container text-center text-white p-4">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Sweet. Savory. <span className="text-primary">Unforgettable.</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            From authentic Korean Bingsu to vibrant poke bowls and gourmet coffee, discover the unexpected delights waiting for you at Sweet Life.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href={FOODSERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center text-lg font-bold px-8 py-4 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50"
            >
              <ShoppingBag size={22} className="mr-3" />
              Order Now
            </a>
            <Link href="/menu" className="btn btn-outline text-white border-white hover:bg-white/20">
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content (Screen Reader Only) */}
      <div className="sr-only">
        <section className="section bg-stone-50">
          <div className="container max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Welcome to Sweet Life Cafe - The Heart of Cafe Culture in Newry</h2>
            <p className="mb-4 text-lg text-stone-700">
              Welcome to Sweet Life Cafe, the leading <strong>Cafe Newry</strong> destination for authentic Korean cuisine, specialty coffee, and a diverse menu that delights every palate. Located in the vibrant center of Newry, Sweet Life Cafe is renowned for its warm atmosphere, friendly service, and a menu that brings together the best of Korean, Japanese, and European flavors. If you are searching for the best <strong>cafe in Newry</strong>, look no further than Sweet Life Cafe, where every visit is a culinary adventure.
            </p>
            <p className="mb-4 text-lg text-stone-700">
              Our extensive menu features signature Korean <strong>Bingsu</strong> (shaved ice desserts) in flavors like Mango Cheesecake, Matcha, Oreo Crunch, and Strawberry Cheesecake, making us the top spot for <strong>Bingsu in Newry</strong>. For breakfast in Newry, enjoy our Acai Granola Bowl, French Toast, Omelette, Poached Egg Bacon Bagel, and hearty Porridge. Our <strong>breakfast menu</strong> is perfect for early risers and brunch lovers alike.
            </p>
            <p className="mb-4 text-lg text-stone-700">
              For lunch in Newry, Sweet Life Cafe offers a wide selection of delicious options: try our Bibimbap, Poke Bowl, Sushi Platter, Sourdough Pizza, Korean Ramen, and vibrant Salads like Greek Salad and Caprese Salad. Our <strong>sushi menu</strong> is a local favorite, featuring classic rolls, creative special rolls, and fresh ingredients. We also serve <strong>Bubble Tea in Newry</strong> with flavors such as Brown Sugar Milk Tea, Mango Fruit Tea, Lychee Mojito, and Taro Milk Tea, as well as a variety of <strong>Gourmet Lattes</strong> like Creme Brulee Latte, Kinder Bueno Latte, and Lotus Biscoff Latte.
            </p>
          </div>
        </section>
      </div>

      {/* Online Ordering Promotion Section */}
      <section className="section bg-white border-b border-stone-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 text-center lg:text-left">
                Order Online. <span className="text-primary">Eat Sooner.</span>
              </h2>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed text-center lg:text-left">
                Skip the wait and the extra fees - order directly through our website for the fastest service, the lowest prices, and our full menu selection.
              </p>
              <p className="text-lg text-stone-500 mb-8 text-center lg:text-left">
                Powered by FoodServe, our trusted partner for secure, real-time ordering.
              </p>

              {/* Benefits list */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <span className="text-lg text-stone-700 font-medium">Pickup & Delivery Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <span className="text-lg text-stone-700 font-medium">Real-Time Order Tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <span className="text-lg text-stone-700 font-medium">Full Menu Access</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <span className="text-lg text-stone-700 font-medium">Best Prices Guaranteed</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center lg:text-left">
                <a
                  href={FOODSERVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-xl"
                >
                  <ShoppingBag size={22} className="mr-3" />
                  Start Your Order
                </a>
              </div>
            </div>

            {/* Right side - Branded takeaway photo */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl relative aspect-[4/3]">
                <Image
                  src="/sweetlifetakeaway.webp"
                  alt="Sweet Life takeaway food in branded packaging"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Specialties Section */}
      <section className="section bg-stone-50">
        <div className="container">
          <h2 className="section-title text-center">Our Specialties</h2>
          <p className="section-subtitle text-center mx-auto mb-8">Discover our most loved dishes and drinks</p>

          <FeaturedCarousel />

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 px-4 sm:px-0 text-center">
            <Link
              href="/specialty-menu"
              className="btn btn-primary inline-flex items-center text-lg px-8 py-4 w-full sm:w-auto justify-center"
            >
              View Specialty Items
              <ArrowRight size={20} className="ml-3" />
            </Link>
            <Link
              href="/menu"
              className="btn btn-outline inline-flex items-center text-lg px-8 py-4 w-full sm:w-auto justify-center"
            >
              View Menu
              <ArrowRight size={20} className="ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-stone-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="section-title text-center lg:text-left">About Us</h2>
              <p className="mb-6 text-stone-700">
                Sweet Life is a unique South Korean-style cafe located in the heart of Newry. We offer creative and indulgent foods made fresh to order, bringing the authentic taste of Korean cuisine to Ireland.
              </p>
              <p className="mb-6 text-stone-700">
                Our mission is to create a warm, welcoming space where you can enjoy delicious food, refreshing drinks, and sweet treats in a cozy atmosphere.
              </p>
              <div className="text-center lg:text-left">
                <Link href="/about" className="btn btn-outline inline-flex items-center">
                  Learn More About Us
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl relative aspect-[4/3]">
              <Image
                src="/SLNEWRY.webp"
                alt="Sweet Life Cafe Interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Sushi Highlight */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-lg overflow-hidden shadow-xl relative aspect-[4/3]">
              <Image
                src="/SushiPlatter.webp"
                alt="Sushi Platter"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="section-title text-center lg:text-left">Sushi</h2>
              <p className="mb-4 text-stone-700">
                Experience our delicious selection of freshly made sushi, available for pre-order only to ensure the highest quality and freshness.
              </p>
              <p className="mb-6 text-stone-700">
                From classic rolls to creative special rolls, our sushi is prepared with premium ingredients and expert technique.
              </p>
              <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6">
                <p className="font-medium text-stone-800">
                  Please note: All sushi items are <span className="font-bold">Pre-Order Only</span>
                </p>
              </div>
              <div className="text-center lg:text-left">
                <Link href="/sushi" className="btn btn-primary inline-flex items-center">
                  View Sushi Menu
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Room Section */}
      <section className="section bg-stone-50">
        <div className="container">
          <h2 className="section-title text-center">Private Room for Parties & Events</h2>
          <p className="mb-6 text-stone-700 text-lg leading-relaxed">
            Celebrate birthdays, baby showers, or private events in our cozy upstairs room. Catering available.
          </p>
          <p className="mb-8 text-stone-600">
            Our intimate upstairs space provides the perfect setting for your special occasions. Whether it is a milestone birthday,
            baby shower, business meeting, or memorial gathering, we will help make your event memorable with delicious food and
            warm hospitality.
          </p>
          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-center justify-items-center">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
              <span className="text-stone-700">Accommodates up to 30 guests</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
              <span className="text-stone-700">Full catering menu available</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
              <span className="text-stone-700">Private, intimate atmosphere</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
              <span className="text-stone-700">Dedicated staff service</span>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/bookings"
              className="btn btn-primary inline-flex items-center text-lg px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl justify-center"
            >
              Book the Room
              <ArrowRight size={20} className="ml-3" />
            </Link>
          </div>
        </div>
        <div className="w-full mt-8">
          <div className="relative w-full" style={{ aspectRatio: '16/7', maxHeight: '400px' }}>
            <Image
              src="/private-room.webp"
              alt="Private event space upstairs at Sweet Life"
              fill
              sizes="100vw"
              className="object-cover object-center rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="section bg-stone-100">
        <div className="container">
          <h2 className="section-title text-center">Visit Us</h2>
          <p className="section-subtitle text-center mx-auto mb-8">We are conveniently located in the heart of Newry</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin size={20} className="text-primary mr-2" />
                Location
              </h3>
              <a
                href="https://maps.google.com/?q=12+Monaghan+St,+Newry+BT35+6AA"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4 text-stone-800 hover:text-primary transition-colors"
              >
                12 Monaghan St, Newry BT35 6AA
              </a>
              <div className="h-80 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2328.9160391331177!2d-6.340289684069388!3d54.17557798015985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4860e39752bb8bdb%3A0xe7da43be7a44acb9!2s12%20Monaghan%20St%2C%20Newry%20BT35%206AA%2C%20UK!5e0!3m2!1sen!2sie!4v1652354523691!5m2!1sen!2sie"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Sweet Life Ireland Location"
                ></iframe>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center text-center">
                <Clock size={20} className="text-primary mr-2" />
                Opening Hours
              </h3>
              <div className="space-y-3">
                <div className="bg-stone-50 px-4 py-3 rounded-lg border border-stone-200 text-center">
                  <p className="font-medium text-stone-700">Mon - Tue - Wed</p>
                  <p className="text-stone-600">8 am - 6 pm</p>
                </div>
                <div className="bg-stone-50 px-4 py-3 rounded-lg border border-stone-200 text-center">
                  <p className="font-medium text-stone-700">Thu - Fri</p>
                  <p className="text-stone-600">8 am - 8 pm</p>
                </div>
                <div className="bg-stone-50 px-4 py-3 rounded-lg border border-stone-200 text-center">
                  <p className="font-medium text-stone-700">Saturday</p>
                  <p className="text-stone-600">9 am - 6 pm</p>
                </div>
                <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-200 text-center">
                  <p className="font-medium text-red-700">Sunday</p>
                  <p className="text-red-600">Closed</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-center">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-center">
                  <Phone size={20} className="text-primary mr-3" />
                  <a
                    href="tel:+447716508513"
                    className="hover:text-primary transition-colors"
                  >
                    +447716508513
                  </a>
                </li>
                <li className="flex items-center justify-center">
                  <Mail size={20} className="text-primary mr-3" />
                  <a
                    href="mailto:info@sweetlifecafe.co.uk"
                    className="hover:text-primary transition-colors"
                  >
                    info@sweetlifecafe.co.uk
                  </a>
                </li>
                <li className="flex items-center justify-center">
                  <MessageCircle size={20} className="text-primary mr-3" />
                  <a
                    href="https://wa.me/447716508513"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>

              <div className="mt-8 text-center">
                <Link href="/contact" className="btn btn-outline inline-flex items-center">
                  Get in Touch
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
