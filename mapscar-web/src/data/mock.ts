export const vehicleTypes = [
  { id: 'sedan', label: 'Sedán', icon: 'car' },
  { id: 'suv', label: 'SUV', icon: 'car' },
  { id: 'pickup', label: 'Pickup', icon: 'truck' },
  { id: 'motorcycle', label: 'Motocicleta', icon: 'bike' },
];

export const brands = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Ford', 'Chevrolet', 'Volkswagen', 'Kia'];
export const years = Array.from({ length: 30 }, (_, i) => String(2026 - i));
export const colors = ['Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Plata', 'Verde'];

export type GasStation = {
  id: number;
  idgasolinera: number;
  name: string;
  nombre: string;
  address: string;
  domicilio: string;
  location: string;
  rating: number;
  reviewCount: number;
  comments: string[];
  estimatedPerformance: string;
  image: string | null;
  lat: number | null;
  lng: number | null;
  latitud: number | null;
  longitud: number | null;
  estado?: string | null;
  municipio?: string | null;
};
