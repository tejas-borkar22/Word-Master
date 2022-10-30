const letters = document.querySelectorAll('.board-letter')
const loadingSpinner = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5
const ROUNDS = 6

async function init() {
  let currentGuess = ""
  let currentRow = 0
  let done = false
  let isLoading = true

  // Fetching the word of the day from api
  const response = await fetch("https://words.dev-apis.com/word-of-the-day")
  const responseObj = await response.json()
  const word = responseObj.word.toUpperCase()
  setLoadingGif(false)
  isLoading = false
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
    // console.log(guessParts)
    const map = makeMap(wordParts)
    // console.log(map)
    
    for(let i=0;i<ANSWER_LENGTH;i++){
      // Marking it as correct
      if(guessParts[i] === wordParts[i]){
        letters[currentRow * ANSWER_LENGTH +i].classList.add("correct")
        map[guessParts[i]]--
      }
    } 

    for(let i=0;i<ANSWER_LENGTH;i++){
      if(guessParts[i] === wordParts[i]){
        //Do nothing already did it.
      }
      // Marking it as close
      else if(wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0){
        letters[currentRow * ANSWER_LENGTH +i].classList.add("close")
        map[guessParts[i]]--
      }
      else
      letters[currentRow * ANSWER_LENGTH +i].classList.add("wrong")
    }

    currentRow++
    // Win or lose logic
    if(currentGuess === word){
      console.log("You win 🥇")
      done = true
      return
    }else if(currentRow === ROUNDS){
      console.log(`The word of the day was ${word}`)
      done = true 
    }

    currentGuess = ""
  }

  function backspace(){
    currentGuess = currentGuess.substring(0,currentGuess.length - 1)
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ""
  }

  document.addEventListener('keydown', function handleKeyPress(event) {
    if(done || isLoading){
      return // Do nothing
    }
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