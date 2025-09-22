document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');
    const acButton = document.querySelector('button[data-value="C"]');

    let currentInput = '0';
    let operator = null;
    let firstOperand = null;
    let shouldResetDisplay = false;

    buttons.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('.btn')) return;

        const value = target.dataset.value;

        if (value >= '0' && value <= '9' || value === '.') {
            handleNumber(value);
        } else if (value === 'C') {
            resetCalculator();
        } else if (value === 'toggle-sign') {
            handleToggleSign();
        } else if (value === '=') {
            handleEquals();
        } else { // All other operators (+, -, *, /, %)
            handleOperator(value);
        }
        updateDisplay();
    });

    function handleNumber(num) {
        if (shouldResetDisplay) {
            currentInput = num;
            shouldResetDisplay = false;
        } else {
            if (currentInput === '0' && num !== '.') {
                currentInput = num;
            } else {
                if (num === '.' && currentInput.includes('.')) return;
                currentInput += num;
            }
        }
        acButton.textContent = 'C';
        removeActiveOperator();
    }

    function handleToggleSign() {
        if (currentInput !== '0' && currentInput !== 'Error') {
            currentInput = (parseFloat(currentInput) * -1).toString();
        }
    }

    function handleOperator(op) {
        if (firstOperand !== null && operator && !shouldResetDisplay) {
            handleEquals();
        }
        
        firstOperand = parseFloat(currentInput);
        operator = op;
        shouldResetDisplay = true;

        removeActiveOperator();
        const activeButton = document.querySelector(`button[data-value="${op}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    function handleEquals() {
        if (operator === null || shouldResetDisplay) return;

        const secondOperand = parseFloat(currentInput);
        let result = 0;

        try {
            switch (operator) {
                case '+': result = firstOperand + secondOperand; break;
                case '-': result = firstOperand - secondOperand; break;
                case '*': result = firstOperand * secondOperand; break;
                case '/':
                    if (secondOperand === 0) throw new Error("Error");
                    result = firstOperand / secondOperand;
                    break;
                case '%': result = (firstOperand * secondOperand) / 100; break;
            }
            currentInput = roundResult(result).toString();
        } catch (e) {
            currentInput = e.message;
        }

        operator = null;
        shouldResetDisplay = true;
        removeActiveOperator();
    }

    function resetCalculator() {
        currentInput = '0';
        operator = null;
        firstOperand = null;
        shouldResetDisplay = false;
        acButton.textContent = 'AC';
        removeActiveOperator();
    }

    function updateDisplay() {
        let valueToDisplay = currentInput;
        if (valueToDisplay.length > 9 && !valueToDisplay.includes('Error')) {
            valueToDisplay = parseFloat(valueToDisplay).toExponential(3);
        }
        // Заменяем точку на запятую для отображения
        display.textContent = valueToDisplay.replace('.', ',');
    }

    function roundResult(num) {
        // Округляем до 6 знаков после запятой для большей точности
        return Math.round(num * 1000000) / 1000000;
    }

    function removeActiveOperator() {
        const activeBtn = document.querySelector('.operator.active');
        if (activeBtn) {
            activeBtn.classList.remove('active');
        }
    }

    resetCalculator();
    updateDisplay();
});
