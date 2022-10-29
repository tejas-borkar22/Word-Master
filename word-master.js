const letters = document.querySelectorAll('.board-letter')
const loadingSpinner = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5

async function init() {
  let currentGuess = ""
  let currentRow = 0

  // Fetching the word of the day from api
  const response = await fetch("https://words.dev-apis.com/word-of-the-day")
  const responseObj = await response.json()
  const word = responseObj.word.toUpperCase()
  setLoadingGif(false)
  const wordParts = word.split("")
  console.log(word)

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
    const guessParts = currentGuess.split("")
    const map = makeMap(wordParts)
    console.log(map)

    for(let i=0;i<ANSWER_LENGTH;i++){
      if(guessParts[i] === wordParts[i]){
        letters[currentRow * ANSWER_LENGTH +i].classList.add("correct")
        map[guessParts[i]]--
        console.log(map[guessParts[i]])
      }
    } 

    currentRow++
    currentGuess = ""
  }

  function backspace(){
    currentGuess = currentGuess.substring(0,currentGuess.length - 1)
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ""
  }

  document.addEventListener('keydown', function handleKeyPress(event) {
    const action = event.key

    if(action === 'Enter')
      commitWord()
    else if(action === 'Backspace')
      backspace()
    else if(isLetter(action))
      addLetter(action.toUpperCase())
  })

  function setLoadingGif(isLoading){
    loadingSpinner.classList.toggle('show',isLoading)
  }

  function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter)
  }

  function makeMap(array){
    const obj = {}
    for(let i=0;i<array.length;i++){
      const letter = array[i]
      if(obj[letter])
        obj[letter]++
      else
        obj[letter] = 1
    }
    return obj;
  }
}
init()