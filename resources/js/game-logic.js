let gameState = {
    activePlayer: 'blue',
    winner: '',
    loser: '',
    defaultGameBoardSize: [5, 6]
}

let gameBoard = createGameBoardArray(gameState.defaultGameBoardSize);

updatePlayerTurnText();
console.table(gameBoard);

function updatePlayerTurnText() {
    let $playerText = $('.active-player .player');
    if (gameState.activePlayer === 'red') {
        $playerText.removeClass('blue');
        $playerText.addClass('red');
    }
    else if (gameState.activePlayer === 'blue') {
        $playerText.removeClass('red');
        $playerText.addClass('blue');
    };
    $playerText.text(`${gameState.activePlayer}`);
    $('.active-player .description').text(`player's turn.`);
}

function createGameBoardArray(rowColArray) {
    let rows = rowColArray[0];
    let columns = rowColArray[1];
    let output = [];
    for (i = 0; i < rows; i++) {
        output.push([]);
        for (j = 0; j < columns; j++) {
            output[i].push('');
        };
    };
    return output;
};

function dropPiece(column, startHeight) {
    for (row = gameBoard.length-1; row > -1; row--) {
        if (gameBoard[row][column] === '') {
            gameBoard[row][column] = gameState.activePlayer;
            console.table(gameBoard);
            let updatedCell = updateGameBoardUI();
            let cellOriginalPosition = $(updatedCell).find('.piece')[0].getBoundingClientRect().top;
            $(updatedCell).find('.piece')[0].style.top = `${startHeight}px`;
            $(updatedCell).find('.piece').removeClass('hidden');
            $(updatedCell).find('.piece').animate({
                top: `${cellOriginalPosition}px`
            },
            {
                duration: 800,
                easing: 'easeOutBounce'
            });
            setTimeout(function() {
                $(updatedCell).find('.piece')[0].style = '';
            }, 850);
            switchPlayerTurn();
            updatePlayerTurnText();
            checkWinner();
            return true;
        }
        else if (row === 0) {
            console.error(`Column ${column} is already full. Please try another column.`);
            return false;
        };
    };
};

function switchPlayerTurn() {
    if (gameState.activePlayer === 'red') {
        gameState.activePlayer = 'blue';
        $('.active-player p').text(`Active player is ${gameState.activePlayer}.`);
        return true;
    }
    else if (gameState.activePlayer === 'blue') {
        gameState.activePlayer = 'red';
        $('.active-player p').text(`Active player is ${gameState.activePlayer}.`);
        return true;
    }
    else {
        $('.active-player p').text('There is no active player.');
        return false;
    }
};

function checkHorizontal() {
    for (row = 0; row < gameBoard.length; row++) {
        let result = checkFourInARow(gameBoard[row]);
        if (result) {
            return result;
        };
    };
    return false;
};

function checkVertical() {
    let gameBoardRowLength = gameBoard[0].length;
    for (col = 0; col < gameBoardRowLength; col++) {
        let result = checkFourInARow(getColumnArray(col));
        if (result) {
            return result;
        };
    };
    return false;
};

function checkDiagonal() {
    let gameBoardRowWidth = gameBoard[0].length;
    let gameBoardColHeight = getColumnArray(0).length;
    let startValue, colDiagonalArray = [], rowDiagonalArray = [];
    // Diagonal Forward
    for (col = 0; col < gameBoardColHeight; col++) {
        if (colDiagonalArray.length >= 4) {
            let result = checkFourInARow(colDiagonalArray);
            if (result) {
                return checkFourInARow(colDiagonalArray);
            };
        };
        colDiagonalArray = [];
        startValue = col;
        for (row = 0; row < gameBoardRowWidth; row++) {
            if (startValue < gameBoardColHeight) {
                if (gameBoard[startValue][row]) {
                    colDiagonalArray.push(gameBoard[startValue][row]);
                };
            };
            startValue++;
        }
    };
    for (row = 0; row < gameBoardRowWidth; row++) {
        if (rowDiagonalArray.length >= 4) {
            let result = checkFourInARow(rowDiagonalArray);
            if (result) {
                return checkFourInARow(rowDiagonalArray);
            };
        };
        rowDiagonalArray = [];
        startValue = row;
        for (col = 0; col < gameBoardColHeight; col++) {
            if (startValue < gameBoardRowWidth) {
                if (gameBoard[col][startValue]) {
                    rowDiagonalArray.push(gameBoard[col][startValue]);
                }
            };
            startValue++;
        }
    };
    // Diagonal Reverse
    for (col = gameBoardColHeight-1; col >= 0; col--) {
        if (colDiagonalArray.length >= 4) {
            let result = checkFourInARow(colDiagonalArray);
            if (result) {
                return checkFourInARow(colDiagonalArray);
            };
        };
        colDiagonalArray = [];
        startValue = col;
        for (row = gameBoardRowWidth-1; row >= 0; row--) {
            if (startValue >= 0) {
                if (gameBoard[startValue][row]) {
                    colDiagonalArray.push(gameBoard[startValue][row]);
                };
            };
            startValue--;
        }
    };
    for (row = gameBoardRowWidth-1; row >= 0; row--) {
        if (rowDiagonalArray.length >= 4) {
            let result = checkFourInARow(rowDiagonalArray);
            if (result) {
                return checkFourInARow(rowDiagonalArray);
            };
        };
        rowDiagonalArray = [];
        startValue = row;
        for (col = gameBoardColHeight-1; col >= 0; col--) {
            if (startValue >= 0) {
                if (gameBoard[col][startValue]) {
                    rowDiagonalArray.push(gameBoard[col][startValue]);
                };
            }
            startValue--;
        }
    };
    return false;
};

