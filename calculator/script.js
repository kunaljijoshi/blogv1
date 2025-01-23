let display = document.getElementById('display');
let formulaDisplay = document.getElementById('formula-display');
let currentInput = '';
let previousInput = '';
let operation = null;
let lastResult = null;

function appendNumber(num) {
    if (lastResult !== null && !operation) {
        clearDisplay();
        lastResult = null;
    }
    currentInput += num;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    
    // Remove active class from all operators
    document.querySelectorAll('.buttons button').forEach(btn => {
        if ('+-*/'.includes(btn.textContent)) {
            btn.classList.remove('active-operator');
        }
    });
    
    // Find and highlight the clicked operator button
    document.querySelectorAll('.buttons button').forEach(btn => {
        if (btn.textContent === '×' && op === '*') {
            btn.classList.add('active-operator');
        } else if (btn.textContent === '÷' && op === '/') {
            btn.classList.add('active-operator');
        } else if (btn.textContent === op) {
            btn.classList.add('active-operator');
        }
    });

    if (currentInput === '' && operation) {
        // Just changing the operator
        operation = op;
        updateFormula();
        return;
    }

    if (operation && previousInput && currentInput) {
        calculate(false);
    }

    operation = op;
    if (!previousInput) {
        previousInput = currentInput;
        currentInput = '';
    }
    updateFormula();
}

function calculate(isEquals = true) {
    if (currentInput === '' || previousInput === '' || !operation) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
    }
    
    // Format the result to handle long decimals
    result = parseFloat(result.toFixed(8));
    
    if (isEquals) {
        formulaDisplay.value = `${previousInput} ${operation} ${currentInput} =`;
        lastResult = result;
        // Remove active operator highlighting
        document.querySelectorAll('.buttons button').forEach(btn => {
            btn.classList.remove('active-operator');
        });
    } else {
        previousInput = result.toString();
        updateFormula();
    }
    
    currentInput = result.toString();
    if (isEquals) {
        previousInput = '';
        operation = null;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operation = null;
    lastResult = null;
    // Remove active operator highlighting
    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.classList.remove('active-operator');
    });
    updateDisplay();
    updateFormula();
}

function updateDisplay() {
    display.value = currentInput || '0';
}

function updateFormula() {
    if (!previousInput) {
        formulaDisplay.value = '';
        return;
    }
    formulaDisplay.value = `${previousInput} ${operation || ''} ${currentInput}`;
} 