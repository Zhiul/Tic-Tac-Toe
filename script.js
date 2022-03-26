const gameBoard = (() =>{
    const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const updateRows = () =>[
        gameBoard.cells.slice(0, 3),
        gameBoard.cells.slice(3, 6),
        gameBoard.cells.slice(6)
    ]

    const updateCols = () =>[
        [0, 3, 6].map(x=>gameBoard.cells[x]),
        [1, 4, 7].map(x=>gameBoard.cells[x]),
        [2, 5, 8].map(x=>gameBoard.cells[x])
    ]

    const updateDiagonals = () =>[
        [0, 4, 8].map(x=>gameBoard.cells[x]),
        [2, 4, 6].map(x=>gameBoard.cells[x]),
    ]

    function updateCellsValues(){
        gameBoard.rows = updateRows();
        gameBoard.cols = updateCols();
        gameBoard.diagonals = updateDiagonals();
    }

    let rows, cols, diagonals;

    const cellsElementsContainers = document.querySelectorAll('.game-board > div');
    const cellsElements = document.querySelectorAll('.cell')

    let checkThreeInLine = () =>{
        const allEqual = arr => arr.every( v => v === arr[0])
        const isThreeInLine = (currentValue) => allEqual(currentValue) === true;
        if(gameBoard.cols.some(isThreeInLine) || gameBoard.rows.some(isThreeInLine)
        || gameBoard.diagonals.some(isThreeInLine)){
         gameMode.gameIsFinished = true;
         return true;
     } else{
         return false;
     }
    }

    function checkIfIsAtie(){
        const allsCellsFull = arr => arr.every( v => isNaN(v) === true)
        if(allsCellsFull(gameBoard.cells) === true && checkThreeInLine() === false){
            gameMode.gameIsFinished = true;
            gameMode.winner = 'none';
            return true
        } else return false;
    }

    function checkIfGameHasEnded(){
        checkThreeInLine();
        checkIfIsAtie();
    }

    const handlers = [];

    const play = (player) =>{
        cellsElementsContainers.forEach(cell => {
            cell.addEventListener('click', handlers[player.mark] = playerMarks)
        })

        function playerMarks(){
            if (isNaN(gameBoard.cells[this.firstChild.dataset.cell]) === false){
                gameBoard.cells[this.firstChild.dataset.cell] = player.mark;
                display();

                cellsElementsContainers.forEach(cell => {
                    cell.removeEventListener('click', playerMarks)
                })

                updateCellsValues();
                checkIfGameHasEnded();
            
                gameMode.turn();
            }
        }

        player.turn = false;
    }

    function removeEventListeners(){
        cellsElementsContainers.forEach(cell => {
            cell.removeEventListener('click', handlers.X)
        })
        cellsElementsContainers.forEach(cell => {
            cell.removeEventListener('click', handlers.O)
        })
    }

    const display = () =>{
        for(i = 0; i < gameBoard.cells.length; i++){
                if (gameMode.gameIsFinished === false){
                    if (gameBoard.cells[i] === 'X' || gameBoard.cells[i] === 'O'){
                        gameBoard.cellsElements[i].style.backgroundImage = `url('./assets/${gameBoard.cells[i].toLowerCase()}.svg')`
                        if(gameBoard.cells[i] === 'X'){
                            gameBoard.cellsElements[i].style.filter = 'invert(51%) sepia(97%) saturate(3801%) hue-rotate(181deg) brightness(105%) contrast(104%)'
                        } else{
                            gameBoard.cellsElements[i].style.filter = 'invert(9%) sepia(98%) saturate(6539%) hue-rotate(3deg) brightness(99%) contrast(107%)'
                        }
                        gameBoard.cellsElements[i].style.transform = 'scale(1)'
                    }
                } else{
                    gameBoard.cellsElements[i].style.transform = 'scale(0)';
                }
            }
    }

      function winning(board, player){
        if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
        return true;
        } else {
        return false;
        }
       }

       function emptyIndexies(board){
        return  board.filter(s => s != "O" && s != "X");
      }

       function minimax(newBoard, player){
        let availSpots = emptyIndexies(newBoard);

        let huPlayer = gameComputer.player1.mark;
        let aiPlayer = gameComputer.player2.mark;

        if (winning(newBoard, huPlayer)){
            return {score:-10};
         }
           else if (winning(newBoard, aiPlayer)){
           return {score:10};
           }
         else if (availSpots.length === 0){
             return {score:0};
         }

         var moves = [];

         for (var i = 0; i < availSpots.length; i++){
             let move = {};
             move.index = newBoard[availSpots[i]];
     
             newBoard[availSpots[i]] = player;
     
             if (player == aiPlayer){
             let result = minimax(newBoard, huPlayer);
             move.score = result.score;
             }
             else{
             let result = minimax(newBoard, aiPlayer);
             move.score = result.score;
             }
     
             newBoard[availSpots[i]] = move.index;
     
             moves.push(move);
         }

         let bestMove;


         if(player === aiPlayer && gameComputer.difficulty !== 'Easy'){
           let bestScore = -10000;
           for(let i = 0; i < moves.length; i++){
             if(moves[i].score > bestScore){
               bestScore = moves[i].score;
               bestMove = i;
             }
           }
         } 
         else{
           let bestScore = 10000;
           for(let i = 0; i < moves.length; i++){
             if(moves[i].score < bestScore){
               bestScore = moves[i].score;
               bestMove = i;
             }
           }
         }
         return moves[bestMove];
       }

    return{cells, rows, cols, diagonals, updateCellsValues, cellsElements, checkIfGameHasEnded, checkIfIsAtie, display, play, minimax, emptyIndexies, removeEventListeners}
})();

