/**
 * Yaari Social Cafe - Site Configuration & Details
 * Verified from Instagram metadata and project specification
 */

export const site = {
  cafeName: "Yaari Social",
  tagline: "A little coffee. A lot of yaari.",
  description: "Your cozy corner for coffee, comfort food, conversations and late-evening yaari in Silvassa.",
  
  // Real location verified from Instagram dataset captions
  location: {
    address: "Near Lions College (Opp. Sai Nidhi Dosa), SSR Road",
    city: "Silvassa",
    pincode: "396230",
    state: "Dadra and Nagar Haveli",
    landmark: "Opposite Sai Nidhi Dosa",
    googleMapsUrl: "https://maps.google.com/?q=Yaari+Social+Silvassa"
  },
  
  social: {
    instagram: "https://www.instagram.com/yaari_social/",
    handle: "@yaari_social"
  },
  
  hours: [
    { days: "Monday – Friday", time: "11:00 AM – 11:00 PM" },
    { days: "Saturday – Sunday", time: "10:30 AM – 11:30 PM" }
  ],
  
  amenities: [
    "Cozy Monsoon Backyard Setup",
    "Live Acoustic & Jamming Nights",
    "Outdoor & Indoor Seating",
    "Curated Music & Vibe",
    "Fresh Artisan Coffee & Bites",
    "Birthday & Gathering Celebrations"
  ],

  navLinks: [
    { name: "Home", href: "#hero" },
    { name: "Vibe", href: "#vibe" },
    { name: "Jamming", href: "#jamming" },
    { name: "Reels", href: "#reels" },
    { name: "Menu", href: "#menu" },
    { name: "Moments", href: "#moments" },
    { name: "About", href: "#about" },
    { name: "Visit", href: "#visit" }
  ]
};
