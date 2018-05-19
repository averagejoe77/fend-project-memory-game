/*
 * Create a list that holds all of your cards
 */
const cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
const deck = document.querySelector('.deck');
const refreshBtn = document.querySelector('.restart');
const spinner = document.querySelector('.spinner');
let openCards = [];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// rebuildDeck();

function buildList(array) {
    let topCards = shuffle(array);
    let bottomCards = shuffle(array);
    let fullList = createList(topCards, bottomCards);

    return fullList;
}

function createList(top, bottom) {
    let topList = mapItems(top);
    let bottomList = mapItems(bottom);

    return shuffle(topList.concat(bottomList));
}

function mapItems(list) {
    return list.map(item => {
        let li = document.createElement('li');
        let icon = document.createElement('i');
        li.classList.add('card', 'hide');
        icon.classList.add('fa', `fa-${item}`);

        li.appendChild(icon);
        return li;
    });
}

function rebuildDeck() {
    openCards = [];
    let oldCards = Array.prototype.slice.call(document.querySelectorAll('.card'));
    let newCards = buildList(cards);

    oldCards.forEach(card => {
        card.classList.remove('rotate', 'match', 'open', 'show');
        card.classList.add('hide');
    });
    setTimeout(function() {
        deck.innerHTML = '';
        spinner.children[0].textContent = 'Shuffeling...';
        spinner.classList.add('show');
    }, 1000);

    setTimeout(function() {
        newCards.forEach(card => {
            deck.appendChild(card);
            setTimeout(function() {
                spinner.children[0].textContent = 'Done!!!';
            }, 500);
            setTimeout(function() {
                spinner.classList.remove('show');
                card.classList.remove('hide');
            }, 1000);
        });
    }, 6000);


}

function checkMatch() {
    let classSelector = openCards[1].children[0].classList.value;
    let matches = openCards[0].children[0].classList.value === classSelector ? true : false;
    if (!matches) {
        openCards[0].classList.remove('open', 'show', 'rotate', 'shake');
        openCards[1].classList.remove('open', 'show', 'rotate', 'shake');

    } else {
        openCards[0].classList.replace('show', 'match');
        openCards[1].classList.replace('show', 'match');
    }
    openCards = [];
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


refreshBtn.addEventListener('click', function(e) {
    rebuildDeck();
});

deck.addEventListener('click', function(e) {
    e.target.classList.remove('shake');
    if (e.target.nodeName === 'LI' && !e.target.classList.contains('open')) {
        if (openCards.length < 2) {
            e.target.classList.add('rotate');
            setTimeout(function() {
                e.target.classList.add('open', 'show');
            }, 200);
            openCards.push(e.target);
        } else {
            e.target.classList.add('shake');
        }
        if (openCards.length === 2) {
            setTimeout(function() {
                checkMatch();
            }, 650);
        }
    } else {
        e.target.classList.add('shake');
        setTimeout(function() {
            e.target.classList.remove('shake');
        }, 500);
    }
});