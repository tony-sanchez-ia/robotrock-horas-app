import { useState } from 'react';
import { api } from '../utils/api';
import { getInitials } from '../utils/helpers';
import Icon from './Icon';

export default function PinScreen({ employee, onSuccess, onBack }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const MAX = 4;
  const initials = getInitials(employee.name);

  async function handleDigit(d) {
    if (pin.length >= MAX) return;
    const next = pin + d;
    setPin(next);
    setError(false);

    if (next.length === MAX) {
      setTimeout(async () => {
        try {
          const result = await api.login(employee.id, next);
          if (result.success) {
            onSuccess();
          }
        } catch {
          setShake(true);
          setError(true);
          setTimeout(() => {
            setPin('');
            setShake(false);
          }, 600);
        }
      }, 150);
    }
  }

  function handleDel() {
    setPin(p => p.slice(0, -1));
    setError(false);
  }

  const dots = Array.from({ length: MAX }, (_, i) => i);
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <div className="screen">
      <div className="pin-container">
        {/* Back button */}
        <div className="pin-back">
          <button onClick={onBack}>
            <Icon name="back" size={18} color="var(--muted)" />
            Cambiar empleado
          </button>
        </div>

        {/* Avatar */}
        <div className="pin-avatar">{initials}</div>
        <div className="pin-name">{employee.name}</div>
        <div className="pin-subtitle">Introduce tu PIN</div>

        {/* PIN Dots */}
        <div className={`pin-dots ${shake ? 'shake' : ''}`}>
          {dots.map(i => (
            <div
              key={i}
              className={`pin-dot ${
                i < pin.length
                  ? error
                    ? 'pin-dot--error'
                    : 'pin-dot--filled'
                  : 'pin-dot--empty'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && <div className="pin-error">PIN incorrecto</div>}

        {/* Keypad */}
        <div className="pin-keypad">
          {keys.map((k, i) => {
            if (k === '') return <div key={i} className="pin-key--empty" />;
            const isDel = k === '⌫';
            return (
              <button
                key={i}
                className={`pin-key ${isDel ? 'pin-key--delete' : 'pin-key--digit'}`}
                onClick={() => (isDel ? handleDel() : handleDigit(k))}
              >
                {isDel ? <Icon name="back" size={20} color="var(--muted)" /> : k}
              </button>
            );
          })}
        </div>

        {/* TODO: Remove hint in production */}
        <div className="pin-hint">PIN de prueba — consulta al administrador</div>
      </div>
    </div>
  );
}
