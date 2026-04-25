import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/auth/employees — list all employees (id + name only, no PIN)
router.get('/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// POST /api/auth/login — validate employee PIN
router.post('/login', async (req, res) => {
  try {
    const { employeeId, pin } = req.body;

    if (!employeeId || !pin) {
      return res.status(400).json({ success: false, error: 'Faltan datos' });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, name: true, pinHash: true },
    });

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Empleado no encontrado' });
    }

    const valid = await bcrypt.compare(pin, employee.pinHash);

    if (!valid) {
      return res.status(401).json({ success: false, error: 'PIN incorrecto' });
    }

    res.json({
      success: true,
      employee: { id: employee.id, name: employee.name },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

export default router;
