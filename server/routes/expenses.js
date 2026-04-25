import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/expenses?employeeId=X&month=YYYY-MM
router.get('/', async (req, res) => {
  try {
    const { employeeId, month } = req.query;

    if (!employeeId) {
      return res.status(400).json({ error: 'Falta employeeId' });
    }

    const where = { employeeId: parseInt(employeeId) };

    if (month) {
      where.fecha = { startsWith: month };
    }

    const expenses = await prisma.expenseEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
});

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { employeeId, fecha, tipo, importe, concepto } = req.body;

    if (!employeeId || !fecha || !tipo || importe === undefined) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const entry = await prisma.expenseEntry.create({
      data: {
        employeeId: parseInt(employeeId),
        fecha,
        tipo,
        importe: parseFloat(importe),
        concepto: concepto || '',
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating expense entry:', error);
    res.status(500).json({ error: 'Error al guardar gasto' });
  }
});

export default router;
