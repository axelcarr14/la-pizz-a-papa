export const RESTAURANT_INFO = {
  name: 'La Pizz à Papa',
  address: '199 Boulevard de l\'Avenir, 18000 Bourges',
  phone: '07 63 65 53 26',
  email: 'lapizzapapa18@gmail.com',
  googleMapsUrl: 'https://maps.google.com/?q=La+Pizz+à+Papa+Bourges',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN3kLSBvF8UcRQ3rHRs9Zenc',
  facebook: 'https://www.facebook.com/p/La-pizz-%C3%A0-papa-100083038943480/',
  hours: [
    { day: 'Lundi', open: false },
    { day: 'Mardi', hours: '11h30 – 13h30 / 18h30 – 22h00' },
    { day: 'Mercredi', hours: '11h30 – 13h30 / 18h30 – 22h00' },
    { day: 'Jeudi', hours: '11h30 – 13h30 / 18h30 – 22h00' },
    { day: 'Vendredi', hours: '11h30 – 13h30 / 18h30 – 22h00' },
    { day: 'Samedi', hours: '18h30 – 22h30' },
    { day: 'Dimanche', hours: '18h30 – 22h30' },
  ],
}

export const SIZES = {
  papa: { label: 'Papa', diameter: '33 cm', price: 14.50 },
}

export const DELIVERY = {
  fee: 2.50,
  minOrder: 15.00,
}

export const MENU = [
  {
    id: 1,
    name: 'Margherita',
    description: 'Sauce tomate, mozzarella, basilic frais',
    category: 'classique',
    emoji: '🍅',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Margherita Jambon',
    description: 'Sauce tomate, mozzarella, jambon, basilic',
    category: 'classique',
    emoji: '🍖',
    image: 'https://images.unsplash.com/photo-1692737580563-7ba2d896f0f6?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 3,
    name: '5 Fromages',
    description: 'Mozzarella, gorgonzola, emmental, chèvre, parmesan',
    category: 'fromages',
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Calzone Papa',
    description: 'Pizza pliée, sauce tomate, mozzarella, jambon, champignons',
    category: 'speciale',
    emoji: '🌮',
    image: 'https://images.unsplash.com/photo-1753656681797-3234c89d6d4d?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'Deliciosa',
    description: 'Crème fraîche, mozzarella, poulet, poivrons, oignons',
    category: 'crème',
    emoji: '🍗',
    image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Reine',
    description: 'Sauce tomate, mozzarella, jambon, champignons',
    category: 'classique',
    emoji: '👑',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 7,
    name: 'Végétarienne',
    description: 'Sauce tomate, mozzarella, poivrons, courgettes, champignons, olives',
    category: 'veggie',
    emoji: '🥗',
    image: 'https://images.unsplash.com/photo-1617343251257-b5d709934ddd?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 8,
    name: 'Chorizo',
    description: 'Sauce tomate, mozzarella, chorizo, oignons, poivrons',
    category: 'classique',
    emoji: '🌶️',
    image: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 9,
    name: 'Saumon',
    description: 'Crème fraîche, mozzarella, saumon fumé, câpres, citron',
    category: 'crème',
    emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1750943082685-f9c1e15b3273?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 10,
    name: '4 Saisons',
    description: 'Sauce tomate, mozzarella, jambon, artichauts, champignons, olives noires',
    category: 'classique',
    emoji: '🍄',
    image: 'https://images.unsplash.com/photo-1722239315480-ef323559d3f7?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 11,
    name: 'Raclette',
    description: 'Crème fraîche, fromage à raclette, lardons, pommes de terre',
    category: 'speciale',
    emoji: '🫕',
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=400&q=80&fit=crop&auto=format',
  },
  {
    id: 12,
    name: 'Norvegia',
    description: 'Crème fraîche, mozzarella, saumon, épinards, aneth',
    category: 'crème',
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1750943082685-f9c1e15b3273?w=400&q=80&fit=crop&auto=format',
  },
]

export const CATEGORIES = [
  { id: 'tous', label: 'Toutes' },
  { id: 'classique', label: 'Classiques' },
  { id: 'crème', label: 'Crème' },
  { id: 'fromages', label: 'Fromages' },
  { id: 'speciale', label: 'Spéciales' },
  { id: 'veggie', label: 'Veggie' },
]

export const PICKUP_SLOTS = [
  '12h00', '12h15', '12h30', '12h45', '13h00', '13h15',
  '19h00', '19h15', '19h30', '19h45', '20h00', '20h15',
  '20h30', '20h45', '21h00', '21h15', '21h30',
]
