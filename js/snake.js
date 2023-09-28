// Selección de elementos del DOM
const playBoard = document.querySelector(".play-board");  // Tablero de juego
const scoreElement = document.querySelector(".score");    // Elemento para mostrar la puntuación actual
const highScoreElement = document.querySelector(".high-score"); // Elemento para mostrar la puntuación más alta
const cooldownElement = document.getElementById("cooldownSkill"); // Elemento para el enfriamiento de la habilidad
const instructionsModal = document.getElementById("instructionsModal"); // Elemento donde se muestran las instrucciones
const showInstructionsButton = document.getElementById("showInstructions"); // Botón para mostrar las instrucciones
const closeModalButton = document.getElementById("closeModal"); // Botón para cerrar las instrucciones
const modalGameover = document.getElementById("modalGameover"); // Elemento donde se muestra el mensaje de fin de juego
const closeModalGameoverButton = document.getElementById("closeModalGameover"); // Botón para cerrar mensaje de fin de juego y volver a jugar

// Variables de estado del juego
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0; // Obtener la puntuación más alta almacenada o 0 si no hay ninguna
highScoreElement.innerHTML = `High Score: ${highScore}`; // Muestra la puntuación mas alta
let originalInterval = 65; // Velocidad original de la serpiente
let currentInterval = originalInterval; // Velocidad actual de la serpiente
let speedIncrementActive = true; // Variable para controlar el incremento de velocidad

// Función para mostrar el modal de instrucciones
const showInstructionsModal = () => {
    instructionsModal.style.display = "block";
}

// Función para cerrar el modal de instrucciones
const closeModal = () => {
    instructionsModal.style.display = "none";
}

// Función para cerrar el modal de fin de juego y recargar la página
const closeModalGameover = () => {
    modalGameover.style.display = "none";
    location.reload();
}

// Genera una nueva posición para la comida
const changFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Maneja el final del juego
const handleGameOver = () => {
    clearInterval(setIntervalId);
    modalGameover.style.display = "block";
}

// Maneja los controles del juego
const controls = (e) => {
    // Cambia la dirección de la serpiente según la tecla presionada
    if (e.key === "ArrowUp" && velocityY != 1 || e.key === "w" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY != -1 || e.key === "s" && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX != 1 || e.key === "a" && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX != -1 || e.key === "d" && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (speedIncrementActive && e.key === " ") { // Activa la habilidad de incremento de velocidad
            speedIncrementActive = false;
            cooldownElement.classList.remove('speed-enable');
            cooldownElement.classList.add('speed-disable');
            currentInterval = originalInterval / 2;
            setGameInterval();

            // Volver a la velocidad original después de 4 segundos
            setTimeout(() => {
                currentInterval = originalInterval;
                setGameInterval();
            }, 4000);

            // Reiniciar la habilidad después de 16 segundos
            setTimeout(() => {
                speedIncrementActive = true;
                cooldownElement.classList.remove('speed-disable');
                cooldownElement.classList.add('speed-enable');
            }, 16000);
        }
}

// Inicializa el juego
const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) { // Comprueba si la serpiente ha alcanzado la comida
        changFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore; // Actualiza la puntuación más alta
        localStorage.setItem("high-score", highScore); // Guarda la puntuación más alta en el almacenamiento local
        scoreElement.innerHTML = `Score: ${score}`; // Muestra la puntuación actual
        highScoreElement.innerHTML = `High Score: ${highScore}`; // Muestra la nueva puntuación mas alta
    }

    // Actualiza la posición del cuerpo de la serpiente
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Comprueba si la cabeza de la serpiente colisiona con su cuerpo
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup; // Actualiza el tablero de juego con el HTML generado
}

// Configura el intervalo de juego
const setGameInterval = () => {
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, currentInterval);
}

changFoodPosition(); // Genera la posición inicial de la comida
setGameInterval(); // Inicia el intervalo del juego
document.addEventListener("keydown", controls); // Escucha los eventos de teclado
showInstructionsButton.addEventListener("click", showInstructionsModal); // Muestra el modal de instrucciones
closeModalButton.addEventListener("click", closeModal); // Cierra el modal de instrucciones
closeModalGameoverButton.addEventListener("click", closeModalGameover); // Cierra el modal de fin de juego

