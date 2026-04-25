import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

const HOUR_RATE = 10.5;

// GET /api/summary?employeeId=X&month=YYYY-MM
router.get('/', async (req, res) => {
  try {
    const { employeeId, month } = req.query;

    if (!employeeId) {
      return res.status(400).json({ error: 'Falta employeeId' });
    }

    const empId = parseInt(employeeId);

    // Get hours for the selected month
    const hoursWhere = { employeeId: empId };
    if (month) hoursWhere.fecha = { startsWith: month };

    const hours = await prisma.hourEntry.findMany({
      where: hoursWhere,
      orderBy: { createdAt: 'desc' },
    });

    // Get expenses for the selected month
    const expensesWhere = { employeeId: empId };
    if (month) expensesWhere.fecha = { startsWith: month };

    const expenses = await prisma.expenseEntry.findMany({
      where: expensesWhere,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalHoras = hours.reduce((sum, h) => sum + h.horas, 0);
    const totalEuros = totalHoras * HOUR_RATE;
    const totalGastos = expenses.reduce((sum, e) => sum + e.importe, 0);

    // Hours by shift
    const horasByTurno = {
      mañana: hours.filter(h => h.turno === 'mañana').reduce((s, h) => s + h.horas, 0),
      tarde: hours.filter(h => h.turno === 'tarde').reduce((s, h) => s + h.horas, 0),
      noche: hours.filter(h => h.turno === 'noche').reduce((s, h) => s + h.horas, 0),
    };

    // Get all months that have data for this employee
    const allHours = await prisma.hourEntry.findMany({
      where: { employeeId: empId },
      select: { fecha: true },
    });
    const allExpenses = await prisma.expenseEntry.findMany({
      where: { employeeId: empId },
      select: { fecha: true },
    });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthsSet = new Set([
      ...allHours.map(h => h.fecha.slice(0, 7)),
      ...allExpenses.map(e => e.fecha.slice(0, 7)),
      currentMonth,
    ]);
    const availableMonths = [...monthsSet].sort().reverse();

    res.json({
      totalHoras,
      totalEuros,
      totalGastos,
      horasByTurno,
      hours,
      expenses,
      availableMonths,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
});

export default router;
