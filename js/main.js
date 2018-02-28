window.onload = function () {

    /** Definicion de las variables */
    var canvas = undefined;
    var ctx = undefined;
    var x = undefined;
    var y = undefined;
    var dx = undefined;
    var dy = undefined;

    var ballRadius = undefined;

    var paddleHeight = undefined;
    var paddleWidth = undefined;
    var paddleX = undefined;

    var rightPressed = false;
    var leftPressed = false;

    var intervalo = undefined;

    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 100;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var bricks = [];

    var score = 0;

    _init();

    /**
    * Se ejecuta al cargar la página. Inicializa los botones del menu
    */
    function _init() {
        var start_button = document.getElementById('start-button');
        start_button.addEventListener("click", startGame, false);
    }

    /**
    * Se ejecuta cuando se pulsa el boton START.
    * Inicializa las variables del juego.
    */
    function startGame() {
        // Oculta el menu
        var game_container = document.getElementById('main-menu');
        game_container.style.display = 'none';

        // Oculta el menu de game over
        var game_over_menu = document.getElementById('game-over-menu-container');
        game_over_menu.style.display = 'none';

        // Oculta el menu de win game
        var game_over_menu = document.getElementById('win-game-menu-container');
        game_over_menu.style.display = 'none';

        // Muestra el area de juego
        var game_container = document.getElementById('game-container');
        game_container.style.display = 'block';

        // Events listener de los botones
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        // Inicializa las variables del juego
        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext("2d");
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;

        ballRadius = 10;

        paddleHeight = 10;
        paddleWidth = 75;
        paddleX = (canvas.width - paddleWidth) / 2;

        rightPressed = false;
        leftPressed = false;

        intervalo = setInterval(draw, 15);

        /* Mete los ladrillos en una matriz */
        for (c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        // Inicializamos el contador
        score = 0;
    }

    /**
    * Dibuja los ladrillos
    */
    function drawBricks() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#00F700";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    /**
    * Pinta la bola
    */
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#00F700";
        ctx.fill();
        ctx.closePath();
    }

    /**
    * Pinta la pala
    */
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#00F700";
        ctx.fill();
        ctx.closePath();
    }

    /**
    * Pinta el recorrido de la bola
    */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPaddle(); // pinta la pala
        drawScore(); // pinta la puntuacion
        drawBricks(); // pinta los labdrillos
        drawBall(); // pinta la bola
        collisionDetection(); // detecta colisiones

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) { // Marco derecho y izquierdo
            dx = -dx;
        }

        if (y + dy < ballRadius) { // Marco superior
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) { // Marco inferior
            if (x > paddleX && x < paddleX + paddleWidth) { // Si choca con la pala
                dy = -dy;
            }
            else { // Si no choca la pala, GAME OVER
                _gameOver();
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    }

    /**
    * Funcion que se ejecuta cuando se pulsa la tecla
    */
    function keyDownHandler(e) {
        if (e.keyCode == 39) { // Flecha derecha
            rightPressed = true;
        }
        else if (e.keyCode == 37) { // Flecha izquierda
            leftPressed = true;
        }
    }

    /**
    * Funcion que se ejecuta cuando se suelta la tecla
    */
    function keyUpHandler(e) {
        if (e.keyCode == 39) { // Flecha derecha
            rightPressed = false;
        }
        else if (e.keyCode == 37) { // Flecha izquierda
            leftPressed = false;
        }
    }

    /** 
    * Detecta si la bola está en contacto con algun ladrillo y si es asi,
    * cambia el estado de este para borrarlo 
    */
    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;

                        if (score == brickRowCount * brickColumnCount) {
                            _youWin();
                        }
                    }
                }
            }
        }
    }

    /** Pinta el contador de la puntuacion en el canvas */
    function drawScore() {
        ctx.font = "16px Monospace";
        ctx.fillStyle = "#00F700";
        ctx.fillText("Score: " + score, 8, 20);
    }


    /** INTERFAZ */

    /**
     * Ir al menu principal
     */
    function _goToMenu() {
        // Muestra el menu principal
        var game_container = document.getElementById('main-menu');
        game_container.style.display = 'block';

        // Oculta el area de juego
        var game_container = document.getElementById('game-container');
        game_container.style.display = 'none';

        // oculta el menu game over
        var game_over_menu = document.getElementById('game-over-menu-container');
        game_over_menu.style.display = 'none';

        // oculta el menu win game
        var game_over_menu = document.getElementById('win-game-menu-container');
        game_over_menu.style.display = 'none';
    }

    /**
    * Fin del juego
    */
    function _gameOver() {
        clearInterval(intervalo);
        intervalo = undefined;

        var game_over_menu = document.getElementById('game-over-menu-container');
        game_over_menu.style.display = "block";

        var restart_button = document.getElementById('restart-button').addEventListener('click', startGame, false);
        var restart_button = document.getElementById('exit-button').addEventListener('click', _goToMenu, false);
    }

    /** 
    * Gana el juego
    */
    function _youWin() {
        clearInterval(intervalo);
        intervalo = undefined;

        var game_over_menu = document.getElementById('win-game-menu-container');
        game_over_menu.style.display = "block";

        var restart_button = document.getElementById('win-restart-button').addEventListener('click', startGame, false);
        var restart_button = document.getElementById('win-exit-button').addEventListener('click', _goToMenu, false);
    }

}