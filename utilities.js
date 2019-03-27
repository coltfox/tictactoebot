const permutator = (inputArr) => { //generates combinations of an array
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
}

function shuffleWinningBoards(winningBoards) { //shuffles winning boards into more possible combos
    newWinningBoards = [];
    for(var i=0; i<winningBoards.length; i++){
        array = permutator(winningBoards[i]);
        newWinningBoards = newWinningBoards.concat(array);
    }
    return newWinningBoards;
}

function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1] && array[i][2] == item[2]) {
            return [array[i][0],array[i][1],array[i][2]];   // Found it
        }
    }
    return false;   // Not found
}