function checkFourInARow(array) {
    if (typeof array === 'object') {
        let same = { count: 0, value: '' };
        for (i in array) {
            if (array[i] === same.value) {
                same.value = array[i];
                same.count++;
                if (same.count === 4) {
                    return same.value;
                };
            }
            else {
                same.value = array[i];
                same.count = 1;
            };
        };
        return false;
    }
    else {
        return false;
    }
};

function getColumnArray(index) {
    let output = [];
    gameBoard.forEach(innerArray => {
        output.push(innerArray[index]);
    });
    return output;
}

function checkWinner() {
    let horizontalResult = checkHorizontal();
    let verticalResult = checkVertical();
    let diagonalResult = checkDiagonal();
    if (horizontalResult) {
        alert(`Player ${horizontalResult} wins!`);
        $('.game-board .firstRow .cell').off();
        $('.piece.hover').remove();
    }
    else if (verticalResult) {
        alert(`Player ${verticalResult} wins!`);
        $('.game-board .firstRow .cell').off();
        $('.piece.hover').remove();
    }
    else if (diagonalResult) {
        alert(`Player ${diagonalResult} wins!`);
        $('.game-board .firstRow .cell').off();
        $('.piece.hover').remove();
    };
};

function createGameBoardUI(rowColArray) {
    let rows = rowColArray[0];
    let columns = rowColArray[1];

    let newRow = $('<div class="row flex"></div>');
    let cells = '';
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            cells += '<div class="cell flex ai-c jc-c"></div>'
        };
        if (i === 0) {
            newRow.addClass('firstRow');
        }
        newRow.append($(cells));
        $('.game-board').append(newRow);
        newRow = $('<div class="row flex"></div>');
        cells = '';
    };
};

createGameBoardUI(gameState.defaultGameBoardSize);

function updateGameBoardUI() {
    let updatedCell;
    $('.game-board .row').toArray().forEach((row, rIndex) => {
        $(row).children().toArray().forEach((cell, cIndex) => {
            let newPiece = $(`<div class="piece ${gameBoard[rIndex][cIndex]} hidden" style="position: absolute"></div>`);
            console.log(gameBoard[rIndex][cIndex], cell.children.length);
            if (gameBoard[rIndex][cIndex] && !cell.children.length) {
                $(cell).append(newPiece);
                updatedCell = cell;
            };
        });
    });
    return updatedCell;
};

$('.game-board .firstRow .cell').mouseenter(function() {
    console.log(this.children[0]);
    let newPiece = $(`<div class="piece ${gameState.activePlayer} hover"></div>`);
    $(this).append(newPiece);
});

$('.game-board .firstRow .cell').click(function() {
    let element = this;
    let count = 0;
    while (element.previousSibling) {
        element = element.previousSibling;
        count++;
    };
    $('.piece.hover').removeClass(gameState.activePlayer);
    let startHeight = this.getBoundingClientRect().top;
    dropPiece(count, startHeight);
    $('.piece.hover').addClass(gameState.activePlayer);
});

$('.game-board .firstRow .cell').mouseleave(function() {
    $('.piece.hover').remove();
});