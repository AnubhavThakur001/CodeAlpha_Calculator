
const resultDisplay = document.getElementById("result");
const historyDisplay = document.getElementById("history");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldReset = false;
let expressionText = "";

function updateDisplay() {
    resultDisplay.textContent = currentInput;
    historyDisplay.textContent = expressionText;
}

function inputNumber(number) {
    if (currentInput === "Error") clearAll();

    if (shouldReset) {
        currentInput = number;
        shouldReset = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.replace("-", "").length < 14) {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentInput === "Error") clearAll();

    if (shouldReset) {
        currentInput = "0.";
        shouldReset = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    if (operator && !shouldReset) {
        calculate();
    }

    previousInput = Number(currentInput);
    operator = nextOperator;
    expressionText = `${currentInput} ${getSymbol(operator)}`;
    shouldReset = true;
    updateDisplay();
}

function getSymbol(op) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

function calculate() {
    if (operator === null || shouldReset) return;

    const first = previousInput;
    const second = Number(currentInput);
    let answer;

    switch (operator) {
        case "+":
            answer = first + second;
            break;
        case "-":
            answer = first - second;
            break;
        case "*":
            answer = first * second;
            break;
        case "/":
            if (second === 0) {
                currentInput = "Error";
                expressionText = "Cannot divide by zero";
                operator = null;
                previousInput = null;
                shouldReset = true;
                updateDisplay();
                return;
            }
            answer = first / second;
            break;
    }

    if (!Number.isFinite(answer)) {
        currentInput = "Error";
    } else {
        answer = Number(answer.toPrecision(12));
        currentInput = String(answer);
    }

    expressionText = `${first} ${getSymbol(operator)} ${second} =`;
    operator = null;
    previousInput = null;
    shouldReset = true;
    updateDisplay();
}

function clearAll() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    shouldReset = false;
    expressionText = "";
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === "Error") {
        clearAll();
        return;
    }

    if (shouldReset) {
        currentInput = "0";
        shouldReset = false;
    } else {
        currentInput = currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";

        if (currentInput === "-") currentInput = "0";
    }

    updateDisplay();
}

function toggleSign() {
    if (currentInput === "Error" || currentInput === "0") return;

    currentInput = currentInput.startsWith("-")
        ? currentInput.slice(1)
        : "-" + currentInput;

    updateDisplay();
}

function percentage() {
    if (currentInput === "Error") return;

    currentInput = String(
        Number((Number(currentInput) / 100).toPrecision(12))
    );

    shouldReset = false;
    updateDisplay();
}

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearAll();
                break;
            case "delete":
                deleteNumber();
                break;
            case "decimal":
                inputDecimal();
                break;
            case "calculate":
                calculate();
                break;
            case "sign":
                toggleSign();
                break;
            case "percent":
                percentage();
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearAll();
    } else if (key === ".") {
        inputDecimal();
    } else if (key === "%") {
        percentage();
    }
});

updateDisplay();
