import { Star, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createRating, fetchMyVehicles, type UserVehicle } from '../services/api';

type Props = {
  open: boolean;
  onClose: () => void;
  stationId: number;
  stationName: string;
  onSaved: () => Promise<void> | void;
};

export function RatingModal({ open, onClose, stationId, stationName, onSaved }: Props) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoadingVehicles(true);
    setError('');
    fetchMyVehicles()
      .then((items) => {
        setVehicles(items);
        setSelectedVehicleId(items[0]?.idvehiculo ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar tus vehículos'))
      .finally(() => setLoadingVehicles(false));
  }, [open]);

  const activeVehicleLabel = useMemo(() => {
    const vehicle = vehicles.find((item) => item.idvehiculo === selectedVehicleId) ?? vehicles[0];
    if (!vehicle) return 'Sin vehículo';
    return vehicle.alias || `${vehicle.marca?.nombre || 'Vehículo'} ${vehicle.modelo?.nombre || ''} ${vehicle.modelo?.anio || ''}`.trim();
  }, [vehicles, selectedVehicleId]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createRating({
        idgasolinera: stationId,
        idvehiculo: selectedVehicleId ?? undefined,
        puntuacion: rating,
        comentario: comment,
      });
      await onSaved();
      setComment('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <h3>Agregar puntuación</h3>
        <p className="subtitle"><strong>{activeVehicleLabel}</strong></p>
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((value) => (
              <button type="button" key={value} className={`star-button ${value <= rating ? 'active' : ''}`} onClick={() => setRating(value)}>
                <Star size={22} />
              </button>
            ))}
          </div>

          <label>
            <span>Vehículo asociado</span>
            <select className="input" value={selectedVehicleId ?? ''} onChange={(e) => setSelectedVehicleId(Number(e.target.value))} disabled={loadingVehicles || vehicles.length === 0}>
              {vehicles.length === 0 ? <option value="">Registra un vehículo primero</option> : vehicles.map((vehicle) => (
                <option key={vehicle.idvehiculo} value={vehicle.idvehiculo}>
                  {vehicle.alias || `${vehicle.marca?.nombre || ''} ${vehicle.modelo?.nombre || ''} ${vehicle.modelo?.anio || ''}`.trim()}
                </option>
              ))}
            </select>
          </label>

          <textarea
            className="textarea"
            placeholder={`Comparte tu experiencia en ${stationName}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
          />
          {error && <div className="error-box">{error}</div>}
          <button className="primary-button" type="submit" disabled={saving || loadingVehicles || vehicles.length === 0}>
            {saving ? 'Enviando...' : 'Enviar evaluación'}
          </button>
        </form>
      </div>
    </div>
  );
}
