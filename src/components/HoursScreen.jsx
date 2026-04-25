import { useState } from 'react';
import { api } from '../utils/api';
import { today, HOUR_RATE } from '../utils/helpers';
import Icon from './Icon';

const turnos = [
  { id: 'mañana', label: 'Mañana', icon: 'sun' },
  { id: 'tarde', label: 'Tarde', icon: 'star' },
  { id: 'noche', label: 'Noche', icon: 'moon' },
];

export default function HoursScreen({ employee }) {
  const [turno, setTurno] = useState('mañana');
  const [horas, setHoras] = useState('');
  const [concepto, setConcepto] = useState('');
  const [fecha, setFecha] = useState(today());
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!horas || parseFloat(horas) <= 0) return;

    try {
      await api.createHour({
        employeeId: employee.id,
        fecha,
        turno,
        horas: parseFloat(horas),
        concepto,
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setHoras('');
        setConcepto('');
      }, 1500);
    } catch (err) {
      console.error('Error saving hours:', err);
    }
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-header__subtitle">Registrar</div>
        <h2 className="screen-header__title">Horas trabajadas</h2>
      </div>

      <div className="scroll-area">
        <div style={{ height: 20 }} />

        {/* Turno */}
        <label className="form-label">Turno</label>
        <div className="segment-group" style={{ marginBottom: 20 }}>
          {turnos.map(t => (
            <button
              key={t.id}
              className={`segment-btn ${turno === t.id ? 'segment-btn--active' : 'segment-btn--inactive'}`}
              onClick={() => setTurno(t.id)}
            >
              <Icon name={t.icon} size={16} color={turno === t.id ? '#fff' : 'var(--muted)'} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Fecha */}
        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-input"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
        </div>

        {/* Horas */}
        <div className="form-group">
          <label className="form-label">Número de horas</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input"
              min="0.5"
              max="16"
              step="0.5"
              placeholder="Ej: 4"
              value={horas}
              onChange={e => setHoras(e.target.value)}
            />
            <span className="input-unit">h</span>
          </div>
        </div>

        {/* Concepto */}
        <div className="form-group" style={{ marginBottom: 28 }}>
          <label className="form-label">Concepto (opcional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Montaje escenario, Prueba sonido..."
            value={concepto}
            onChange={e => setConcepto(e.target.value)}
          />
        </div>

        {/* Preview */}
        {horas && parseFloat(horas) > 0 && (
          <div className="value-preview fade-in">
            <div className="value-preview__label">Valor estimado</div>
            <div className="value-preview__amount">
              +{(parseFloat(horas) * HOUR_RATE).toFixed(2)} €
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          className={`btn-primary ${saved ? 'btn-primary--saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Icon name="check" size={18} color="#fff" />
              Guardado
            </>
          ) : (
            'Guardar horas'
          )}
        </button>
      </div>
    </div>
  );
}