const playerFactory = (name, mark) =>{
    const wins = 0;
    const turn = true;
    return{name, mark, wins, turn};
};

let player1;
let player2;

const game = (mode) =>{
     const gameIsFinished = false;
     let setWinner = (player) => player.name;
     let winner;
     let turn;
     let player1;
     let player2;

     if(mode === 'local'){
        turn = () =>{
            if (gameLocal.gameIsFinished === false){
                if(gameLocal.player1.turn === true){
                    gameBoard.play(gameLocal.player1)
                    gameLocal.player2.turn = true;
                } else{
                    gameBoard.play(gameLocal.player2)
                    gameLocal.player1.turn = true;
                }
            } else if(gameLocal.gameIsFinished === true && gameBoard.checkIfIsAtie() === false){
                if (gameLocal.player1.turn === false){
                    gameLocal.winner = setWinner(gameLocal.player1);
                    gameLocal.player1.wins += 1;
                    firstPlayerVictories.textContent = gameLocal.player1.wins;
                    displayWinner();
                } else{
                    gameLocal.winner = setWinner(gameLocal.player2);
                    gameLocal.player2.wins += 1;
                    secondPlayerVictories.textContent = gameLocal.player2.wins;
                    displayWinner();
                } 
            } else{
                displayWinner();
            }
        };

     } else if(mode === 'computer'){
            turn = () =>{
            if (gameComputer.gameIsFinished === false){
                if(gameComputer.player1.turn === true){
                    gameBoard.play(gameComputer.player1)
                } else{
                    if(gameComputer.difficulty === 'Normal'){
                        function randomIntFromInterval(min, max) { // min and max included 
                            return Math.floor(Math.random() * (max - min + 1) + min)
                          }
            
                        let randomPlay = randomIntFromInterval(1, 100);
            
                        if (randomPlay > 80){
                            const availableIndixies = gameBoard.emptyIndexies(gameBoard.cells);
                            computerCell = availableIndixies[Math.floor(Math.random() * availableIndixies.length)];
                        } else{
                            computerCell = gameBoard.minimax(gameBoard.cells, gameComputer.player2.mark).index;
                        }
                    } else{
                        computerCell = gameBoard.minimax(gameBoard.cells, gameComputer.player2.mark).index;
                    }
                    setTimeout(() => {
                        gameBoard.cells[computerCell] = gameComputer.player2.mark;
                        gameBoard.display();
                        gameBoard.updateCellsValues();
                        gameBoard.checkIfGameHasEnded();
                        gameComputer.player1.turn = true;
                        gameComputer.turn();
                    }, 170);

                }
            } else if(gameComputer.gameIsFinished === true && gameBoard.checkIfIsAtie() === false){
                if (gameComputer.player1.turn === false){
                    gameComputer.winner = setWinner(gameComputer.player1);
                    gameComputer.player1.wins += 1;
                    firstPlayerVictories.textContent = gameComputer.player1.wins;
                    displayWinner();
                } else{
                    gameComputer.winner = setWinner(gameComputer.player2);
                    gameComputer.player2.wins += 1;
                    secondPlayerVictories.textContent = gameComputer.player2.wins;
                    displayWinner();
                } 
            } else{
                displayWinner();
            }
        }  
    }

    const startNewRound = () =>{
        gameMode.gameIsFinished = true;
        gameBoard.display();
        gameMode.gameIsFinished = false;
        gameBoard.cells = [...Array(9).keys()];
        gameBoard.updateCellsValues();
        gameMode.player1.turn = true;
        gameMode.turn();
    }

    return{gameIsFinished, turn, winner, startNewRound, player1, player2}
};

