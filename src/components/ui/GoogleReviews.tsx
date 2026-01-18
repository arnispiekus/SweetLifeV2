'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section className="section bg-stone-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle mx-auto">
            Real 5-star reviews from our valued customers
          </p>
        </div>
        <div className="relative">
          <div
            className="flex justify-center items-center gap-6"
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onFocus={handlePause}
            onBlur={handleResume}
          >
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + bestReviews.length) % bestReviews.length)}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary hover:text-white"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} />
            </button>
            <div className={`grid gap-6 w-full max-w-5xl ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              {visibleReviews.map((review, idx) => {
                const isTruncated = review.text.length > MAX_REVIEW_LENGTH && expanded !== idx;
                const displayText = isTruncated ? review.text.slice(0, MAX_REVIEW_LENGTH) + '...' : review.text;
                const isExpanded = expanded === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white p-6 rounded-lg shadow-md flex flex-col ${
                      isMobile
                        ? isExpanded
                          ? 'min-h-[400px]'
                          : 'min-h-[300px] max-h-[300px]'
                        : isExpanded
                          ? 'min-h-[400px]'
                          : 'aspect-[4/3]'
                    } transition-all duration-300 overflow-hidden`}
                  >
                    <div className="flex flex-col items-center w-full h-full">
                      {/* Header with stars and author */}
                      <div className="flex flex-col items-center w-full mb-4">
                        <div className="flex items-center mb-2 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-primary font-semibold text-sm text-center">{review.author_name}</p>
                      </div>

                      {/* Review text content */}
                      <div className="flex-1 w-full overflow-hidden">
                        <div className={`text-stone-700 text-sm text-center leading-relaxed ${
                          isMobile && !isExpanded ? 'line-clamp-6' : ''
                        }`}>
                          {displayText}
                          {isTruncated && (
                            <button
                              className="text-primary font-semibold ml-1 underline hover:text-primary/80 transition-colors"
                              onClick={() => handleReadMore(idx)}
                            >
                              Read More
                            </button>
                          )}
                          {isExpanded && review.text.length > MAX_REVIEW_LENGTH && (
                            <>
                              <span>{review.text.slice(MAX_REVIEW_LENGTH)}</span>
                              <button
                                className="text-primary font-semibold ml-1 underline hover:text-primary/80 transition-colors"
                                onClick={handleReadLess}
                              >
                                Show Less
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % bestReviews.length)}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-primary hover:text-white"
              aria-label="Next review"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
