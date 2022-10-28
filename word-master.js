const letters = document.querySelectorAll('.board-letter')
const loadingSpinner = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5

async function init() {
  let currentGuess = ""
  let currentRow = 0

  function addLetter(letter) {
    if(currentGuess.length < ANSWER_LENGTH)
      currentGuess += letter                // Add letter
    else
      currentGuess = currentGuess.substring(0,currentGuess.length - 1) + letter // Replacing the last letter in the string
    letters[ANSWER_LENGTH * currentRow + currentGuess.length-1].innerText = letter        
  }

  async function commitWord(){
    if(currentGuess.length !== ANSWER_LENGTH)
      return // do nothing as string length < 5
    
    // Validate the word

    currentRow++
    currentGuess = ""
  }

  function backspace(){
    currentGuess = currentGuess.substring(0,currentGuess.length - 1)
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ""
  }

  document.addEventListener('keydown', function handleKeyPress(event) {
    const action = event.key
    console.log(action)
    if(action === 'Enter')
      commitWord()
    else if(action === 'Backspace')
      backspace()
    else if(isLetter(action))
      addLetter(action.toUpperCase())
  })

  function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter)
  }
}
init()