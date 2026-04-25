import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function AdminScreen() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState('employees'); // employees | expenses
  
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  const [resetFocusId, setResetFocusId] = useState(null);
  const [newPin, setNewPin] = useState('');

  const fetchEmployees = async (pass) => {
    try {
      const res = await fetch(`/api/admin/employees`, {
        headers: { 'x-admin-password': pass }
      });
      if (!res.ok) throw new Error('Contraseña incorrecta o error de servidor');
      const data = await res.json();
      setEmployees(data);
      setAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAuthenticated(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`/api/admin/expenses`, {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      if (res.ok) setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      if (tab === 'employees') fetchEmployees(password);
      if (tab === 'expenses') fetchExpenses();
    }
  }, [authenticated, tab]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchEmployees(password);
  };

  const handleResetPin = async (id) => {
    if (newPin.length !== 4) return alert('El PIN debe tener 4 dígitos');
    try {
      const res = await fetch(`/api/admin/employees/${id}/pin`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ newPin })
      });
      if (res.ok) {
        alert('PIN modificado con éxito');
        setResetFocusId(null);
        setNewPin('');
      } else {
        alert('Error al modificar PIN');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!authenticated) {
    return (
      <div className="login-screen">
        <h2 style={{ marginBottom: '2rem', fontSize: '1.25rem', color: '#888' }}>🛡️ ACCESO ADMINISTRADOR</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
          <input 
            type="password"
            className="input"
            placeholder="Contraseña Maestra..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="button button-primary">ENTRAR</button>
          {error && <p style={{ color: 'var(--red)', fontSize: '0.875rem' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="screen" style={{ backgroundColor: '#111', color: '#fff', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ padding: '2rem', backgroundColor: '#000', borderBottom: '1px solid #333', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary)' }}>Admin Pannel</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setTab('employees')} 
            className={`button ${tab === 'employees' ? 'button-primary' : 'button-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Usuarios</button>
          <button 
            onClick={() => setTab('expenses')} 
            className={`button ${tab === 'expenses' ? 'button-primary' : 'button-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Gastos de Audio</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        
        {/* TAB 1: EMPLEADOS */}
        {tab === 'employees' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {employees.map(emp => (
              <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#222', padding: '1rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{emp.name}</div>
                
                {resetFocusId === emp.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      className="input" 
                      style={{ width: '80px', textAlign: 'center', padding: '0.5rem' }} 
                      placeholder="XXXX"
                      maxLength={4}
                      value={newPin}
                      onChange={e => setNewPin(e.target.value.substring(0,4))}
                    />
                    <button onClick={() => handleResetPin(emp.id)} className="button button-primary" style={{ padding: '0.5rem 1rem' }}>Guardar</button>
                    <button onClick={() => setResetFocusId(null)} className="button button-secondary" style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setResetFocusId(emp.id)} className="button button-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Resetear PIN
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: GASTOS (Audios) */}
        {tab === 'expenses' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {expenses.map(exp => (
              <div key={exp.id} style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.875rem' }}>
                  <span>{exp.employee.name}</span>
                  <span>{exp.fecha} - {exp.tipo.toUpperCase()} - {exp.importe}€</span>
                </div>
                
                {/* Asumimos que "concepto" almacena el audio codificado en Base64 con el prefijo correcto de mime-type (data:audio/webm;base64,... o similar) */}
                {exp.concepto && exp.concepto.startsWith('data:audio') ? (
                  <audio controls src={exp.concepto} style={{ width: '100%', height: '40px', outline: 'none' }} />
                ) : (
                  <div style={{ color: '#fff' }}>{exp.concepto || 'Sin detalle de audio ni texto'}</div>
                )}
              </div>
            ))}
            {expenses.length === 0 && <p style={{ color: '#888' }}>No hay gastos registrados.</p>}
          </div>
        )}

      </div>

    </div>
  );
}
