
// Author: URBAN KRISTAN 

const numberHolder = document.getElementById('number');
const initialNumberHolder = document.getElementById('initialNumber');
const nextButton = document.getElementById('nextNumber');
const customNumberButton = document.getElementById('customNumber');
const customNumberInput = document.getElementById('customNumberInput');
const undoButton = document.getElementById('undo');

let initialNumber = 0;
let number = 0;
let selectedIndices = [];
let opHistory = [];

const operations = [
  ['x²', (n) => Math.pow(n, 2)],
  ['x³', (n) => Math.pow(n, 3)],
  ['x⁴', (n) => Math.pow(n, 4)],
  ['x⁵', (n) => Math.pow(n, 5)],
  ['x⁶', (n) => Math.pow(n, 6)],
  ['x⁷', (n) => Math.pow(n, 7)],
  ['x⁸', (n) => Math.pow(n, 8)],
  ['x⁹', (n) => Math.pow(n, 9)],
  ['x¹⁰', (n) => Math.pow(n, 10)], 
  ['x¹¹', (n) => Math.pow(n, 11)],
  ['x¹²', (n) => Math.pow(n, 12)],
  ['x¹³', (n) => Math.pow(n, 13)],
  ['x¹⁴', (n) => Math.pow(n, 14)],
  ['x¹⁵', (n) => Math.pow(n, 15)],
  ['x¹⁶', (n) => Math.pow(n, 16)],
  ['x¹⁷', (n) => Math.pow(n, 17)],
  ['x¹⁸', (n) => Math.pow(n, 18)],
  ['x¹⁹', (n) => Math.pow(n, 19)],
  ['x²⁰', (n) => Math.pow(n, 20)], 
  ['√x', (n) => Math.sqrt(n)],
  ['³√x', (n) => Math.cbrt(n)],
  ['⁴√x', (n) => Math.pow(n, 1/4)],
  ['⁵√x', (n) => Math.pow(n, 1/5)],
  ['⁶√x', (n) => Math.pow(n, 1/6)],
  ['⁷√x', (n) => Math.pow(n, 1/7)],
  ['⁸√x', (n) => Math.pow(n, 1/8)],
  ['⁹√x', (n) => Math.pow(n, 1/9)],
  ['¹⁰√x', (n) => Math.pow(n, 1/10)],
  ['¹¹√x', (n) => Math.pow(n, 1/11)],
  ['¹²√x', (n) => Math.pow(n, 1/12)],
  ['¹³√x', (n) => Math.pow(n, 1/13)],
  ['¹⁴√x', (n) => Math.pow(n, 1/14)],
  ['¹⁵√x', (n) => Math.pow(n, 1/15)],
  ['¹⁶√x', (n) => Math.pow(n, 1/16)],
  ['¹⁷√x', (n) => Math.pow(n, 1/17)],
  ['¹⁸√x', (n) => Math.pow(n, 1/18)],
  ['¹⁹√x', (n) => Math.pow(n, 1/19)],
  ['²⁰√x', (n) => Math.pow(n, 1/20)], 
];

function saveState() {
  localStorage.setItem('state2', JSON.stringify({
    initialNumber: initialNumber,
    number: number,
    selectedIndices: selectedIndices,
    opHistory: opHistory
  }));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem('state2'));
  if ('number' in (state || {})) {
    initialNumber = state.initialNumber;
    number = state.number;
    selectedIndices = state.selectedIndices;
    opHistory = state.opHistory;
  } else {
    genNextNumber();
  }
  render();
}

function indicesFormRange() {
  for (let i = 0; i < selectedIndices.length - 1; i++) {
    if (selectedIndices[i + 1] - selectedIndices[i] !== 1) {
      return false;
    }
  }
  return true;
}

function selectedNumber() {
  return Number(
    String(number)
    .slice(
      selectedIndices[0],
      selectedIndices[selectedIndices.length-1] + 1
    ));
}

