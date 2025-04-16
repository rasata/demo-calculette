new Vue({
  el: '#app',
  data: {
    display: '0',
    currentOperation: null,
    previousValue: null,
    waitingForOperand: false,
    history: [],
    scientificMode: true
  },
  computed: {
    scientificButtons() {
      return [
        { label: 'sin', value: 'sin', type: 'btn-primary' },
        { label: 'cos', value: 'cos', type: 'btn-primary' },
        { label: 'tan', value: 'tan', type: 'btn-primary' },
        { label: '÷', value: '/', type: 'btn-secondary' },
        { label: 'x²', value: 'square', type: 'btn-primary' },
        { label: '√', value: 'sqrt', type: 'btn-primary' },
        { label: 'log', value: 'log', type: 'btn-primary' },
        { label: '×', value: '*', type: 'btn-secondary' },
        { label: '(', value: '(', type: 'btn-primary' },
        { label: ')', value: ')', type: 'btn-primary' },
        { label: 'π', value: 'pi', type: 'btn-primary' },
        { label: '-', value: '-', type: 'btn-secondary' }
      ];
    },
    numericButtons() {
      return [
        { label: '7', value: '7', type: 'btn-light' },
        { label: '8', value: '8', type: 'btn-light' },
        { label: '9', value: '9', type: 'btn-light' },
        { label: '+', value: '+', type: 'btn-secondary' },
        { label: '4', value: '4', type: 'btn-light' },
        { label: '5', value: '5', type: 'btn-light' },
        { label: '6', value: '6', type: 'btn-light' },
        { label: '%', value: '%', type: 'btn-secondary' },
        { label: '1', value: '1', type: 'btn-light' },
        { label: '2', value: '2', type: 'btn-light' },
        { label: '3', value: '3', type: 'btn-light' },
        { label: '±', value: 'negate', type: 'btn-secondary' },
        { label: '0', value: '0', type: 'btn-light' },
        { label: '.', value: '.', type: 'btn-light' },
        { label: 'DEL', value: 'backspace', type: 'btn-warning' },
        { label: 'Ans', value: 'ans', type: 'btn-info' }
      ];
    }
  },
  methods: {
    handleButtonClick(value) {
      // Si on attend un opérande et qu'on entre un chiffre, on efface l'affichage
      if (this.waitingForOperand && /[0-9]/.test(value)) {
        this.display = '';
        this.waitingForOperand = false;
      }

      switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          this.handleOperator(value);
          break;
        case 'backspace':
          this.backspace();
          break;
        case 'negate':
          this.negate();
          break;
        case 'sin':
          this.applyFunction('Math.sin');
          break;
        case 'cos':
          this.applyFunction('Math.cos');
          break;
        case 'tan':
          this.applyFunction('Math.tan');
          break;
        case 'log':
          this.applyFunction('Math.log10');
          break;
        case 'sqrt':
          this.applyFunction('Math.sqrt');
          break;
        case 'square':
          this.square();
          break;
        case 'pi':
          this.insertPi();
          break;
        case 'ans':
          this.useLastResult();
          break;
        default:
          // Pour les chiffres et autres caractères
          if (this.display === '0' && value !== '.') {
            this.display = value;
          } else {
            this.display += value;
          }
      }
    },
    
    handleOperator(operator) {
      this.waitingForOperand = true;
      if (this.display.slice(-1).match(/[+\-*/%]/)) {
        // Remplacer l'opérateur existant
        this.display = this.display.slice(0, -1) + operator;
      } else {
        this.display += operator;
      }
    },
    
    clearDisplay() {
      this.display = '0';
      this.waitingForOperand = false;
    },
    
    backspace() {
      if (this.display.length > 1) {
        this.display = this.display.slice(0, -1);
      } else {
        this.display = '0';
      }
    },
    
    negate() {
      if (this.display !== '0') {
        if (this.display.startsWith('-')) {
          this.display = this.display.substring(1);
        } else {
          this.display = '-' + this.display;
        }
      }
    },
    
    applyFunction(func) {
      try {
        const value = parseFloat(this.display);
        const result = eval(`${func}(${value})`);
        this.display = result.toString();
        this.waitingForOperand = true;
      } catch (e) {
        this.display = 'Error';
      }
    },
    
    square() {
      try {
        const value = parseFloat(this.display);
        this.display = (value * value).toString();
        this.waitingForOperand = true;
      } catch (e) {
        this.display = 'Error';
      }
    },
    
    insertPi() {
      if (this.display === '0' || this.waitingForOperand) {
        this.display = Math.PI.toString();
        this.waitingForOperand = false;
      } else {
        this.display += Math.PI.toString();
      }
    },
    
    useLastResult() {
      if (this.history.length > 0) {
        const lastResult = this.history[this.history.length - 1].split('=')[1].trim();
        if (this.display === '0' || this.waitingForOperand) {
          this.display = lastResult;
          this.waitingForOperand = false;
        } else {
          this.display += lastResult;
        }
      }
    },
    
    calculate() {
      try {
        // Remplacer les opérateurs visuels par ceux compris par JavaScript
        let expression = this.display
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        
        // Utiliser le backend pour calculer
        axios.post('/api/calculate', { expression })
          .then(response => {
            const result = response.data.result;
            this.history.push(`${this.display} = ${result}`);
            this.display = result.toString();
            this.waitingForOperand = true;
          })
          .catch(error => {
            this.display = 'Error';
          });
      } catch (e) {
        this.display = 'Error';
      }
    }
  }
});
