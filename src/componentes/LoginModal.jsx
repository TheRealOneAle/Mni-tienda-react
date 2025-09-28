import React, { useState } from 'react';

export default function LoginModal({ onVerificar, onCerrar }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerificar(password);
    setPassword('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--color-fondo)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px var(--color-sombra)',
        minWidth: '300px'
      }}>
        <h2 style={{ color: 'var(--color-primario)', marginBottom: '1rem' }}>Acceso Admin</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid var(--color-borde)',
                borderRadius: '6px',
                marginTop: '0.5rem',
                background: 'var(--color-fondo)',
                color: 'var(--color-texto)'
              }}
              required
            />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCerrar}
              style={{
                background: 'var(--color-borde)',
                color: 'var(--color-texto)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                background: 'var(--color-boton)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Acceder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}