const gameLocal = game('local');
const gameComputer = game('computer');

const main = document.querySelector('main');
const displayWinnerElement = document.querySelector('#display-winner');
const gameResult = document.querySelector('#game-result')
const selectModeContainer = document.querySelector('.select-mode');
const selectModeButtons = document.querySelectorAll('.mode-button');

const localModeButton = document.querySelector('#local-mode');
const computerModeButton = document.querySelector('#computer-mode');

const firstPlayerName = document.querySelector('#first-player-name');
const firstPlayerNameInput = document.querySelector('#first-player');
const firstPlayerNameSet = document.querySelector('#set-first-player-name');

const firstPlayerNameComputer = document.querySelector('#first-player-name-computer');
const firstPlayerNameInputComputer = document.querySelector('#first-player-computer');
const firstPlayerNameSetComputer = document.querySelector('#set-first-player-computer-name');

const playerMarkXName = document.querySelector('.player-mark-x-name');
const firstPlayerVictories = document.querySelector('.x-victories');

const secondPlayerName = document.querySelector('#second-player-name');
const secondPlayerNameInput = document.querySelector('#second-player');
const secondPlayerNameSet = document.querySelector('#set-second-player-name');

const playerMarkOName = document.querySelector('.player-mark-o-name');
const secondPlayerVictories = document.querySelector('.o-victories');

const playerNameInputs = document.querySelectorAll('.player-name-input');

function displayWinner(){
    if (gameMode.winner != 'none'){
        gameResult.textContent = `${gameMode.winner} wins!`
    } else{
        gameResult.textContent = `It's a tie`;
    }

    document.body.style.overflow = 'hidden';
    displayWinnerElement.style.opacity = '1';
    displayWinnerElement.style.pointerEvents = 'all';
}

playerNameInputs.forEach(playerNameInput =>{
    playerNameInput.addEventListener('focus', () =>{
        playerNameInput.style.setProperty('--s', 'translateY(-5px) scale(0)');
    })
})

displayWinnerElement.addEventListener('click', () =>{
    gameMode.startNewRound();
    displayWinnerElement.style.opacity = '0';
    displayWinnerElement.style.pointerEvents = 'none';
    document.body.style.overflow = 'visible';
})

selectModeButtons.forEach(button =>{
    button.addEventListener('click', () =>{
        button.classList.add('pressed');
        setTimeout(() =>{
            button.classList.remove('pressed');
        }, 100)
        setTimeout(() =>{
            selectModeContainer.style.opacity = '0';
        }, 120)
        setTimeout(() =>{
            selectModeContainer.style.display = 'none';
        }, 170)
    })
})

localModeButton.addEventListener('click', () =>{
    gameMode = gameLocal;
    setTimeout(() =>{
        firstPlayerName.style.display = 'flex';
        firstPlayerName.style.opacity = '1';
    }, 170)
})

