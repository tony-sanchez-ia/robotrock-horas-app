import { useState } from 'react';
import { api } from '../utils/api';
import { today } from '../utils/helpers';
import Icon from './Icon';

const tipos = [
  { id: 'comida', label: 'Comida', icon: 'food' },
  { id: 'combustible', label: 'Combustible', icon: 'fuel' },
];

export default function ExpensesScreen({ employee }) {
  const [tipo, setTipo] = useState('comida');
  const [fecha, setFecha] = useState(today());
  const [importe, setImporte] = useState('');
  const [concepto, setConcepto] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!importe || parseFloat(importe) <= 0) return;

    try {
      await api.createExpense({
        employeeId: employee.id,
        fecha,
        tipo,
        importe: parseFloat(importe),
        concepto,
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setImporte('');
        setConcepto('');
      }, 1500);
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-header__subtitle">Registrar</div>
        <h2 className="screen-header__title">Gasto</h2>
      </div>

      <div className="scroll-area">
        <div style={{ height: 20 }} />

        {/* Tipo */}
        <label className="form-label">Tipo de gasto</label>
        <div className="segment-group" style={{ marginBottom: 20 }}>
          {tipos.map(t => (
            <button
              key={t.id}
              className={`segment-btn ${tipo === t.id ? 'segment-btn--active' : 'segment-btn--inactive'}`}
              onClick={() => setTipo(t.id)}
            >
              <Icon name={t.icon} size={16} color={tipo === t.id ? '#fff' : 'var(--muted)'} />
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

        {/* Importe */}
        <div className="form-group">
          <label className="form-label">Importe</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="form-input"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={importe}
              onChange={e => setImporte(e.target.value)}
            />
            <span className="input-unit input-unit--large">€</span>
          </div>
        </div>

        {/* Concepto */}
        <div className="form-group" style={{ marginBottom: 28 }}>
          <label className="form-label">Concepto (opcional)</label>
          <input
            type="text"
            className="form-input"
            placeholder={tipo === 'comida' ? 'Ej: Menú del día, bocadillos...' : 'Ej: Gasofa camión, AP7...'}
            value={concepto}
            onChange={e => setConcepto(e.target.value)}
          />
        </div>

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
            'Guardar gasto'
          )}
        </button>
      </div>
    </div>
  );
}
