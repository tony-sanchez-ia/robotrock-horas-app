import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/hours?employeeId=X&month=YYYY-MM
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

    const hours = await prisma.hourEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(hours);
  } catch (error) {
    console.error('Error fetching hours:', error);
    res.status(500).json({ error: 'Error al obtener horas' });
  }
});

// POST /api/hours
router.post('/', async (req, res) => {
  try {
    const { employeeId, fecha, turno, horas, concepto } = req.body;

    if (!employeeId || !fecha || !turno || !horas) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const entry = await prisma.hourEntry.create({
      data: {
        employeeId: parseInt(employeeId),
        fecha,
        turno,
        horas: parseFloat(horas),
        concepto: concepto || '',
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating hour entry:', error);
    res.status(500).json({ error: 'Error al guardar horas' });
  }
});

export default router;