function renderHistory() {
  const holder = document.getElementById('historyItems');
  holder.innerHTML = '';
  for (let i = 0; i < opHistory.length; i++) {
    const op = opHistory[i];
    const elem = document.createElement('tr');
    const [input, output] = op.split(' -> ');
    elem.innerHTML = `<td style="align-text: right;">${(''+(i+1)).padStart(String(opHistory.length).length)}.</td><td>${input}</td><td>${' -> '}</td><td>${output}</td>`;
    holder.appendChild(elem);
  }
  const historyHolder = document.getElementById('history');
  historyHolder.scrollTop = historyHolder.scrollHeight;
}

function renderNumber() {
  selectedIndices = [];
  numberHolder.innerHTML = '';
  initialNumberHolder.innerHTML = `(${initialNumber})`;
  const digits = `${number}`.split('');
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const digitSpan = document.createElement('span');
    digitSpan.innerText = digit;
    digitSpan.id = "index" + i;
    digitSpan.addEventListener('click', () => onSelectionChange(i));
    numberHolder.appendChild(digitSpan);
  }
}

function renderButtons() {
  const holder = document.getElementById('changeButtons');
  holder.innerHTML = '';
  if (selectedIndices.length) {
    for (const [label, op] of operations) {
      const n = selectedNumber();
      if (op(n).toFixed(0).length === String(op(n)).length) {
        const button = document.createElement('button');
        button.innerText = label;
        const start = String(number).slice(0, selectedIndices[0]);
        const end = String(number).slice(
          selectedIndices[selectedIndices.length - 1] + 1,
          String(number).length
        );
        const newNumber = Number(start + String(op(n)) + end);
        if (newNumber !== number && newNumber < 1000000000) {
          button.addEventListener('click', ev => {
            opHistory.push(
              `${start + label.replace('x', '(' + n + ')') + end} -> ${newNumber}`
            );
            number = newNumber;
            render();
          });
          holder.append(button);
        }
        
      }

    }
  }
}

function genNextNumber() {
  number = Math.round(Math.random() * 10000);
  initialNumber = number;
}

function onSelectionChange(i) {
  const isSelected = selectedIndices.indexOf(i) !== -1;
  if (isSelected) {
    selectedIndices = selectedIndices.filter(index => index !== i);
  } else {
    selectedIndices.push(i);
    selectedIndices.sort((a, b) => a - b);
  }
  if (!indicesFormRange()) {
    selectedIndices = [i];
  }
  Array.from(document.getElementsByClassName('selected'))
  .forEach(e => e.classList.remove('selected'));
  for (const index of selectedIndices) {
    document.getElementById('index' + index).classList.add('selected');
  }
  renderButtons();
}

function render() {
  saveState();
  renderNumber();
  renderButtons();
  renderHistory();
}

nextButton.addEventListener('click', () => {
  opHistory = [];
  genNextNumber();
  render();
});

customNumberButton.addEventListener('click', () => {
  customNumberInput.classList.remove('hidden');
  customNumberButton.classList.add('hidden');
  customNumberInput.focus();
});

customNumberInput.addEventListener('change', (ev) => {
  opHistory = [];
  number = Number(ev.target.value);
  if (number > 1000000) {
    number = 1000000;
  }
  if (number < 0) {
    number = 0;
  }
  initialNumber = number;
  customNumberInput.value = '';
  customNumberInput.classList.add('hidden');
  customNumberButton.classList.remove('hidden');
  render();
});

undoButton.addEventListener('click', ev => {
  if (opHistory.length > 1) {
    const last = opHistory[opHistory.length-2].split('->');
    const lastNumber = Number(last[last.length-1]);
    number = lastNumber;
    opHistory.pop();
    render();
  } else if (opHistory.length) {
    number = initialNumber;
    opHistory.pop();
    render();
  }
});

// customNumberButton
// customNumberInput
document.addEventListener('DOMContentLoaded', () => {
  // Scrollbar.init(document.getElementById('history'));
});


loadState();
render();
