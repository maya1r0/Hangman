var keyboardIds = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var correctWord;
var letterArray;
var guessesLeft = 8;
var arrayToFill=[];
var correctSound = new Audio("../audio/goodSound.mp4");
var wrongSound = new Audio("../audio/wrongGuess.mp4");
var wonGame = new Audio ("../audio/wonGame.mp4");
var lostGame = new Audio("../audio/lostGame.mp4");
var mute = false;
var currStreak;


function generateWord() {
    let codeNumber = Math.floor(Math.random() * Math.floor(words.length));
    correctWord = words[codeNumber];
    letterArray = new Array(correctWord.length);

    for (let i = 0; i < correctWord.length; i++) {
        letterArray[i] = correctWord.charAt(i);
    }

    for (let i = 0; i<correctWord.length; i++){
        arrayToFill[i] = ' ';
    }
}
function generate2PlayerWord() {
    correctWord = localStorage.getItem('myWord');
    letterArray = new Array(correctWord.length);

    for (var i = 0; i < correctWord.length; i++) {
        letterArray[i] = correctWord.charAt(i);
    }

    for (var i = 0; i < correctWord.length; i++) {
        arrayToFill[i] = ' ';
    }
}

function makeGuess(buttonId) {
    console.log(buttonId);
    const element = document.getElementById("keyboard-object");
    const button = element.contentDocument.getElementById(buttonId);
    button.disabled = true;
}

function checkAnswer(buttonId) {
    var inWord = false;
    for (var i = 0; i < correctWord.length; i++) {
        if (letterArray[i].toLowerCase() === buttonId.toLowerCase())
            inWord = true;
    }
    return inWord;
}

function setColor(buttonId) {
    const element = document.getElementById("keyboard-object");
    const button = element.contentDocument.getElementById(buttonId);
    if (checkAnswer(buttonId)) {
        button.style.backgroundColor = "#7CEC73";
    }
    else {
        button.style.backgroundColor = "#ED6464";
    }
}

function writeGuesses(buttonId) {
    if (!checkAnswer(buttonId)) {
        guessesLeft--;
    }
    document.getElementById("numGuesses").innerHTML = "Guesses Left: " + guessesLeft.toString();
}

function disableKeyboard() {
    const element = document.getElementById("keyboard-object");
    for (let i = 0; i<keyboardIds.length; i++){
        element.contentDocument.getElementById(keyboardIds[i]).disabled = true;
    }
}

var img = "../images/winnerpic.png";
var firstImg = "../images/loserpic.png";

function loser() {
    if (guessesLeft === 0){
        if (!mute) {
            lostGame.play();
        }
        document.getElementById("loser").src = firstImg.toString();
        document.getElementById("playAgain").style.display = "block";
        document.getElementById("newCategory").style.display = "block";
        document.getElementById("xButton").style.display = "block";
        document.getElementById("afterGameWord").innerHTML = "The word was: " + correctWord;
        disableKeyboard();
        if (sessionStorage.getItem("noThanks") === null) {
            postRequest("/reset-current-streak?name=" + sessionStorage.getItem('myName'));
            currStreak = getRequest("/get-current-streak?name=" + sessionStorage.getItem("myName"));
            document.getElementById("winStreak").innerHTML = "Current winning streak: " + currStreak;
        }
    }
    if (arrayToFill.indexOf(' ') < 0) {
        if (!mute) {
            wonGame.play();
        }
        document.getElementById("winner").src = img.toString();
        document.getElementById("playAgain").style.display = "block";
        document.getElementById("newCategory").style.display = "block";
        document.getElementById("xButton").style.display = "block";
        document.getElementById("afterGameWord").innerHTML = "The word was: " + correctWord;
        disableKeyboard();
        if (sessionStorage.getItem("noThanks") === null) {
            postRequest("up-streaks?name=" + sessionStorage.getItem("myName"));
            currStreak = getRequest("/get-current-streak?name=" + sessionStorage.getItem("myName"));
            document.getElementById("winStreak").innerHTML = "Current winning streak: " + currStreak;
        }
    }
}

