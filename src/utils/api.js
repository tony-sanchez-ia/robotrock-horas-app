const BASE_URL = '/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  getEmployees: () => request('/auth/employees'),
  login: (employeeId, pin) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ employeeId, pin }),
  }),

  // Hours
  getHours: (employeeId, month) => request(`/hours?employeeId=${employeeId}&month=${month}`),
  createHour: (data) => request('/hours', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Expenses
  getExpenses: (employeeId, month) => request(`/expenses?employeeId=${employeeId}&month=${month}`),
  createExpense: (data) => request('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Summary
  getSummary: (employeeId, month) => request(`/summary?employeeId=${employeeId}&month=${month}`),
};
