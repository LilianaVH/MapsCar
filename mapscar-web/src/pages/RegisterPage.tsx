import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { CenteredAuthLayout } from '../components/Layout';
import { registerUser } from '../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetTurnstile = () => {
    setTurnstileToken('');
    setTurnstileKey((prev) => prev + 1);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!turnstileToken) {
      setError('Completa la verificación de seguridad.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        Username: form.username,
        Nombre: form.nombre,
        Apellido_Paterno: form.apellidoPaterno,
        Apellido_Materno: form.apellidoMaterno,
        Correo: form.correo,
        Contrasena: form.contrasena,
        IDrol: 2,
        turnstileToken,
      });

      navigate('/login', {
        state: { registered: true },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredAuthLayout title="Crear cuenta" subtitle="Registro de usuario.">
      <form className="form-grid two-columns" onSubmit={handleSubmit}>
        <label><span>Username</span><input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label>
        <label><span>Nombre</span><input className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
        <label><span>Apellido paterno</span><input className="input" value={form.apellidoPaterno} onChange={(e) => setForm({ ...form, apellidoPaterno: e.target.value })} required /></label>
        <label><span>Apellido materno</span><input className="input" value={form.apellidoMaterno} onChange={(e) => setForm({ ...form, apellidoMaterno: e.target.value })} required /></label>
        <label className="full-width"><span>Correo</span><input className="input" type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required /></label>
        <label><span>Contraseña</span><input className="input" type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} required /></label>
        <label><span>Confirmar contraseña</span><input className="input" type="password" value={form.confirmarContrasena} onChange={(e) => setForm({ ...form, confirmarContrasena: e.target.value })} required /></label>

        <div className="full-width turnstile-wrap">
          <Turnstile
            key={turnstileKey}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => resetTurnstile()}
            onError={() => resetTurnstile()}
          />
        </div>

        {error && <div className="error-box full-width">{error}</div>}

        <button className="primary-button full-width" type="submit" disabled={loading || !turnstileToken}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </CenteredAuthLayout>
  );
}