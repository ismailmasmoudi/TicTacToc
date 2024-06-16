// Array, das den Zustand der Felder speichert
let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

// Variable, um den aktuellen Spieler zu verfolgen
let currentPlayer = null;

// Variable, um den Status des Spiels zu verfolgen
let gameOver = false;

// Funktion zum Erstellen des SVG für den Kreis mit Animation
function createCircleSVG() {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const color = "rgb(0, 140, 255)";

    // Erstelle das SVG-Element
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");
    svg.setAttribute("viewBox", "0 0 70 70");

    // Erstelle den Kreis
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", "35");
    circle.setAttribute("cy", "35");
    circle.setAttribute("r", "30");
    circle.setAttribute("stroke", color);
    circle.setAttribute("stroke-width", "5");
    circle.setAttribute("fill", "none");

    // Füge eine Animations-Tag für das Zeichnen des Kreises hinzu
    const animate = document.createElementNS(svgNamespace, "animate");
    animate.setAttribute("attributeName", "r");
    animate.setAttribute("from", "0");
    animate.setAttribute("to", "30");
    animate.setAttribute("dur", "0.125s");
    animate.setAttribute("fill", "freeze");
    circle.appendChild(animate);

    // Füge den Kreis zum SVG-Element hinzu
    svg.appendChild(circle);

    return svg.outerHTML;
}

// Funktion zum Erstellen des SVG für das Kreuz mit Animation
function createCrossSVG() {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const color = "yellow";

    // Erstelle das SVG-Element
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");
    svg.setAttribute("viewBox", "0 0 70 70");

    // Erstelle die erste Linie des Kreuzes
    const line1 = document.createElementNS(svgNamespace, "line");
    line1.setAttribute("x1", "10");
    line1.setAttribute("y1", "10");
    line1.setAttribute("x2", "60");
    line1.setAttribute("y2", "60");
    line1.setAttribute("stroke", color);
    line1.setAttribute("stroke-width", "5");

    // Erstelle die zweite Linie des Kreuzes
    const line2 = document.createElementNS(svgNamespace, "line");
    line2.setAttribute("x1", "60");
    line2.setAttribute("y1", "10");
    line2.setAttribute("x2", "10");
    line2.setAttribute("y2", "60");
    line2.setAttribute("stroke", color);
    line2.setAttribute("stroke-width", "5");

    // Füge Animations-Tags für das Zeichnen der Linien hinzu
    const animateLine1 = document.createElementNS(svgNamespace, "animate");
    animateLine1.setAttribute("attributeName", "x2");
    animateLine1.setAttribute("from", "10");
    animateLine1.setAttribute("to", "60");
    animateLine1.setAttribute("dur", "0.125s");
    animateLine1.setAttribute("fill", "freeze");
    line1.appendChild(animateLine1);

    const animateLine2 = document.createElementNS(svgNamespace, "animate");
    animateLine2.setAttribute("attributeName", "x2");
    animateLine2.setAttribute("from", "60");
    animateLine2.setAttribute("to", "10");
    animateLine2.setAttribute("dur", "0.125s");
    animateLine2.setAttribute("fill", "freeze");
    line2.appendChild(animateLine2);

    // Füge beide Linien zum SVG-Element hinzu
    svg.appendChild(line1);
    svg.appendChild(line2);

    return svg.outerHTML;
}


// Funktion zum Verarbeiten des Klicks auf eine Zelle
function handleCellClick(index, cell) {
    if (gameOver) {
        return;
    }

    if (currentPlayer === null) {
        alert('Bitte wählen Sie zuerst einen Spieler (Kreis oder Kreuz).');
        return;
    }

    if (fields[index] === null) {
        if (currentPlayer === 'circle') {
            fields[index] = 'circle';
            cell.innerHTML = createCircleSVG();
            currentPlayer = 'cross';
            updatePlayerSelection();
        } else {
            fields[index] = 'cross';
            cell.innerHTML = createCrossSVG();
            currentPlayer = 'circle';
            updatePlayerSelection();
        }
        cell.onclick = null; // Entferne das onclick-Attribut nach dem Klick
        checkForWin();
    }
}

// Funktion zum Überprüfen auf Gewinn
function checkForWin() {
    // Gewinnkombinationen definieren
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Durchlaufe alle Gewinnkombinationen
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        // Überprüfe, ob alle Felder der Kombination den gleichen Wert haben
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Gewinnkombination gefunden, markiere die entsprechenden Zellen
            drawWinningLine(combination);
            gameOver = true;
            alert(`Spieler ${fields[a] === 'circle' ? 'Kreis' : 'Kreuz'} hat gewonnen!`);
            showRestartButton();
            return;
        }
    }

    // Überprüfen, ob das Spiel unentschieden ist
    if (!fields.includes(null)) {
        gameOver = true;
        alert('Unentschieden!');
        showRestartButton();
    }
}

// Funktion zum Zeichnen der Gewinnlinie
function drawWinningLine(combination) {
    const table = document.querySelector('table');
    const startCell = table.rows[Math.floor(combination[0] / 3)].cells[combination[0] % 3];
    const endCell = table.rows[Math.floor(combination[2] / 3)].cells[combination[2] % 3];
    
    const line = document.createElement('div');
    line.classList.add('winning-line');

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const x1 = startRect.left + startRect.width / 2;
    const y1 = startRect.top + startRect.height / 2;
    const x2 = endRect.left + endRect.width / 2;
    const y2 = endRect.top + endRect.height / 2;

    line.style.width = Math.hypot(x2 - x1, y2 - y1) + 'px';
    line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`;
    line.style.left = x1 + 'px';
    line.style.top = y1 + 'px';

    document.body.appendChild(line);
}

// Funktion zum Auswählen eines Spielers
function selectPlayer(player) {
    if (gameOver) {
        return;
    }

    currentPlayer = player;
    updatePlayerSelection();
}

// Funktion zum Aktualisieren der Spielerwahl-Anzeige
function updatePlayerSelection() {
    document.getElementById('selectCircle').classList.remove('selected');
    document.getElementById('selectCross').classList.remove('selected');

    if (currentPlayer === 'circle') {
        document.getElementById('selectCircle').classList.add('selected');
    } else if (currentPlayer === 'cross') {
        document.getElementById('selectCross').classList.add('selected');
    }
}

// Funktion zum Rendern der Tabelle
function render() {
    // Div-Container mit der ID 'content' finden
    const contentDiv = document.getElementById('content');
    
    // HTML-Code für die Tabelle erstellen
    let tableHTML = '<table>';
    
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const cellValue = fields[index];
            tableHTML += `<td onclick="handleCellClick(${index}, this)">`;
            if (cellValue === 'circle') {
                tableHTML += createCircleSVG();
            } else if (cellValue === 'cross') {
                tableHTML += createCrossSVG();
            }
            tableHTML += '</td>';
        }
        tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    
    // Den HTML-Code in den Div-Container einfügen
    contentDiv.innerHTML = tableHTML;
}

// Funktion zum Anzeigen des Neustart-Buttons
function showRestartButton() {
    const contentDiv = document.getElementById('content');
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Neustart';
    restartButton.onclick = resetGame;
    restartButton.classList.add('restart-button');
    contentDiv.appendChild(restartButton);
}

// Funktion zum Zurücksetzen des Spiels
function resetGame() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    currentPlayer = null;
    gameOver = false;
    document.querySelectorAll('.winning-line').forEach(line => line.remove());
    render();
    updatePlayerSelection();
}

// Initiales Rendern der Tabelle
render();
