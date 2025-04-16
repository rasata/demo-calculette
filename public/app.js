document.addEventListener('DOMContentLoaded', function() {
  // Gestion de la navigation entre les modules
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  
  // Ajouter un écouteur d'événement à chaque élément de la barre latérale
  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      // Retirer la classe active de tous les éléments
      sidebarItems.forEach(i => i.classList.remove('active'));
      
      // Ajouter la classe active à l'élément cliqué
      this.classList.add('active');
      
      // Récupérer le module à afficher
      const moduleId = this.getAttribute('data-module');
      
      // Masquer tous les modules
      document.querySelectorAll('.module-container').forEach(module => {
        module.classList.remove('active');
      });
      
      // Afficher le module sélectionné
      document.getElementById(`${moduleId}-module`).classList.add('active');
    });
  });
  
  // Éléments DOM pour la calculatrice
  const screen = document.getElementById('screen');
  const historyDisplay = document.getElementById('history');
  const buttons = document.querySelectorAll('.btn');
  
  // Variables d'état
  let currentInput = '0';
  let previousInput = '';
  let calculationHistory = [];
  let waitingForOperand = false;
  let lastResult = null;
  
  // Initialiser l'affichage
  updateDisplay();
  
  // Ajouter les écouteurs d'événements aux boutons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      handleButtonClick(value);
    });
  });
  
  // Gérer les entrées clavier
  document.addEventListener('keydown', (event) => {
    // Vérifier si le module calculatrice est actif
    if (!document.getElementById('calculator-module').classList.contains('active')) {
      return;
    }
    
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
      handleButtonClick(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleButtonClick(key);
    } else if (key === 'Enter' || key === '=') {
      handleButtonClick('=');
    } else if (key === 'Escape') {
      handleButtonClick('clear');
    } else if (key === 'Backspace') {
      handleButtonClick('backspace');
    } else if (key === '.') {
      handleButtonClick('.');
    } else if (key === '%') {
      handleButtonClick('%');
    }
  });
  
  // Fonction principale pour gérer les clics de boutons
  function handleButtonClick(value) {
    // Si on attend un opérande et qu'on entre un chiffre, on efface l'affichage
    if (waitingForOperand && /[0-9]/.test(value)) {
      currentInput = '';
      waitingForOperand = false;
    }
    
    switch (value) {
      case 'clear':
        clearAll();
        break;
      case 'backspace':
        backspace();
        break;
      case 'negate':
        negate();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        handleOperator(value);
        break;
      case '=':
        calculate();
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
        applyMathFunction(value);
        break;
      case 'sqrt':
        applyMathFunction('sqrt');
        break;
      case 'square':
        square();
        break;
      case 'pi':
        insertPi();
        break;
      case '(':
      case ')':
        addParenthesis(value);
        break;
      default:
        // Pour les chiffres et le point décimal
        if (currentInput === '0' && value !== '.') {
          currentInput = value;
        } else if (value === '.' && currentInput.includes('.')) {
          // Éviter les points décimaux multiples
          return;
        } else {
          currentInput += value;
        }
        break;
    }
    
    updateDisplay();
  }
  
  // Mettre à jour l'affichage
  function updateDisplay() {
    // Limiter la longueur pour éviter le débordement
    let displayValue = currentInput;
    if (displayValue.length > 12) {
      displayValue = parseFloat(displayValue).toExponential(6);
    }
    
    screen.textContent = displayValue;
    
    // Afficher l'historique
    if (calculationHistory.length > 0) {
      historyDisplay.textContent = calculationHistory[calculationHistory.length - 1];
    } else {
      historyDisplay.textContent = '';
    }
  }
  
  // Fonctions de la calculatrice
  function clearAll() {
    currentInput = '0';
    previousInput = '';
    waitingForOperand = false;
  }
  
  function backspace() {
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
  }
  
  function negate() {
    if (currentInput !== '0') {
      if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1);
      } else {
        currentInput = '-' + currentInput;
      }
    }
  }
  
  function handleOperator(operator) {
    // Si l'entrée se termine déjà par un opérateur, le remplacer
    if (/[+\-*/%]$/.test(currentInput)) {
      currentInput = currentInput.slice(0, -1) + operator;
    } else {
      currentInput += operator;
    }
    waitingForOperand = false;
  }
  
  function calculate() {
    try {
      // Vérifier si l'expression est valide
      if (currentInput === '0' || /^[+\-*/%]$/.test(currentInput)) {
        return;
      }
      
      // Supprimer l'opérateur final s'il est seul
      let expression = currentInput;
      if (/[+\-*/%]$/.test(expression)) {
        expression = expression.slice(0, -1);
      }
      
      // Évaluer l'expression localement
      // Note: Dans une application réelle, il serait préférable d'utiliser une bibliothèque comme math.js
      const result = evaluateExpression(expression);
      
      // Enregistrer dans l'historique
      calculationHistory.push(`${currentInput} = ${result}`);
      if (calculationHistory.length > 5) {
        calculationHistory.shift(); // Garder seulement les 5 derniers calculs
      }
      
      lastResult = result;
      previousInput = currentInput;
      currentInput = result.toString();
      waitingForOperand = true;
    } catch (error) {
      currentInput = 'Error';
      console.error('Erreur de calcul:', error);
    }
  }
  
  // Fonction sécurisée pour évaluer les expressions
  function evaluateExpression(expression) {
    // Remplacer les fonctions mathématiques
    expression = expression
      .replace(/sin\(([^)]+)\)/g, (_, p1) => Math.sin(parseFloat(p1)))
      .replace(/cos\(([^)]+)\)/g, (_, p1) => Math.cos(parseFloat(p1)))
      .replace(/tan\(([^)]+)\)/g, (_, p1) => Math.tan(parseFloat(p1)))
      .replace(/log\(([^)]+)\)/g, (_, p1) => Math.log10(parseFloat(p1)))
      .replace(/sqrt\(([^)]+)\)/g, (_, p1) => Math.sqrt(parseFloat(p1)));
    
    // Utiliser Function pour évaluer l'expression (plus sûr que eval)
    return Function('"use strict"; return (' + expression + ')')();
  }
  
  function applyMathFunction(func) {
    try {
      // Vérifier si la valeur est un nombre valide
      const value = parseFloat(currentInput);
      if (isNaN(value)) {
        currentInput = 'Error';
        return;
      }
      
      let result;
      switch(func) {
        case 'sin':
          result = Math.sin(value);
          break;
        case 'cos':
          result = Math.cos(value);
          break;
        case 'tan':
          result = Math.tan(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        default:
          throw new Error('Fonction non supportée');
      }
      
      // Vérifier si le résultat est valide
      if (isNaN(result) || !isFinite(result)) {
        currentInput = 'Error';
        return;
      }
      
      currentInput = result.toString();
      waitingForOperand = true;
    } catch (error) {
      currentInput = 'Error';
      console.error('Erreur fonction:', error);
    }
  }
  
  function square() {
    try {
      const value = parseFloat(currentInput);
      const result = value * value;
      currentInput = result.toString();
      waitingForOperand = true;
    } catch (error) {
      currentInput = 'Error';
    }
  }
  
  function insertPi() {
    if (currentInput === '0' || waitingForOperand) {
      currentInput = Math.PI.toString();
      waitingForOperand = false;
    } else {
      currentInput += Math.PI.toString();
    }
  }
  
  function addParenthesis(parenthesis) {
    if (currentInput === '0') {
      currentInput = parenthesis;
    } else {
      currentInput += parenthesis;
    }
  }
});
