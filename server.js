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
    
    // Vérifier si l'expression est vide ou invalide
    if (!expression || typeof expression !== 'string') {
      return res.status(400).json({ error: 'Expression invalide' });
    }
    
    // Nettoyer l'expression pour éviter les injections
    let cleanExpression = expression
      .replace(/[^0-9+\-*/().%\s]/g, '')  // Ne garder que les caractères sûrs
      .replace(/\s+/g, '');                // Supprimer les espaces
    
    // Vérifier si l'expression est vide après nettoyage
    if (!cleanExpression) {
      return res.status(400).json({ error: 'Expression invalide après nettoyage' });
    }
    
    // Évaluer l'expression mathématique (avec précaution)
    const result = Function('"use strict";return (' + cleanExpression + ')')();
    
    // Vérifier si le résultat est un nombre valide
    if (isNaN(result) || !isFinite(result)) {
      return res.status(400).json({ error: 'Résultat non valide' });
    }
    
    res.json({ result });
  } catch (error) {
    console.error('Erreur de calcul:', error.message);
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
