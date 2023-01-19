const letters = document.querySelectorAll('.board-letter')
const loadingSpinner = document.querySelector('.info-bar')
const closeAlertBtn = document.querySelector('.close-alert-box')
let alertBox = document.querySelector('.alert')
let popUpMesseage = document.querySelector('.alert p')
const ANSWER_LENGTH = 5
const ROUNDS = 6

async function init() {
  let currentGuess = ""
  let currentRow = 0
  let done = false
  let isLoading = true
  let showPopUp = false

  // Fetching the word of the day from an API
  const response = await fetch("https://words.dev-apis.com/word-of-the-day")
  const responseObj = await response.json()
  const word = responseObj.word.toUpperCase()
  setLoadingGif(false)
  isLoading = false
  const wordParts = word.split("")
  // console.log(word)       Word of the day

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
  
    isLoading = true
    setLoadingGif(true)
    // Checking whether guess ia a valid 5 letter word or not
    const response = await fetch("https://words.dev-apis.com/validate-word", {
      method : "POST",
      body : JSON.stringify({ word: currentGuess })
    });
    const responseObj = await response.json()
    const validWord = responseObj.validWord
    //  const { validWord } = responseObj
    isLoading = false
    setLoadingGif(false)

    if(!validWord){
      markInvalidWord()
      return
    }

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
      // Marking it as closer to the word
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
      // TODO : Add popup
      showPopUp = true
      alertBox.style.backgroundColor = '#bbf7d0'
      popUpMesseage.innerHTML = "You win 🎉🎉🥇"
      alertBox.classList.toggle('show',showPopUp)
      document.querySelector(".brand").classList.add("winner")
      done = true
      return
    }else if(currentRow === ROUNDS){
      showPopUp = true
      alertBox.style.backgroundColor = '#fed7aa'
      popUpMesseage.innerHTML = `Better Luck Next Time, the word of the day is ${word} 😞😔`
      alertBox.classList.toggle('show',showPopUp)
      done = true 
    }

    currentGuess = ""
  }

  function backspace(){
    currentGuess = currentGuess.substring(0,currentGuess.length - 1)
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ""
  }
  
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

  function markInvalidWord(){
    for(let i=0;i<ANSWER_LENGTH;i++){
      letters[currentRow * ANSWER_LENGTH +i].classList.remove("invalid")
      setTimeout(()=> { letters[currentRow * ANSWER_LENGTH +i].classList.add("invalid") },10)
    }
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

  //Function to close alert box 
  closeAlertBtn.addEventListener("click", ()=> {
  let alert =  document.querySelector(".alert")
  alert.style.opacity = "0"
  setTimeout(()=>{ alert.style.display = "none"; }, 500);
  })

}
init()