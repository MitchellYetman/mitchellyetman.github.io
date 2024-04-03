(() => {

    const createGame = (json) => {

        let div = document.querySelector("#theGame");
        let newTable = document.createElement("table");
        newTable.id = "frame";
        div.append(newTable);

        for (let i = 0; i < json.rows.length; i++) {
            let newRow = document.createElement("tr");
            newTable.append(newRow)
            for (let j = 0; j < json.rows[i].length; j++) {
                let newCell = document.createElement("td");
                newCell.className = "cell"

                //CHATGPT help with this part
                newCell.dataset.rowIndex = i;
                newCell.dataset.colIndex = j;

                if (json.rows[i][j].currentState === 0) {
                    newCell.id = "grey"
                }

                if (json.rows[i][j].currentState === 1) {
                    newCell.id = "blue";
                }

                if (json.rows[i][j].currentState === 2) {
                    newCell.id = "white";
                }

                // USED CHAT GPT FOR HELP WITH THIS CODE (the window.getComputedStyle part)
                //tried to do it myself by trying to access the backgroundColor property, but was not working
                if (json.rows[i][j].canToggle === true) {
                    newCell.addEventListener("click", (event) => {
                        const clickedTag = event.target;
                        const computedStyle = window.getComputedStyle(clickedTag);
                        const backgroundColor = computedStyle.backgroundColor;
                        if (backgroundColor == "rgb(128, 128, 128)") {
                            json.rows[i][j].currentState = 1;
                            clickedTag.style.backgroundColor = "blue";
                            clickedTag.id = "blue";
                        }
                        if (backgroundColor == "rgb(0, 0, 255)") {
                            json.rows[i][j].currentState = 2;
                            clickedTag.style.backgroundColor = "white";
                            clickedTag.id = "white";
                        }
                        if (backgroundColor == "rgb(255, 255, 255)") {
                            json.rows[i][j].currentState = 0;
                            clickedTag.style.backgroundColor = "grey";
                            clickedTag.id = "grey";
                        }
                    })
                }
                newRow.append(newCell);
            }
        }

        let checkButton = document.createElement("button");
        div.append(checkButton);
        checkButton.innerText = "Check progress";
        let ptag = document.createElement("p");
        div.append(ptag);
        checkButton.addEventListener("click", () => {
            let checkIfComplete = [];
            let incorrectCheck = [];
            json.rows.forEach((row) => {
                row.forEach((tile) => {
                    if (tile.currentState === tile.correctState) {
                        checkIfComplete.push(true);
                    };
                    if ((tile.currentState !== tile.correctState) && tile.currentState !== 0) {
                        incorrectCheck.push(true);
                    }
                });
            });

            if (checkIfComplete.length === (json.rows.length * json.rows.length)) {
                ptag.innerText = "You did it!!";

            }

            if (checkIfComplete.length < (json.rows.length * json.rows.length) && incorrectCheck.length === 0) {
                ptag.innerText = "So far so good";

            }

            if (incorrectCheck.length > 0) {
                ptag.innerText = "Something is wrong";

            }


        });

        let hintButton = document.createElement("button");
        hintButton.innerText = "Click for a small hint";
        hintButton.id = "hint";
        div.append(hintButton);
        hintButton.addEventListener("click", () => {
            let cells = document.querySelectorAll(".cell");
            let incorrectCells = [];
            cells.forEach((cell) => {
                let row = cell.dataset.rowIndex;
                let col = cell.dataset.colIndex;
                if ((json.rows[row][col].currentState !== json.rows[row][col].correctState) && (json.rows[row][col].currentState !== 0)) {
                    incorrectCells.push([row, col]);
                }
            })

            let randomNum = Math.floor(Math.random() * incorrectCells.length);
            let randomIncorrectCell = incorrectCells[randomNum];
            cells.forEach((cell) => {
                cell.innerText = "";
                if (cell.dataset.rowIndex === randomIncorrectCell[0] && cell.dataset.colIndex === randomIncorrectCell[1]) {
                    if (json.rows[randomIncorrectCell[0]][randomIncorrectCell[1]].correctState === 1) {
                        cell.innerText = "B";
                    }
                    if (json.rows[randomIncorrectCell[0]][randomIncorrectCell[1]].correctState === 2) {
                        cell.innerText = "W";
                    }
                }
            })
        })

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox"
        checkBox.id = "myCheckbox"
        let checkBoxLabel = document.createElement("label");
        checkBoxLabel.htmlFor = "myCheckbox"
        checkBoxLabel.innerText = "Click to show all incorrectly coloured tiles"
        div.append(checkBox);
        div.append(checkBoxLabel);

        //had to look up 'checkbox.checked' property
        checkBox.addEventListener("click", () => {
            let cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                let preCheckColour = cell.id;
                let row = cell.dataset.rowIndex;
                let col = cell.dataset.colIndex;
                if (checkBox.checked) {
                    if ((json.rows[row][col].currentState !== json.rows[row][col].correctState) && (json.rows[row][col].currentState !== 0)) {
                        cell.style.backgroundColor = "red";
                    }
                } else {
                    cell.style.backgroundColor = preCheckColour;
                }
            })
        })


    } // end of createGame function


    // fetch("https://prog2700.onrender.com/threeinarow/sample")
    fetch("https://prog2700.onrender.com/threeinarow/random")
        .then((response) => {
            tileList = response.json();
            return tileList;
        })
        .then((tileList) => {
            createGame(tileList);
        })


})(); // end of IIFE