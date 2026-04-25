import Icon from './Icon';

const tabs = [
  { id: 'hours', label: 'Horas', icon: 'clock' },
  { id: 'expenses', label: 'Gastos', icon: 'wallet' },
  { id: 'summary', label: 'Resumen', icon: 'chart' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-btn ${t.id === activeTab ? 'nav-btn--active' : 'nav-btn--inactive'}`}
          onClick={() => onTabChange(t.id)}
        >
          <Icon
            name={t.icon}
            size={22}
            color={t.id === activeTab ? 'var(--accent)' : 'var(--muted)'}
          />
          {t.label}
        </button>
      ))}
    </div>
  );
}
