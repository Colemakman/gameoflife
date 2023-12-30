let startButton = document.querySelector('.start');
let resetButton = document.querySelector('.reset');
let inputField = document.querySelector('.dimension');
let randomButton = document.querySelector('.random');
let board = document.querySelector('.board');

class Square {
    constructor(status, num, obj) {
        this.status = status;

        this.num = num;
        this.x = Math.floor(num/DIMENSION) + 1;
        if (this.num % DIMENSION === 0) {
            this.x -= 1;
        }

        this.y = num % DIMENSION;
        if (this.y === 0) {
            this.y = DIMENSION;
        }

        this.neighbours = 0;

        this.obj = obj;
        this.obj.style.backgroundColor = "white";
    }
}

let grid = [];
let DIMENSION = 4

function changeGridDimension(dimension) {
    let r = document.querySelector(':root');
    r.style.setProperty("--size", `${100*(1/dimension)}%`);
    console.log("Size:", getComputedStyle(r).getPropertyValue('--size'));
    console.log(`${100*(1/dimension)}%`);
}



function getAllNeighbours() {
    grid.forEach(square => {
        square.neighbours = getNeighbours(square);
    });
}

function getNeighbours(square) {
    let neighbours = 0;
    let thisX = square.x;
    let thisY = square.y;

    const directions = [
        { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 0 }, /* Current square */ { dx: 1, dy: 0 },
        { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }
    ];

    directions.forEach(dir => {
        const newX = thisX + dir.dx;
        const newY = thisY + dir.dy;

        grid.forEach(square => {
            if (square.x === newX && square.y === newY && square.status === 1) {
                neighbours++;
            }
        });
    });

    return neighbours;
}

function colourDead() {
    grid.forEach(square => {
        if (square.status === 0) {
            square.obj.style.backgroundColor = '#234234';
        }
    });
}

function killLonely() {
    grid.forEach(square => {
        if (square.neighbours <= 1) {
            square.status = 0;
            square.obj.style.backgroundColor = "#234234";
        }
    });
}

function killPopulus() {
    grid.forEach(square => {
    if (square.neighbours >= 4) {
        square.status = 0;
        square.obj.style.backgroundColor = "#234234";
    }
    });
}

function populate() {
    grid.forEach(square => {
        if (square.status === 0 && square.neighbours === 3) {
            square.status = 3;
            square.obj.style.backgroundColor = "black";
        }
    });
}

function gameLoop() {
    hasStarted = true;
    getAllNeighbours();
    getAllNeighbours();
    killLonely();
    killPopulus();
    populate();
    colourDead();
}

let gameId;

startButton.addEventListener('click', () => {
    gameId = setInterval(gameLoop, 1000);
});

function reset() {
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    createGrid(DIMENSION);
    grid.forEach(square => {
        square.obj.style.backgroundColor = '#234234';
        square.status = 0;
        square.neighbours = 0;
    });

}

resetButton.addEventListener('click', () => {
    reset();
    clearInterval(gameId);
});

function createGrid(dimension) {
    changeGridDimension(dimension);
    grid = [];

    DIMENSION = dimension;

    for (let i = 1; i <= DIMENSION*DIMENSION; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        //square.innerText = i;
        board.appendChild(square);
        square.style.backgroundColor = "white";
    
        let ref = new Square(0, i, square);
        grid.push(ref);
    }
    

    grid.forEach(square => {
    if (square.neighbours <= 1) {
        square.status = 0;
        square.obj.style.backgroundColor = "#234234";
    }
    });

    grid.forEach(square => {
        square.obj.addEventListener('click', () => {
            square.obj.style.backgroundColor = "black";
            square.status = 1;
        });
    });
}

inputField.addEventListener('input', function() {
     if (Number(inputField.value) >= 1 && Number(inputField.value) <= 100) {
        changeGridDimension(Number(inputField.textContent));
        DIMENSION = Number(inputField.value);
        console.log([DIMENSION, inputField.value]);
        reset();
     }
     
});

randomButton.addEventListener('click', function() {
    let randomDensity = parseFloat(document.querySelector('.randomness').value) / 100;
    grid.forEach(square => {
        if (Math.random() < randomDensity) {
            console.log("HELLO");
            square.obj.style.backgroundColor = "black";
            square.status = 1;
        }
    });
});

createGrid(DIMENSION);