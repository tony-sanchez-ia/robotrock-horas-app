import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Middleware básico para proteger las rutas (usando un token o password fijo por ahora) 
// Puedes enviar el header `x-admin-password` desde el frontend
const checkAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'robotrock2026';
  
  if (password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Acceso denegado (Contraseña de administrador incorrecta)' });
  }
  next();
};

router.use(checkAdmin);

// 1. Obtener todos los empleados
router.get('/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, createdAt: true } // Omitimos pinHash por seguridad
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// 2. Modificar el PIN de un empleado
router.put('/employees/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPin } = req.body;

    if (!newPin || newPin.length !== 4) {
      return res.status(400).json({ error: 'El PIN debe tener 4 dígitos' });
    }

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(newPin, salt);

    await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { pinHash }
    });

    res.json({ success: true, message: 'PIN actualizado correctamente' });
  } catch (error) {
    console.error('Error updating PIN:', error);
    res.status(500).json({ error: 'Error al actualizar el PIN' });
  }
});

// 3. Obtener todos los gastos (con modo audio)
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await prisma.expenseEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: { name: true }
        }
      }
    });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    res.status(500).json({ error: 'Error al obtener gastos generales' });
  }
});

export default router;
