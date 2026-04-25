import { getInitials } from '../utils/helpers';
import Icon from './Icon';

export default function TopBar({ employee, onLogout }) {
  return (
    <div className="top-bar">
      <div className="top-bar__user">
        <div className="top-bar__avatar">
          {getInitials(employee.name)}
        </div>
        <span className="top-bar__name">{employee.name.split(' ')[0]}</span>
      </div>
      <button className="top-bar__logout" onClick={onLogout}>
        <Icon name="logout" size={16} color="var(--muted)" />
      </button>
    </div>
  );
}
