class GameView {
  constructor() {
      this.winnerMessage = document.querySelector('.winner-message');
      this.tiles = document.querySelectorAll('.board-tile');
      this.restartButton = document.querySelector('.restart');
      this.playerX = document.querySelector('.player-x');
      this.playerO = document.querySelector('.player-o');

      this.restartButton.addEventListener('click', () => {
          game.resetGame(); 
          this.updateBoard(game);
      });

      this.tiles.forEach((tile) => {
          tile.addEventListener('click', () => {
              onTileClick(parseInt(tile.dataset.index, 10));
          });
      });
  }

  updateBoard(game) {
      this.updateTurn(game);

      const winningCombination = game.findWinningCombination();

      this.tiles.forEach((tile, index) => {
          tile.classList.remove('tile-winner');

          if (game.board[index]) {
              const tileType = game.board[index] === 'X' ? "tile-x" : "tile-o";
              tile.innerHTML = `<span class="${tileType}">${game.board[index]}</span>`;
          } else {
              tile.textContent = '';
          }

          if (winningCombination && winningCombination.includes(index)) {
              tile.classList.add('tile-winner');
          }
      });

      if (winningCombination) {
          this.winnerMessage.textContent = `Player ${game.turn} wins!`;
      } else if (game.isBoardFull()) {
          this.winnerMessage.textContent = 'It\'s a draw!';
      } else {
          this.winnerMessage.textContent = ''; // Clear if no winner yet
      }
  }

  updateTurn(game) {
      this.playerX.classList.toggle("active", game.turn === 'X');
      this.playerO.classList.toggle("active", game.turn === 'O');
  }
}

// Game Logic
class Game {
  constructor() {
      this.turn = "X";
      this.board = new Array(9).fill(null);
  }

  nextTurn() {
      this.turn = this.turn === "X" ? "O" : "X";
  }

  makeMove(i) {
      if (this.endOfGame() || this.board[i]) {
          return; 
      }

      this.board[i] = this.turn;
      let winningCombination = this.findWinningCombination();
      if (!winningCombination) {
          this.nextTurn();
      }
  }

  findWinningCombination() {
      const winningComb = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], 
          [0, 3, 6], [1, 4, 7], [2, 5, 8], 
          [0, 4, 8], [2, 4, 6]
      ];

      for (const combination of winningComb) {
          const [a, b, c] = combination;
          if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
              return combination;
          }
      }
      return null;
  }

  endOfGame() {
      return this.findWinningCombination() || this.isBoardFull();
  }
  
  isBoardFull() {
      return this.board.every(tile => tile !== null);
  }

  resetGame() { 
      this.turn = "X";
      this.board.fill(null);
  }
}

// Game Initialization and Event Handling
const game = new Game();
const gameView = new GameView();

function onTileClick(index) {
  game.makeMove(index);
  gameView.updateBoard(game);
}

gameView.updateBoard(game); 
