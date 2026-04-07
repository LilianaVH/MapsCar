import { MapPin, MessageSquare, Star } from 'lucide-react';

type Station = {
  id: number;
  name: string;
  address: string;
  location: string;
  rating: number;
  comments: string[];
  estimatedPerformance: string;
  image: string;
};

export function GasStationDetail({ station, onRate }: { station: Station; onRate: () => void }) {
  return (
    <aside className="detail-panel">
      <img src={station.image} alt={station.name} className="detail-image" />
      <div className="detail-content">
        <div className="detail-head">
          <div>
            <h3>{station.name}</h3>
            <p>{station.address}</p>
          </div>
        </div>

        <div className="metric-row">
          <span><MapPin size={16} /> {station.location}</span>
          <span><Star size={16} /> {station.rating.toFixed(1)}</span>
        </div>

        <div className="info-card">
          <h4>Rendimiento</h4>
          <p>{station.estimatedPerformance}</p>
        </div>

        <div className="info-card">
          <h4>Comentarios</h4>
          <ul className="comment-list">
            {station.comments.map((comment) => (
              <li key={comment}><MessageSquare size={14} /> {comment}</li>
            ))}
          </ul>
        </div>

        <div className="detail-actions">
          <button className="primary-button" onClick={onRate}>Puntuar</button>
        </div>
      </div>
    </aside>
  );
}
