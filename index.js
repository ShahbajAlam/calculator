"use strict";

const allBtns = document.querySelectorAll("button");
const display = document.querySelector(".display h1");
const equalBtn = document.querySelector(".equal");
const copyright = document.querySelector(".copyright span");
let isDecimalPresent = false;
let isOperatorPresent = false;
let firstOperand = null;
let secondOperand = null;
let operator;
let result;
let displayOp;
const enteredOperatorArr = [];

const showBackdrop = () => {
    document.querySelector(".backdrop").classList.remove("hidden__backdrop");
};

const hideBackdrop = () => {
    document.querySelector(".backdrop").classList.add("hidden__backdrop");
};

const showModal = (msg) => {
    document.querySelector(".modal h2").textContent = msg;
    document.querySelector(".modal").classList.remove("hidden");
};

const hideModal = () => {
    document.querySelector(".modal").classList.add("hidden");
};

copyright.textContent = new Date().getFullYear();

const preventMultipleDecimal = () => {
    //If we already have a result, we wanna prevent adding decimal to it
    if (result) return;

    //If a decimal point is already present in a number and
    //No operator is chosen yet, that means we are in that number only,
    //So we wanna prevent further decimal points
    if (isDecimalPresent) return;

    //Otherwise we`re simply adding a decimal point
    //Also making the Boolean value to "true"
    display.textContent += ".";
    isDecimalPresent = true;
};

const operandInput = (userInput) => {
    //If there is already a result, we don`t wanna add an operand
    //Now we expect an operator, so we return from function
    if (result) return;

    //Otherwise we are appending user input operand to display
    display.textContent += userInput;

    //If there is no operator present yet, that means the number is first operand
    if (!isOperatorPresent) firstOperand = +display.textContent;
    //If there is an operator, then number after the operator is second operand
    else {
        //We are spliting the whole string into array
        //The separator is the displayed operator (Not the actual operator)
        //That means, in case of multiplication, × is separator, not *.
        const arr = display.textContent.split(displayOp);

        //So the last item of the array is second operator
        secondOperand = +arr[arr.length - 1];
    }
};

const clearAll = () => {
    //Resetting everything when clear button is clicked
    display.textContent = "";
    isDecimalPresent = false;
    isOperatorPresent = false;
    firstOperand = null;
    secondOperand = null;
    operator = "";
    result = null;
};

const operatorInput = (userInput, internal) => {
    //If the very first input is an operator, that means no operand is present yet
    //In that case, we wanna show an alert and return
    if (!firstOperand && firstOperand !== 0) {
        showBackdrop();
        showModal("Enter an operand first");
        return;
    }

    //If both the first and second operand is present,  we wanna calculate them
    //Because we wanna use the result as the first operand for the next operation
    if (secondOperand) {
        if (firstOperand) calculate();
        else if (firstOperand === 0) calculate();
    }

    //Otherwise we are appending the operator to the display
    //But we have a problem here
    //If user changes mind, and enter different operator again
    //Then all operator will be displayed, to solve this we are using an array "enteredOperatorArr"
    //If array length is 1, that means only one operator was chosen, that is being appended with first operand
    //Otherwise we are taking the last operator from that array, and appending that to first operand
    enteredOperatorArr.push(userInput);
    display.textContent =
        enteredOperatorArr.length >= 1
            ? firstOperand + enteredOperatorArr[enteredOperatorArr.length - 1]
            : firstOperand + userInput;

    //This is used to display the operator, eg- ×
    displayOp = userInput;

    //This is the actual operator that JS understands
    operator = internal;

    //If an operator is present, that means second operand can accept exactly one decimal point.
    //So we are changing the Boolean value to "false"
    if (operator) isDecimalPresent = false;

    //We are updating the Boolean
    isOperatorPresent = true;

    //"result" variable needs to be reset
    //Otherwise in "operandInput()", it will not accept further operands
    result = null;
};

const calculate = () => {
    //Suppose user enters one operand, then click on = button
    //Then it`ll simply output the operand
    if (!operator) result = firstOperand;

    //Addition
    if (operator === "+") {
        result = Number.isInteger(firstOperand + secondOperand)
            ? firstOperand + secondOperand
            : (firstOperand + secondOperand).toFixed(5);
    }

    //Subtraction
    if (operator === "-") {
        result = Number.isInteger(firstOperand - secondOperand)
            ? firstOperand - secondOperand
            : (firstOperand - secondOperand).toFixed(5);
    }

    //Multiplication
    if (operator === "*") {
        result = Number.isInteger(firstOperand * secondOperand)
            ? firstOperand * secondOperand
            : (firstOperand * secondOperand).toFixed(5);
    }

    //Division
    if (operator === "/") {
        //If second operand is 0, then result will be infinty,
        //So we are resetting everything and returning
        if (secondOperand === 0) {
            showBackdrop();
            showModal("A number can not be divided by zero");
            clearAll();
            return;
        }

        //If division result is integer, then we are storing it in "result" variable
        //But if it`s not integer, then we are taking upto 5 decimal points precesion
        result = Number.isInteger(firstOperand / secondOperand)
            ? firstOperand / secondOperand
            : (firstOperand / secondOperand).toFixed(5);
    }

    //Making the first operand equal to result for next calculation
    //Also we`re converting it into Number
    //Otherwise, in next steps, addition will cause error
    firstOperand = +result;

    //Making second operand null, as user will enter second operand
    secondOperand = null;

    //Displaying the result
    display.textContent = result;

    //Resetting the operator
    operator = null;

    //Resetting the enteredOperator array
    enteredOperatorArr.splice(0);
};

allBtns.forEach((btn) => {
    //Adding event listeners to the buttons according to some conditions
    if (btn.classList.contains("decimal")) {
        btn.addEventListener("click", preventMultipleDecimal);
    }
    if (btn.classList.length === 0) {
        btn.addEventListener("click", operandInput.bind(null, btn.value));
    }
    if (btn.classList.contains("clear")) {
        btn.addEventListener("click", clearAll);
    }
    if (btn.classList.contains("operator")) {
        btn.addEventListener(
            "click",
            operatorInput.bind(null, btn.textContent, btn.value)
        );
    }
});

equalBtn.addEventListener("click", calculate);

//Event listener for keyboard button press event
document.addEventListener("keydown", (e) => {
    if (e.key === ".") preventMultipleDecimal();
    if (e.key === "1") operandInput("1");
    if (e.key === "2") operandInput("2");
    if (e.key === "3") operandInput("3");
    if (e.key === "4") operandInput("4");
    if (e.key === "5") operandInput("5");
    if (e.key === "6") operandInput("6");
    if (e.key === "7") operandInput("7");
    if (e.key === "8") operandInput("8");
    if (e.key === "9") operandInput("9");
    if (e.key === "0") operandInput("0");
    if (e.key === "+") operatorInput("+", "+");
    if (e.key === "-") operatorInput("-", "-");
    if (e.key === "*") operatorInput("×", "*");
    if (e.key === "/") operatorInput("÷", "/");
    if (e.key === "Enter") {
        e.preventDefault();
        calculate();
    }
    if (e.key === "Escape") clearAll();
});

document.querySelector(".backdrop").addEventListener("click", () => {
    hideModal();
    hideBackdrop();
});
