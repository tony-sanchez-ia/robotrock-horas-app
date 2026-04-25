import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import PinScreen from './components/PinScreen';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import HoursScreen from './components/HoursScreen';
import ExpensesScreen from './components/ExpensesScreen';
import SummaryScreen from './components/SummaryScreen';

export default function App() {
  const [employee, setEmployee] = useState(null);
  const [pinOk, setPinOk] = useState(false);
  const [tab, setTab] = useState('hours');

  function handleLogout() {
    setEmployee(null);
    setPinOk(false);
    setTab('hours');
  }

  function handleBack() {
    setEmployee(null);
    setPinOk(false);
  }

  // Login flow
  if (!employee) {
    return <LoginScreen onLogin={setEmployee} />;
  }

  if (!pinOk) {
    return (
      <PinScreen
        employee={employee}
        onSuccess={() => setPinOk(true)}
        onBack={handleBack}
      />
    );
  }

  // Main app
  return (
    <div className="screen" style={{ position: 'relative' }}>
      <TopBar employee={employee} onLogout={handleLogout} />

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {tab === 'hours' && <HoursScreen employee={employee} />}
        {tab === 'expenses' && <ExpensesScreen employee={employee} />}
        {tab === 'summary' && <SummaryScreen employee={employee} />}
      </div>

      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
}
