import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { CenteredAuthLayout } from '../components/Layout';
import { loginUser } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ access: '', contrasena: '' });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.registered
    ? 'Cuenta creada correctamente, ahora inicia sesión.'
    : '';

  const resetTurnstile = () => {
    setTurnstileToken('');
    setTurnstileKey((prev) => prev + 1);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!turnstileToken) {
      setError('Completa la verificación de seguridad.');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({
        Username: form.access,
        Correo: form.access,
        Contrasena: form.contrasena,
        turnstileToken,
      });

      localStorage.setItem('mapscar_token', response?.token || '');
      localStorage.setItem('mapscar_user', JSON.stringify(response?.usuario || {}));

      if (Number(response?.usuario?.IDrol) === 1) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredAuthLayout title="Inicia sesión" subtitle="Accede a tu cuenta.">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Usuario o correo</span>
          <input
            className="input"
            value={form.access}
            onChange={(e) => setForm({ ...form, access: e.target.value })}
            required
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            className="input"
            type="password"
            value={form.contrasena}
            onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
            required
          />
        </label>

        {successMessage && (
          <div className="success-box">{successMessage}</div>
        )}

        <div className="turnstile-wrap">
          <Turnstile
            key={turnstileKey}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => resetTurnstile()}
            onError={() => resetTurnstile()}
          />
        </div>

        {error && <div className="error-box">{error}</div>}

        <button className="primary-button" type="submit" disabled={loading || !turnstileToken}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>
      </form>
    </CenteredAuthLayout>
  );
}