var bgImg = "../images/getinfobg.png";

function getInfo() {
        document.getElementById("getInfobg").src = bgImg.toString();
        document.getElementById("OK").style.display = "block";
        document.getElementById("noThanks").style.display = "block";
        document.getElementById("enterName").innerHTML = "Enter your name: ";
        document.getElementById("nameInput").style.display = "block";
        document.getElementById("explanation").innerHTML = "*This will allow you to keep track of your winning streak";
}

function closeGetInfo(){
    document.getElementById("OK").style.display = "none";
    document.getElementById("noThanks").style.display = "none";
    document.getElementById("enterName").style.display = "none";
    document.getElementById("nameInput").style.display = "none";
    document.getElementById("getInfobg").style.display = "none";
    document.getElementById("explanation").style.display = "none";
}

function saveName(elemId) {
    postRequest('store-username?name=' + document.getElementById(elemId).value);
    sessionStorage.setItem("myName", document.getElementById(elemId).value);
}

function noThanks(){
    sessionStorage.setItem("noThanks", "clicked");
}

function writeLetters(buttonId) {
    if (checkAnswer(buttonId)) {
        for (var i = 0; i < correctWord.length; i++) {
            if (letterArray[i].toLowerCase() === buttonId.toLowerCase())
                arrayToFill[i] = buttonId;
        }
    }
    if (correctWord.length <= 7) {
        for (let j = 0; j < correctWord.length; j++) {
            document.getElementById("firstRow").cells[j].innerHTML = arrayToFill[j];
        }
    }
    else {
        for (let j = 0; j < correctWord.length; j++) {
            document.getElementById("longFirstRow").cells[j].innerHTML = arrayToFill[j];
        }
    }
}

function displayMan() {
    if (guessesLeft<8) {
        document.getElementById("manPicture").src = manArray[7-guessesLeft].toString();
    }
}

function makeGuessSound(buttonId){
    if (!mute) {
        if (checkAnswer(buttonId))
            correctSound.play();
        else
            wrongSound.play();
    }
}

function muteOrUnmute(){
    mute=!mute;
    if (mute){
        document.getElementById('muteButton').style.backgroundImage = "url('../images/muted.png')";
    }
    else
        document.getElementById('muteButton').style.backgroundImage = "url('../images/unmuted.png')";
}

function xPopUp(){
    document.getElementById("playAgain").style.display = "none";
    document.getElementById("newCategory").style.display = "none";
    document.getElementById("afterGameWord").style.display = "none";
    document.getElementById("winner").style.display = "none";
    document.getElementById("loser").style.display = "none";
    document.getElementById("xButton").style.display = "none";
    document.getElementById("winStreak").style.display = "none";
}

function processClick(buttonId) {
    makeGuess(buttonId);
    setColor(buttonId);
    writeGuesses(buttonId);
    writeLetters(buttonId);
    displayMan();
    loser();
    makeGuessSound(buttonId);
    console.log(arrayToFill.toString());
}

function postRequest(urlsuffix){
    var xhr = new XMLHttpRequest();
    var url = 'https://boba-hangman-service.herokuapp.com/'+urlsuffix;
    xhr.open('POST', url, false);
    xhr.onreadystatechange = function (data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Response is received");
                console.log(xhr.response);
            }
        } else {
            //callback(null);
        }
    }
    xhr.send();
}

function getRequest(urlsuffix){
    console.log("sophie likes clams" + urlsuffix);
    var returnVal;
    var xhr = new XMLHttpRequest();
    var url = 'https://boba-hangman-service.herokuapp.com/'+urlsuffix;
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function (data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Response is received");
                returnVal = JSON.parse(xhr.response);
            }
        } else {
            //callback(null);
        }
    }
    xhr.send();
    return returnVal;
}





