export type Category = {
  label: string;
  slug: string;
  emoji: string;
  imageUrl?: string; // optional remote image (Google Photos/Maps)
  credit?: { author: string; authorUrl: string; photoUrl: string };
};

export const categories: Category[] = [
  {
    label: "Clothing",
    slug: "clothing",
    emoji: "👕",
    imageUrl: "https://source.unsplash.com/1200x900/?clothing,apparel,store",
    credit: { author: "Unsplash contributors", authorUrl: "https://unsplash.com/s/photos/clothing", photoUrl: "https://unsplash.com/s/photos/clothing" },
  },
  {
    label: "Luggage",
    slug: "luggage",
    emoji: "🧳",
    imageUrl: "https://source.unsplash.com/1200x900/?luggage,suitcase,travel",
    credit: { author: "Unsplash contributors", authorUrl: "https://unsplash.com/s/photos/luggage", photoUrl: "https://unsplash.com/s/photos/luggage" },
  },
  {
    label: "Bath & Linen",
    slug: "bath-linen",
    emoji: "🛁",
    imageUrl: "https://source.unsplash.com/1200x900/?bath,towels,linen",
    credit: { author: "Unsplash contributors", authorUrl: "https://unsplash.com/s/photos/towels", photoUrl: "https://unsplash.com/s/photos/towels" },
  },
  {
    label: "Household Appliances",
    slug: "household-appliances",
    emoji: "🧼",
    imageUrl: "https://source.unsplash.com/1200x900/?appliance,kitchen,home",
    credit: { author: "Unsplash contributors", authorUrl: "https://unsplash.com/s/photos/appliance", photoUrl: "https://unsplash.com/s/photos/appliance" },
  },
  {
    label: "Utensils",
    slug: "utensils",
    emoji: "🍳",
    imageUrl: "https://source.unsplash.com/1200x900/?utensils,cookware,kitchen",
    credit: { author: "Unsplash contributors", authorUrl: "https://unsplash.com/s/photos/utensils", photoUrl: "https://unsplash.com/s/photos/utensils" },
  },
  {
    label: "Bath Mats, Rugs & Carpets",
    slug: "bath-mats-rugs-carpets",
    emoji: "🧵",
    imageUrl: "https://source.unsplash.com/1200x900/?rug,carpet,mats",
    credit: { author: "Unsplash contributors", authorUrl: "https://unsplash.com/s/photos/carpet", photoUrl: "https://unsplash.com/s/photos/carpet" },
  },
];

// Photos sourced from Google Maps uploads (provided by user).
