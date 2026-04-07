import { prisma } from "../prisma.js";

function toNumber(value) {
  return value == null ? null : Number(value);
}

function formatStation(baseStation, reviews = []) {
  const valid = reviews.filter((item) => typeof item.puntuacion === "number");
  const average = valid.length ? valid.reduce((acc, item) => acc + item.puntuacion, 0) / valid.length : 0;
  const latestComments = reviews
    .filter((item) => item.comentario)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 3)
    .map((item) => item.comentario);

  return {
    id: baseStation.idgasolinera,
    idgasolinera: baseStation.idgasolinera,
    name: baseStation.nombre,
    nombre: baseStation.nombre,
    image: baseStation.imagen || null,
    imagen: baseStation.imagen || null,
    address: baseStation.domicilio || "Sin domicilio registrado",
    domicilio: baseStation.domicilio || "Sin domicilio registrado",
    lat: toNumber(baseStation.latitud),
    lng: toNumber(baseStation.longitud),
    latitud: toNumber(baseStation.latitud),
    longitud: toNumber(baseStation.longitud),
    estado: baseStation.estado?.nombre || null,
    municipio: baseStation.municipio?.nombre || null,
    rating: Number(average.toFixed(1)),
    reviewCount: reviews.length,
    comments: latestComments,
    estimatedPerformance: valid.length
      ? `${(13 + average / 2).toFixed(1)} km/L promedio reportado`
      : "Sin evaluaciones todavía",
    location: [toNumber(baseStation.latitud), toNumber(baseStation.longitud)].every((value) => value != null)
      ? `${toNumber(baseStation.latitud)}, ${toNumber(baseStation.longitud)}`
      : "Ubicación pendiente",
  };
}

export async function listStations() {
  const stations = await prisma.gasolinera.findMany({
    include: {
      estado: true,
      municipio: true,
      puntuaciones: {
        where: { estatus: 1 },
        select: {
          puntuacion: true,
          comentario: true,
          fecha: true,
        },
      },
    },
    orderBy: { nombre: "asc" },
  });

  return stations.map((station) => formatStation(station, station.puntuaciones));
}

export async function getStationById(id) {
  const station = await prisma.gasolinera.findUnique({
    where: { idgasolinera: Number(id) },
    include: {
      estado: true,
      municipio: true,
      puntuaciones: {
        where: { estatus: 1 },
        select: {
          puntuacion: true,
          comentario: true,
          fecha: true,
        },
      },
    },
  });

  if (!station) return null;
  return formatStation(station, station.puntuaciones);
}
