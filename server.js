const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API pour les calculs
app.post('/api/calculate', (req, res) => {
  try {
    const { expression } = req.body;
    // Évaluer l'expression mathématique (avec précaution)
    // Note: eval() est utilisé ici pour simplifier, mais dans un environnement de production,
    // il faudrait utiliser une bibliothèque sécurisée comme math.js
    const result = Function('"use strict";return (' + expression + ')')();
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Expression invalide' });
  }
});

// Route pour servir l'application Vue
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
