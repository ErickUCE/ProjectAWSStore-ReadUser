const express = require('express');
const User = require('../models/user');

const router = express.Router();
router.use(express.json()); // ✅ Middleware para JSON

// ✅ Endpoint para sincronizar creación de proveedores desde el microservicio de Crear
router.post('/sync-create', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-create:', req.body);
    const { id, first_name, last_name, identification_number, email, password_hash, phone_number } = req.body;

    try {
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            await User.create({ id, first_name, last_name, identification_number, email, password_hash, phone_number });
            console.log(`✅ User con ID ${id} sincronizado en la base de Leer`);
        } else {
            console.log(`⚠️ User con ID ${id} ya existe en la base de Leer`);
        }

        res.status(200).send({ message: `User con ID ${id} sincronizado correctamente en Leer` });
    } catch (error) {
        console.error('❌ Error sincronizando user en Leer:', error);
        res.status(500).send({ error: 'Failed to sync user creation' });
    }
});

// ✅ Endpoint para sincronizar actualización de proveedores desde el microservicio de Editar
router.post('/sync-update', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-update:', req.body);
    const { id, first_name, last_name, identification_number, email, password_hash, phone_number } = req.body;

    try {
        const user = await User.findByPk(id);
        if (provider) {
            await user.update({ first_name, last_name, identification_number, email, password_hash, phone_number });
            console.log(`✅ User con ID ${id} actualizado en la base de Leer`);
        } else {
            console.log(`⚠️ User con ID ${id} no encontrado en la base de Leer`);
        }

        res.status(200).send({ message: `User con ID ${id} actualizado correctamente en Leer` });
    } catch (error) {
        console.error('❌ Error sincronizando actualización de proveedor en Leer:', error);
        res.status(500).send({ error: 'Failed to sync user update' });
    }
});




router.use(express.json()); // ✅ Middleware para JSON

// ✅ Endpoint para sincronizar eliminación de usuarios desde el microservicio de Eliminar
router.post('/sync-delete', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-delete:', req.body);
    const { id } = req.body;

    try {
        console.log('📌 Antes de eliminar:');
        const usersBefore = await User.findAll();
        console.table(usersBefore.map(p => ({ id: p.id, first_namename: p.name }))); // ✅ Imprimir lista antes de eliminar

        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            console.log(`✅ User con ID ${id} eliminado en la base de Leer`);
        } else {
            console.log(`⚠️ User con ID ${id} no encontrado en la base de Leer`);
        }

        console.log('📌 Después de eliminar:');
        const usersAfter = await User.findAll();
        console.table(usersAfter.map(p => ({ id: p.id, first_name: p.name }))); // ✅ Imprimir lista después de eliminar

        res.status(200).send({ message: `User con ID ${id} eliminado correctamente en Leer` });
    } catch (error) {
        console.error('❌ Error sincronizando eliminación de user en Leer:', error);
        res.status(500).send({ error: 'Failed to sync provider delete' });
    }
});

module.exports = router;
