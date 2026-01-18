export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Sweet Life Cafe",
    "image": "https://sweetlifecafe.co.uk/images/hero-bg.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "12 Monaghan Street",
      "addressLocality": "Newry",
      "addressRegion": "County Down",
      "postalCode": "BT35 6AA",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 54.1754,
      "longitude": -6.3398
    },
    "telephone": "+44 28 3044 8808",
    "url": "https://sweetlifecafe.co.uk",
    "email": "sweetlifenewry@gmail.com",
    "servesCuisine": ["Korean", "Cafe", "Sushi", "Desserts", "Bubble Tea"],
    "priceRange": "££",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "12:00",
        "closes": "17:00"
      }
    ],
    "menu": "https://sweetlifecafe.co.uk/menu",
    "acceptsReservations": "True",
    "hasMenu": {
      "@type": "Menu",
      "url": "https://sweetlifecafe.co.uk/menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Bingsu",
          "description": "Korean shaved ice desserts"
        },
        {
          "@type": "MenuSection",
          "name": "Bubble Tea",
          "description": "Fresh bubble tea with tapioca pearls"
        },
        {
          "@type": "MenuSection",
          "name": "Sushi",
          "description": "Fresh sushi platters available for pre-order"
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/sweetlifenewry",
      "https://www.instagram.com/sweetlifenewry"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
