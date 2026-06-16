const express = require('express');
const router = express.Router();
const Favorito = require('../models/favorito.model');
const { body, validationResult } = require('express-validator');

// GET /favoritos
router.get('/', async (req, res) => { // Obtiene todos los favoritos
  try {
    const favoritos = await Favorito.findAll();
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo favoritos' });
  }
});

// POST /favoritos
router.post('/',
  [
    body('id').isInt({ min: 1 }).withMessage('id debe ser un número entero positivo'),
    body('name').isString().trim().notEmpty().withMessage('name es requerido'),
    body('weight').optional().isInt({ min: 0 }),
    body('height').optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id, name, weight, height, base_experience, types, sprites } = req.body;

      const yaExiste = await Favorito.findOne({ where: { pokemonId: id } });
      if (yaExiste) {
        return res.status(409).json({ error: 'El pokémon ya está en favoritos' });
      }

      const favorito = await Favorito.create({
        pokemonId: id,
        name,
        weight,
        height,
        baseExperience: base_experience,
        types,
        spriteUrl: sprites?.front_default
      });

      res.status(201).json(favorito);
    } catch (error) {
      res.status(500).json({ error: 'Error agregando favorito' });
    }
  }
);

// DELETE /favoritos/:id
router.delete('/:id', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const deleted = await Favorito.destroy({ where: { pokemonId } });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }

    res.json({ mensaje: 'Pokémon eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando favorito' });
  }
});

module.exports = router;