computerModeButton.addEventListener('click', () =>{
    gameMode = gameComputer;
    setTimeout(() =>{
        firstPlayerNameComputer.style.display = 'flex';
        firstPlayerNameComputer.style.opacity = '1';
    }, 170)
})

firstPlayerNameSetComputer.addEventListener('click', () =>{
    if (firstPlayerNameInputComputer.value != ''){
        gameComputer.player1 = playerFactory(`${firstPlayerNameInputComputer.value}`,'X');
        firstPlayerNameInputComputer.value = '';
        gameComputer.player2 = playerFactory('Computer', 'O');
        gameComputer.difficulty = 'Normal'
        playerMarkXName.textContent = gameComputer.player1.name;
        playerMarkOName.textContent = gameMode.player2.name;
        
        setTimeout(() =>{
            firstPlayerNameComputer.style.opacity = '0';
        }, 100)

        setTimeout(() =>{
            firstPlayerNameComputer.style.display = 'none';
            customSelectDifficulty.style.display = 'block';
            goBack.style.display = 'block';
            goBack.style.opacity = '1';
            main.style.display = 'block';
            main.style.opacity = '1';
            gameMode.startNewRound();
        }, 200)

    } else{
        firstPlayerNameInputComputer.style.setProperty('--s', 'translateY(-5px) scale(1)');
    }
})

firstPlayerNameSet.addEventListener('click', () =>{
    if (firstPlayerNameInput.value != ''){
        gameLocal.player1 = playerFactory(`${firstPlayerNameInput.value}`,'X');
        firstPlayerNameInput.value = '';
        playerMarkXName.textContent = gameLocal.player1.name;
        setTimeout(() =>{
            firstPlayerName.style.opacity = '0';
        }, 100)
        setTimeout(() =>{
            firstPlayerName.style.display = 'none';
            secondPlayerName.style.display = 'flex';
            secondPlayerName.style.opacity = '1';
        }, 200)
    } else{
        firstPlayerNameInput.style.setProperty('--s', 'translateY(-5px) scale(1)');
    }
})

secondPlayerNameSet.addEventListener('click', () =>{
    if (secondPlayerNameInput.value != ''){
        gameLocal.player2 = playerFactory(`${secondPlayerNameInput.value}`,'O');
        secondPlayerNameInput.value = '';
        playerMarkOName.textContent = gameMode.player2.name;
        gameLocal.player1.wins = 0;
        gameLocal.player2.wins = 0;
        setTimeout(() =>{
            secondPlayerName.style.opacity = '0';
        }, 100)
        setTimeout(() =>{
            secondPlayerName.style.display = 'none';
            goBack.style.display = 'block';
            goBack.style.opacity = '1';
            main.style.display = 'block';
            main.style.opacity = '1';
            gameMode.startNewRound();
        }, 200)
    } else{
        secondPlayerNameInput.style.setProperty('--s', 'translateY(-5px) scale(1)');
    }
})

// Custom Select

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    if(selectDifficulty.value === '1'){
        gameComputer.difficulty = 'Easy'
    } else if(selectDifficulty.value === '2'){
        gameComputer.difficulty = 'Normal'
    } else if(selectDifficulty.value === '3'){
        gameComputer.difficulty = 'Unbeatable'
    }
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

const selectDifficulty = document.querySelector('.custom-select select')
const customSelectDifficulty = document.querySelector('.custom-select')
const goBack = document.querySelector('#go-back');

// Go back button

goBack.addEventListener('click', returnToMainMenu)

function returnToMainMenu(){
    gameBoard.removeEventListeners();
    customSelectDifficulty.style.display = 'none';
    gameMode.gameIsFinished = true;
    main.style.opacity = '0';
    firstPlayerVictories.textContent = '';
    secondPlayerVictories.textContent = '';
    setTimeout(() =>{
        main.style.display = 'none';
        selectModeContainer.style.display = 'flex';
        selectModeContainer.style.opacity = '1';
        goBack.style.opacity = '0';
    }, 100)
    setTimeout(() =>{
        goBack.style.display = 'none'; 
    })
}



