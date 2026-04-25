import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getInitials } from '../utils/helpers';
import Icon from './Icon';

export default function LoginScreen({ onLogin }) {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEmployees()
      .then(setEmployees)
      .catch(err => console.error('Error loading employees:', err))
      .finally(() => setLoading(false));
  }, []);

  function handleContinue() {
    if (selected) {
      onLogin(selected);
    }
  }

  return (
    <div className="screen">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <img
            src="/robot-rock-plano.jpg"
            alt="Robot Rock Alive"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="login-logo__fallback" style={{ display: 'none' }}>
            RRA
          </div>
        </div>

        {/* Greeting */}
        <div className="login-greeting">
          <h1>
            Hola,<br />
            <span className="accent">¿quién eres?</span>
          </h1>
        </div>

        {/* Employee list */}
        <div className="employee-list">
          {loading ? (
            <div className="empty-state">Cargando empleados...</div>
          ) : (
            employees.map((emp) => {
              const isSelected = selected?.id === emp.id;
              return (
                <button
                  key={emp.id}
                  className={`employee-card ${isSelected ? 'employee-card--selected' : ''}`}
                  onClick={() => setSelected(isSelected ? null : emp)}
                >
                  <div className="employee-card__avatar">
                    {getInitials(emp.name)}
                  </div>
                  <span className="employee-card__name">{emp.name}</span>
                  {isSelected && <Icon name="check" size={18} color="var(--accent)" />}
                </button>
              );
            })
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Continue button */}
        <button
          className={`btn-primary ${!selected ? 'btn-primary--disabled' : ''}`}
          onClick={handleContinue}
          style={{ marginTop: 24 }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
