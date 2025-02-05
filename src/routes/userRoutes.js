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


// ✅ Endpoint para sincronizar actualización desde el microservicio de Update
router.post('/sync-update', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-update:', req.body);
    const { id, first_name, last_name, identification_number, email, phone_number } = req.body;

    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ first_name, last_name, identification_number, email, phone_number });
            console.log(`✅ Usuario con ID ${id} actualizado en la base de Read`);
        } else {
            console.log(`⚠️ Usuario con ID ${id} no encontrado en la base de Read`);
        }

        res.status(200).send({ message: `Usuario con ID ${id} actualizado correctamente en Read` });
    } catch (error) {
        console.error('❌ Error sincronizando actualización de usuario en Read:', error);
        res.status(500).send({ error: 'Failed to sync user update' });
    }
});

module.exports = router;
