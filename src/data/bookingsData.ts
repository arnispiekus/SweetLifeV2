import { Cake, BookOpen, Briefcase, LucideIcon } from 'lucide-react';

export interface EventType {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface IncludedItem {
  text: string;
}

export interface BookingStep {
  title: string;
  description: string;
}

export const eventTypes: EventType[] = [
  {
    title: 'Celebrations',
    description: 'Birthday parties, anniversaries, graduation celebrations, and other special occasions',
    icon: Cake,
  },
  {
    title: 'Memorial Gatherings',
    description: 'Respectful and comforting spaces for funeral receptions and memorial gatherings',
    icon: BookOpen,
  },
  {
    title: 'Business Meetings',
    description: 'Professional environment for team meetings, presentations, and client engagements',
    icon: Briefcase,
  },
];

export const includedItems: IncludedItem[] = [
  { text: 'Exclusive use of our upstairs space for your event' },
  { text: 'Catering from our menu, customized to your preferences' },
  { text: 'Table settings and basic decorations' },
  { text: 'Dedicated staff to serve food and drinks' },
  { text: 'Setup and cleanup' },
  { text: 'Wi-Fi access and basic audio equipment' },
];

export const bookingSteps: BookingStep[] = [
  {
    title: 'Check availability',
    description: 'Contact us by phone or WhatsApp to check if your preferred date and time is available.',
  },
  {
    title: 'Discuss your requirements',
    description: 'Let us know about your event, expected number of guests, and any special requirements.',
  },
  {
    title: 'Menu selection',
    description: 'Choose from our catering options or work with us to create a custom menu.',
  },
  {
    title: 'Confirm booking',
    description: 'Pay a deposit to secure your booking.',
  },
  {
    title: 'Final details',
    description: 'Confirm final guest count and details at least one week before your event.',
  },
];

export const venueInfo = {
  capacity: 30,
  description: `Our upstairs space at Sweet Life is available for private bookings, providing the perfect venue for your special events. Whether you're planning a birthday celebration, a business meeting, or a memorial gathering, we offer a warm, welcoming environment with delicious catering included.`,
  details: `The space can accommodate up to 30 guests and features comfortable seating, ambient lighting, and a private atmosphere away from our main café area. All bookings include catering from our menu, which can be customized to suit your event and preferences.`,
};

export const cateringInfo = {
  description: `We offer a full catering menu for your private events, with delicious options to suit every taste and occasion. Let us help make your gathering memorable with fresh, beautifully presented food and exceptional service.`,
};
