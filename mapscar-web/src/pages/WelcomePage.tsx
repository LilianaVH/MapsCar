import { Fuel, ShieldCheck, MapPinned, ArrowRight, Gauge, CarFront } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="site-header landing-header">
        <Link to="/" className="site-brand">
          <span className="brand-badge large"><Fuel size={38} /></span>
          <span>
            <strong>MapsCar</strong>
            <small>Colima</small>
          </span>
        </Link>

        <nav className="site-nav">
          <Link to="/login" className="site-nav-link">
            Iniciar sesión
          </Link>
          <Link to="/register" className="site-nav-link site-nav-link-accent">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main className="landing-hero">
        <section className="landing-copy">
          <h1>Encuentra y compara gasolineras de Colima según el rendimiento real de tu vehículo</h1>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => navigate('/register')}
            >
              Comenzar <ArrowRight size={18} />
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate('/login')}
            >
              Ir al login
            </button>
          </div>

          <div className="hero-features landing-feature-grid">
            <div className="feature-chip"><ShieldCheck size={16} /> Acceso</div>
            <div className="feature-chip"><MapPinned size={16} /> Mapa</div>
            <div className="feature-chip"><Gauge size={16} /> Comparación por rendimiento</div>
            <div className="feature-chip"><CarFront size={16} /> Vehículo</div>
          </div>
        </section>

        <section className="landing-preview">
          <div className="preview-shell">
            <div className="preview-sidebar">
              <strong>MapsCar</strong>
              <div className="preview-filter active">Cercanas</div>
              <div className="preview-filter">Mejor rendimiento</div>
              <div className="preview-filter">Mejor calificación</div>
              <div className="preview-card">
                <span className="preview-rating">★ 4.8</span>
                <strong>Combustibles del Valle</strong>
                <p>Blvd. Camino Real 456, Colima</p>
              </div>
            </div>
            <div className="preview-main">
              <div className="preview-search" />
              <div className="preview-map">
                <span className="preview-badge">Colima, México</span>
                <span className="preview-pin p1" />
                <span className="preview-pin p2" />
                <span className="preview-pin p3" />
                <span className="preview-pin p4" />
                <div className="preview-detail">
                  <strong>Gasolinera del Centro</strong>
                  <p>Av. Revolución 123, Centro, Colima</p>
                  <span>12.9 km/l · 128 reseñas</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}