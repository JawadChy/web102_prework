/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        const newDiv = document.createElement("div");

        // add the class game-card to the 
        newDiv.classList.add('game-card');


        // set the inner HTML using a template literal to display some info 
        // about each game
        newDiv.innerHTML = `
        <img src="${games[i].img}" class="game-img" />
        <h3 class="game-name">${games[i].name}</h3>
        <p class="game-description">${games[i].description}</p>
        <p clas="game-pledged-and-goal"> Pledged: $${games[i].pledged.toLocaleString()} of $${games[i].goal.toLocaleString()} goal.</p>
        <p class="game-backers">Backers: ${games[i].backers.toLocaleString()}</p>
        `

        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")


        // append the game to the games-container
        gamesContainer.append(newDiv);
    }

}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
console.log(`${GAMES_JSON.length} games added to the page.`);


// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const numContributions = GAMES_JSON.reduce( (total, game) => {
    return total + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${numContributions.toLocaleString()} contributions`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce( (total, game) => {
    return total + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.length;

gamesCard.innerHTML = `${totalGames.toLocaleString()} games`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged < game.goal;
    })

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    console.log(`${unfundedGames.length} unfunded games added to the page.`);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged >= game.goal;
    })

    // use the function we previously created to add funded games to the DOM
    addGamesToPage(fundedGames);
    console.log(`${fundedGames.length} funded games added to the page.`);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
    console.log(`${GAMES_JSON.length} games added to the page.`);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");


const coolBlue = "#ADE1FF"
// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", () => {
    filterUnfundedOnly();
    searchInput.value = "";

    // set background color of the unfunded button to blue and the others to white
    unfundedBtn.style.backgroundColor = coolBlue;
    fundedBtn.style.backgroundColor = "white";
    allBtn.style.backgroundColor = "white";
});

fundedBtn.addEventListener("click", () => {
    filterFundedOnly();
    searchInput.value = "";

    // set background color of the funded button to blue and the others to white
    unfundedBtn.style.backgroundColor = "white";
    fundedBtn.style.backgroundColor = coolBlue;
    allBtn.style.backgroundColor = "white";
});

allBtn.addEventListener("click", () => {
    showAllGames();
    searchInput.value = "";

    // set background color of the all button to blue and the others to white
    unfundedBtn.style.backgroundColor = "white";
    fundedBtn.style.backgroundColor = "white";
    allBtn.style.backgroundColor = coolBlue;
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfundedGames = GAMES_JSON.reduce( (total, game) => {
    return game.pledged < game.goal ? total + 1 : total; // is the game's pledged val less than its goal? If yes return total with this added game, if not return total unchanged
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayString = `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames.toLocaleString()} games. Currently, ${numUnfundedGames == 0 ? "all games are funded" : numUnfundedGames == 1 ? "1 game remains unfunded. We need your help to fund this amazing game!" : `${numUnfundedGames} games remain unfunded. We need your help to fund these amazing games!` }`;
console.log(displayString);

// create a new DOM element containing the template string and append it to the description container
const newParagraph = document.createElement("p");
newParagraph.innerHTML = displayString;
descriptionContainer.append(newParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// games are sorted here by pledged amount
const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement("h3");
firstGameName.innerHTML = firstGame.name;
firstGameContainer.append(firstGameName);

// do the same for the runner up item
const secondGameName = document.createElement("h3");
secondGameName.innerHTML = secondGame.name;
secondGameContainer.append(secondGameName);

// Implementing search feature

// get search input element
const searchInput = document.getElementById("search-input");

// add event listener to search input
searchInput.addEventListener("input", () => {
    const userInput = searchInput.value.toLowerCase();

    // if user input is empty, show all games
    if (userInput === "") {
        showAllGames();
        return;
    }

    // filter games to only display games that match the user's input
    const filteredGames = GAMES_JSON.filter((game) => {
        const gameName = game.name.toLowerCase();
        const gameDescription = game.description.toLowerCase();
        return gameName.includes(userInput) || gameDescription.includes(userInput);
    });

    // remove games from the DOM that do not match the user's input
    deleteChildElements(gamesContainer);

    // add the matching games to DOM
    addGamesToPage(filteredGames);

    // set background color of all buttons to white
    unfundedBtn.style.backgroundColor = "white";
    fundedBtn.style.backgroundColor = "white";
    allBtn.style.backgroundColor = "white";
});
