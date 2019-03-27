const origBoard = [0,1,2,3,4,5,6,7,8]; //all squares on board
winningBoards = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];
aiPlayer = "X";
huPlayer = "O";
const gameChats = ["Let's see here...", "You can do better than that!", "This will be easy...","Come on, give me a challenge!","I think I will go... here.", "Hmm...","I am going to win anyway."]
currentGameChats = [];
thinking = false;

squares = document.getElementsByClassName("box");

window.onload = function(){ initGame()};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomChat(){
  if (chatText) (currentGameChats.splice(currentGameChats.indexOf(chatText), 1));
  if(currentGameChats.length>0){
    var chatText = currentGameChats[Math.floor(Math.random()*currentGameChats.length)];
    console.log(chatText); //outputs the expected chatText
    return chatText; //returns undefined
  }
  else{
    currentGameChats = gameChats.slice(0);
    return getRandomChat()
  }
}

async function chat(chat){
  var chatBubbleText = document.getElementById('chat-text');
  think(true);
  chatBubbleText.innerHTML = chat;
  await sleep(1000);
  think(false);
}

async function think(toggle){
  robotdefault = document.getElementById("robotdefault");
  robotthinking = document.getElementById("robotthinking");
  if(toggle){
    thinking = true;
    robotdefault.className = "robot endgame";
    robotthinking.className = "robot";
  }else{
    thinking = false;
    robotdefault.className = "robot";
    robotthinking.className = "robot endgame" ;
  }
}

//Initialize game
function initGame(){
  chat("Think you can beat the best Tic Tac Toe player in the world? You are wrong!");
  var winMsg = document.getElementById("winText");
  winMsg.innerHTML = '';
  currentBoard = origBoard.slice(0); //clones origBoard
  for (var i = 0; i<squares.length; i++){ // loop through each box, reset them
      var box = squares[i];
      box.innerHTML = '';
      box.addEventListener('click', playerClick, false);
      box.className = "box selectable";
  }
}

//huPlayer clicking on square
async function playerClick(click){
  if (determineTie() && !thinking){
    endGame("tie");
  }
  else if(!thinking){
    writeSquare(click.target.id, huPlayer)
    think(true);
    chat(getRandomChat());
    await sleep(1000);
    writeSquare(getBestSquare(), aiPlayer);
    think(false);
  }
}

//Write on square
function writeSquare(squareID, player){
  square = document.getElementById(squareID);
  if (square.className == "box selectable"){ //if square is active
    //console.log("writing ",player," to ",square);
    square.innerHTML = player;
    square.className = "box";
    square.removeEventListener('click', playerClick, false);
    updateCurrentBoard();
    let gameWon = determineWin(currentBoard, player);
    if (gameWon) endGame(player);
  }
} 

function updateCurrentBoard(){
  for (var i = 0; i<currentBoard.length; i++){
    var element = document.getElementById(currentBoard[i]);
    if(element && element.innerHTML){
      currentBoard[element.id] = element.innerHTML; 
    }
  }
}

//Determine if a win has been made
function determineWin(board, player, returnBoard = false){
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
    ){
      if(!returnBoard) return true;
      else if(returnBoard) return board;
    } else {
      return false;
  }
}

function determineTie(){
  if(getAvailableSquares().length == 0){
    return true;
  }
  else{
    return false;
    }
}

function getBestSquare(){
  return minimax(currentBoard, aiPlayer).index;
}

function getAvailableSquares(){
    var availableSquares = [];
    for (var i = 0; i < currentBoard.length; i++){
        if (origBoard.indexOf(currentBoard[i]) != -1){
            availableSquares.push(currentBoard[i]);
        }
    }
    return availableSquares;
}

// ends game
async function endGame(winner){
  var winMsgElement = document.getElementById("winText");
  if (winner == "X") (winMsg = "Bot won!");
  else if (winner == "O") (winMsg = "You won!");
  else if (winner == "tie") (winMsg = "It's a tie!");
  await sleep(1000);
  for (var i = 0; i<squares.length; i++){ // loop through each box, reset them
    squares[i].className = "box endgame";
  }
  winMsgElement.innerHTML = winMsg;
}

function minimax(newBoard, player) {
  var availSpots = getAvailableSquares(newBoard);
    
  if (determineWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (determineWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
    
  var moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
      
    if (player === aiPlayer)
      move.score = minimax(newBoard, huPlayer).score;
    else
      move.score =  minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
      return move;
    else 
      moves.push(move);
    }
    
  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
