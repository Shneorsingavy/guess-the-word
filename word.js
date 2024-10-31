const init = () => {
    fetch('./word.json')
        .then(response => response.json())
        .then(data => {
            const words = data.words;
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex];
            console.log('מילה אקראית:', randomWord);

            // החלפת אותיות סופיות ברגילות
            let newRandomWord = replaceFinalLetter(randomWord);

            //יצירת גישה למקלדת ולתאים בטבלה
            const letters = document.querySelectorAll(".latter");
            const boxes = document.querySelectorAll(".box");
            let index = -1;
            let numOfLife = 5;
            let stopCancel=-1;


            // הפעלה של כל כפתור
            letters.forEach(element => {

                //אפשרות א, של מחיקה
                if (element.innerText === 'X') {
                    element.addEventListener("click", () => {
                   
                        if (index < 0) {
                            index = 0;
                        }
                        if (index > stopCancel) {
                            boxes[index].innerHTML = "";
                            index--;
                        }
                        else{
                            alert("לא חוקי!")
                        }
                    })
                }

                //אפשרות ב, של אישור ובדיקת המילה
                else if (element.innerText.trim() === 'OK') {

                    element.addEventListener("click", () => {

                        if (index === stopCancel+5) {
                            numOfLife--;
                            stopCancel=index;
                            console.log(stopCancel);
                            check(boxes, index, newRandomWord, letters);

                            const guess = Array.from(boxes).slice(index - 4, index + 1).map(e => e.textContent).join('');
                            console.log("guess:", guess);

                            setTimeout(() => {
                                lastCheck(newRandomWord, guess, numOfLife, randomWord);
                            }, 500);

                         

                        } else {
                            alert("השלם את המילה");
                        }
                    });
                }

                //אפשרות ג, הצבת האות בתא המתאים 
                else {
                    element.addEventListener("click", () => {
                        index++;
                        if(index > stopCancel+5){
                            alert("השלם מילה אחת בלבד!")
                            index--;
                        }
                     else{
                        if (index > 24) {
                            index = 24;
                        }
                        boxes[index].textContent = element.textContent;
                        console.log('Index on letter click:', index);
                     }
                       
                    });
                }
            });
        });

    //בדיקת מילה והצגת תוצאות בהתאם
    function check(row, index, newRandomWord, letters) {
        for (let i = index - 4; i <= index; i++) {

            // אות תואמת ובמקומה הנכון
            if (row[i].textContent === newRandomWord[i - (index - 4)]) {
                row[i].classList.add("green");
                const index = Array.from(letters).findIndex(letter => letter.textContent === row[i].textContent);
                if (index !== -1) {
                    letters[index].classList.add("green");
                }
            }

            // אות תואמת אך אינה במקומה הנכון
            else if (Array.from(newRandomWord).includes(row[i].textContent)) {
                row[i].classList.add("yellow");
            }

            // אות אינה קיימת
            else {
                row[i].classList.add("gray");
                const index = Array.from(letters).findIndex(letter => letter.textContent === row[i].textContent);
                if (index !== -1) {
                    letters[index].classList.add("gray");
                }
            }
        }
    }

    // השוואת מילה סופית והכרזה על ניצחון או הפסד
    function lastCheck(word, guess, numOfLife,randomWord) {
        if (guess === word) {
            // alert("ניחשת נכון!" + randomWord)
            let finishGame = document.createElement("div");
            finishGame.textContent=randomWord;
            document.body.appendChild(finishGame); 
            finishGame.className="showWord";
            // location.reload();
        }
        else if (numOfLife === 0) {
            alert("הפסדת...נסה בפעם הבאה!" + "המילה היתה: " + randomWord)
            location.reload();
        }
        else {
            alert("נותרו לך עוד: " + numOfLife + " נסיונות!")
        }


    }
}


//בדיקת ושינוי אותיות סופיות לרגילות
function replaceFinalLetter(word) {
    const finalLettersMap = {
        'ם': 'מ',
        'ן': 'נ',
        'ץ': 'צ',
        'ף': 'פ',
        'ך': 'כ'
    };

    const lastChar = word[word.length - 1];
    if (finalLettersMap[lastChar]) {
        return word.slice(0, -1) + finalLettersMap[lastChar];
    }
    return word;
}






init();
