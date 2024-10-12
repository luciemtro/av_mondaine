// types/order.types.ts
export type Order = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_fee: number;
  event_date: string;
  event_hour: string;
  created_at: string;
  artists: string; // Artistes associés sous forme de chaîne de caractères (GROUP_CONCAT)
  event_address: string;
  event_city: string;
  event_postal_code: string;
  event_country: string;
  number_of_people: number;
  service_type: string;
  budget: number;
  comment: string;
  artist: string; // Chaîne de noms d'artistes concaténée
  artist_pictures: string; // Chaîne d'URLs des photos concaténées
};
