'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const bestReviews = [
  {
    author_name: "Louise Loade",
    text: "Hands down the best lunch we've had in a long time! The menu has something for everyone. Everything was fresh, homemade, and absolutely delicious. We shared the homemade sourdough pizza, beetroot Belgian waffles with chicken, and a bibimbap bowl with chicken—each dish was packed with flavour and beautifully presented. The Dubai chocolate was unreal. To top it off, they surprised us with complimentary homemade ice cream, which was just as impressive. Smooth, creamy, and the perfect finish. We can't recommend this place highly enough. Exceptional food, warm hospitality, and real attention to detail. We'll definitely be back!"
  },
  {
    author_name: "Rita Savickaite",
    text: "The bingsu is absolutely amazing, it's the only place in Ireland and UK that serves this dessert from Korea. It's so delicious and refreshing, it's so beautiful seeing it made in front of you. The portions are so massive and there are so many toppings. It's a must try"
  },
  {
    author_name: "Ciara Tillyer",
    text: "Fantastic food and lovely staff. There is so much variety here. I cannot get enough of the Poke Bowls - they are just fabulous. Their fruit teas are so refreshing also. 10/10 would recommend!!"
  },
  {
    author_name: "Mark Murray",
    text: "Sweet Life is hands down one of the best cafés in town. The menu is surprisingly diverse, with everything from hearty breakfasts to sushi and even Korean bingsu! The food is fresh, well presented, and full of flavour. The drinks are just as impressive great coffee, refreshing fruit teas, and some unique lattes you won't find anywhere else. The atmosphere is cozy, and the staff are always friendly and welcoming."
  },
  {
    author_name: "Megan Clarke",
    text: "Food is delicious and tasty. Not the usual chips and burgers that you see about the town. Lovely soufflé pancakes and poke bowls."
  },
  {
    author_name: "Ke Lin",
    text: "Really nice newly open cafe. They have wide selection of food and drinks. I went for a very unique item, Eispanner. It's americano with cream cheese on top. Very yummy! Nice indoor deco and lighting as well. There are lots of other food I would love to give it a try next time. Staff extremely friendly"
  },
  {
    author_name: "Diane Kinney",
    text: "I got the poke bowl and it was beautiful, very accomodating with swapping out seamie oil for a different dressing."
  },
  {
    author_name: "Jordan Havern",
    text: "Amazing food, alot of variety with something new to try. Service was very good and served with a smile. Portions are very good. I will be back."
  },
  {
    author_name: "Jim McGrath",
    text: "Lovely staff, very friendly. Food is tasty and fresh. Decor, relaxed and tasteful."
  },
  {
    author_name: "Laura Rafferty",
    text: "129/10 soooooooooo good fills you up very fast please support this fantastic place 123% recommend boba was so nice."
  },
  {
    author_name: "Michael Kelly",
    text: "An absolute gem of a place. Food is fresh and fabulous. Service was perfection. Spotlessly clean."
  },
  {
    author_name: "Millenia Carr",
    text: "The nicest Poke bowl I've ever had and the spinach cake is amazing."
  }
];

const MAX_REVIEW_LENGTH = 150;

const GoogleReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // SSR-safe isMobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % bestReviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoScrolling]);

  const handlePause = () => setIsAutoScrolling(false);
  const handleResume = () => setIsAutoScrolling(true);

  const handleReadMore = (idx: number) => setExpanded(idx);
  const handleReadLess = () => setExpanded(null);

  // Carousel logic: show 3 at a time on desktop, 1 on mobile
  const itemsPerView = isMobile ? 1 : 3;
  const visibleReviews = [];
  for (let i = 0; i < itemsPerView; i++) {
    visibleReviews.push(bestReviews[(currentIndex + i) % bestReviews.length]);
  }

  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle warm accent in corner */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-warm-cream/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-3 block">
            Customer Reviews
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-4">
            What Our Guests Say
          </h2>
          <p className="text-rich-brown/70 max-w-xl mx-auto">
            Real 5-star reviews from our valued customers
          </p>
        </div>
        <div className="relative">
          <div
            className="flex justify-center items-center gap-4 md:gap-6"
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onFocus={handlePause}
            onBlur={handleResume}
          >
            <motion.button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + bestReviews.length) % bestReviews.length)}
              className="p-3 rounded-full bg-white shadow-lg transition-colors duration-300 hover:bg-primary hover:text-white border border-warm-stone/20"
              aria-label="Previous review"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <div className={`grid gap-6 w-full max-w-5xl ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              {visibleReviews.map((review, idx) => {
                const isTruncated = review.text.length > MAX_REVIEW_LENGTH && expanded !== idx;
                const displayText = isTruncated ? review.text.slice(0, MAX_REVIEW_LENGTH) + '...' : review.text;
                const isExpanded = expanded === idx;
                return (
                  <motion.div
                    key={idx}
                    className={`bg-white p-8 rounded-2xl shadow-xl flex flex-col border-0 ${
                      isMobile
                        ? isExpanded
                          ? 'min-h-[420px]'
                          : 'min-h-[300px] max-h-[300px]'
                        : isExpanded
                          ? 'min-h-[380px]'
                          : 'min-h-[300px]'
                    } transition-all duration-300 overflow-hidden relative`}
                    whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(247, 157, 40, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1)' }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    {/* Large decorative quote mark - more prominent */}
                    <div className="absolute -top-2 left-6 text-primary/20 font-display text-[120px] leading-none select-none pointer-events-none">
                      "
                    </div>

                    <div className="flex flex-col w-full h-full relative z-10">
                      {/* Stars at top - larger */}
                      <div className="flex items-center justify-center gap-1 mb-5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={22} className="text-primary fill-primary" />
                        ))}
                      </div>

                      {/* Review text content */}
                      <div className="flex-1 overflow-hidden mb-5">
                        <p className={`text-charcoal/80 text-[15px] leading-relaxed ${
                          isMobile && !isExpanded ? 'line-clamp-5' : ''
                        }`}>
                          <span className="italic">{displayText}</span>
                          {isTruncated && (
                            <button
                              className="text-primary font-semibold ml-1 underline hover:text-primary/80 transition-colors not-italic"
                              onClick={() => handleReadMore(idx)}
                            >
                              Read More
                            </button>
                          )}
                          {isExpanded && review.text.length > MAX_REVIEW_LENGTH && (
                            <>
                              <span className="italic">{review.text.slice(MAX_REVIEW_LENGTH)}</span>
                              <button
                                className="text-primary font-semibold ml-1 underline hover:text-primary/80 transition-colors not-italic"
                                onClick={handleReadLess}
                              >
                                Show Less
                              </button>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Author name at bottom - enhanced */}
                      <div className="pt-5 border-t border-warm-stone/20 mt-auto flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">{review.author_name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-charcoal font-bold text-sm">{review.author_name}</p>
                          <p className="text-charcoal/50 text-xs">Google Review</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % bestReviews.length)}
              className="p-3 rounded-full bg-white shadow-lg transition-colors duration-300 hover:bg-primary hover:text-white border border-warm-stone/20"
              aria-label="Next review"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
