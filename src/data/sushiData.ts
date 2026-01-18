// Sushi ordering data for pre-order page

export interface SushiVariation {
  title: string;
  description: string;
}

export interface SushiSize {
  pieces: number;
  price: number;
  paymentLink: string;
}

export interface SushiImage {
  image: string;
  alt: string;
}

export interface SushiVideo {
  src: string;
  poster: string;
  alt: string;
}

export interface OpeningHoursDay {
  start: number;
  end: number;
}

export interface OpeningHours {
  monday: OpeningHoursDay;
  tuesday: OpeningHoursDay;
  wednesday: OpeningHoursDay;
  thursday: OpeningHoursDay;
  friday: OpeningHoursDay;
  saturday: OpeningHoursDay;
  sunday: OpeningHoursDay;
}

// Sushi pickup opening hours (different from cafe general hours)
export const SUSHI_OPENING_HOURS: OpeningHours = {
  monday: { start: 12, end: 18 },
  tuesday: { start: 12, end: 18 },
  wednesday: { start: 12, end: 18 },
  thursday: { start: 12, end: 18 },
  friday: { start: 12, end: 18 },
  saturday: { start: 12, end: 18 },
  sunday: { start: 12, end: 17 }, // 12:00 PM to 5:00 PM
};

export const sushiVariations: SushiVariation[] = [
  {
    title: 'Meat',
    description: 'Premium cuts of meat expertly prepared in traditional and fusion styles',
  },
  {
    title: 'Seafood',
    description: 'Fresh seafood selections featuring the finest cuts of fish',
  },
  {
    title: 'Vegan',
    description: 'Creative plant-based rolls with fresh, seasonal vegetables',
  },
  {
    title: 'Mix',
    description: 'A curated combination of our meat, seafood, and vegan specialties',
  },
];

export const sushiSizes: SushiSize[] = [
  {
    pieces: 8,
    price: 12,
    paymentLink: 'https://checkout.revolut.com/pay/4ca5203d-d386-44eb-b94a-8a44651ba40f',
  },
  {
    pieces: 16,
    price: 24,
    paymentLink: 'https://checkout.revolut.com/pay/d7cd157f-2657-4718-afb1-4438a40d78e6',
  },
  {
    pieces: 20,
    price: 30,
    paymentLink: 'https://checkout.revolut.com/pay/d4b7dea8-2d49-49b5-8307-ea143e9c11a7',
  },
  {
    pieces: 30,
    price: 40,
    paymentLink: 'https://checkout.revolut.com/pay/a3b3d2f9-c5f9-43ee-898d-03221947b9b5',
  },
  {
    pieces: 50,
    price: 70,
    paymentLink: 'https://checkout.revolut.com/pay/e9e7c634-81a3-45ad-abef-45e8f128a654',
  },
];

export const sushiImages: SushiImage[] = [
  { image: '/Sushi/Sushi1.jpg', alt: 'Fresh Sushi Platter 1' },
  { image: '/Sushi/Sushi2.jpg', alt: 'Fresh Sushi Platter 2' },
  { image: '/Sushi/Sushi3.jpg', alt: 'Fresh Sushi Platter 3' },
  { image: '/Sushi/Sushi4.jpg', alt: 'Fresh Sushi Platter 4' },
  { image: '/Sushi/Sushi5.jpg', alt: 'Fresh Sushi Platter 5' },
  { image: '/Sushi/Sushi6.jpg', alt: 'Fresh Sushi Platter 6' },
  { image: '/Sushi/Sushi7.jpg', alt: 'Fresh Sushi Platter 7' },
  { image: '/Sushi/Sushi8.jpg', alt: 'Fresh Sushi Platter 8' },
  { image: '/Sushi/Sushi9.jpg', alt: 'Fresh Sushi Platter 9' },
  { image: '/Sushi/Sushi10.jpg', alt: 'Fresh Sushi Platter 10' },
  { image: '/Sushi/Sushi11.jpg', alt: 'Fresh Sushi Platter 11' },
  { image: '/Sushi/Sushi12.jpg', alt: 'Fresh Sushi Platter 12' },
];

export const sushiVideos: SushiVideo[] = [
  {
    src: '/Sushi/SushiV1.mp4',
    poster: '/Sushi/Sushi1.jpg',
    alt: 'Sushi Making Process',
  },
];

// Helper function to get size by pieces
export function getSizeByPieces(pieces: number): SushiSize | undefined {
  return sushiSizes.find((size) => size.pieces === pieces);
}
