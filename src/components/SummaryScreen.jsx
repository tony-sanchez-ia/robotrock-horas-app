import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { fmt, monthLabel, thisMonth } from '../utils/helpers';
import Icon from './Icon';

const turnoIcons = { mañana: 'sun', tarde: 'star', noche: 'moon' };

export default function SummaryScreen({ employee }) {
  const [month, setMonth] = useState(thisMonth());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSummary(employee.id, month)
      .then(setSummary)
      .catch(err => console.error('Error loading summary:', err))
      .finally(() => setLoading(false));
  }, [employee.id, month]);

  if (loading || !summary) {
    return (
      <div className="screen">
        <div className="summary-header">
          <div>
            <div className="screen-header__subtitle">Resumen</div>
            <h2 className="screen-header__title">{employee.name.split(' ')[0]}</h2>
          </div>
        </div>
        <div className="scroll-area">
          <div style={{ height: 20 }} />
          <div className="empty-state">Cargando...</div>
        </div>
      </div>
    );
  }

  const { totalHoras, totalEuros, totalGastos, horasByTurno, hours, expenses, availableMonths } = summary;

  return (
    <div className="screen">
      {/* Header */}
      <div className="summary-header">
        <div>
          <div className="screen-header__subtitle">Resumen</div>
          <h2 className="screen-header__title">{employee.name.split(' ')[0]}</h2>
        </div>
        <select
          className="month-select"
          value={month}
          onChange={e => setMonth(e.target.value)}
        >
          {availableMonths.map(m => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
      </div>

      <div className="scroll-area">
        <div style={{ height: 20 }} />

        {/* Hero cards */}
        <div className="hero-grid">
          <div className="hero-card hero-card--hours">
            <div className="hero-card__label">Horas totales</div>
            <div className="hero-card__value hero-card__value--large">
              {totalHoras}
              <span className="hero-card__unit">h</span>
            </div>
          </div>
          <div className="hero-card hero-card--earnings">
            <div className="hero-card__label">A cobrar</div>
            <div className="hero-card__value hero-card__value--medium">
              {totalEuros.toFixed(2)}
              <span className="hero-card__unit--small">€</span>
            </div>
          </div>
        </div>

        {/* Breakdown by shift */}
        <div className="card">
          <div className="card__title">Por turno</div>
          {['mañana', 'tarde', 'noche'].map(turno => (
            <div key={turno} className="turno-row">
              <div className="turno-icon">
                <Icon name={turnoIcons[turno]} size={15} color="var(--muted)" />
              </div>
              <div className="turno-info">
                <div className="turno-header">
                  <span className="turno-name">{turno}</span>
                  <span className="turno-hours">{horasByTurno[turno]}h</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{
                      width: totalHoras > 0 ? `${(horasByTurno[turno] / totalHoras) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expenses card */}
        <div className="card">
          <div className="expenses-header">
            <div className="card__title" style={{ marginBottom: 0 }}>Gastos</div>
            <div className="expenses-total">{totalGastos.toFixed(2)} €</div>
          </div>
          {expenses.length === 0 ? (
            <div className="empty-state">Sin gastos este mes</div>
          ) : (
            expenses.map(e => (
              <div key={e.id} className="entry-item">
                <div className="entry-icon">
                  <Icon name={e.tipo === 'comida' ? 'food' : 'fuel'} size={14} color="var(--muted)" />
                </div>
                <div className="entry-info">
                  <div className="entry-title">{e.concepto || e.tipo}</div>
                  <div className="entry-meta">{fmt(e.fecha)} · {e.tipo}</div>
                </div>
                <div className="entry-amount entry-amount--danger">-{e.importe.toFixed(2)} €</div>
              </div>
            ))
          )}
        </div>

        {/* Hours history */}
        {hours.length > 0 && (
          <div className="card">
            <div className="card__title">Registros de horas</div>
            {hours.map(h => (
              <div key={h.id} className="entry-item">
                <div className="entry-icon">
                  <Icon name={turnoIcons[h.turno]} size={14} color="var(--muted)" />
                </div>
                <div className="entry-info">
                  <div className="entry-title">{h.concepto || h.turno}</div>
                  <div className="entry-meta">{fmt(h.fecha)} · {h.turno}</div>
                </div>
                <div className="entry-amount entry-amount--accent">{h.horas}h</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
