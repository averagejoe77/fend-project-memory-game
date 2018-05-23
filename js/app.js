const cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
const container = document.querySelector('.container');
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const deck = document.querySelector('.deck');
const refreshBtn = document.querySelector('.restart');
const restartBtn = document.querySelector('.modal-restart');
const spinner = document.querySelector('.spinner');
const time = document.querySelector('.timer');
let openCards = [];
let totalMoves = 0;
let totalMatches = 0;
let clickCount = 0,
    t, seconds = 0,
    minutes = 0;

function startTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
        }
    }

    time.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(startTimer, 1000);
}

function stopTimer() {
    clearTimeout(t);
    time.textContent = "00:00";
}

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

function showSpinner() {
    let cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

    cards.forEach(card => {
        card.classList.remove('rotate', 'match', 'open', 'show', 'success');
        card.classList.add('hide');
    });
    setTimeout(function() {
        deck.innerHTML = '';
        spinner.children[0].textContent = 'Shuffeling...';
        spinner.classList.add('show');
    }, 800);
}

function hideSpinner() {
    spinner.children[0].textContent = 'Done!!!';
    setTimeout(function() {
        spinner.classList.remove('show');
    }, 200);
}

function refreshUI() {
    stopTimer();
    modal.classList.remove('show');
    backdrop.classList.remove('show');
    container.classList.remove('blur');
    totalMatches = 0;
}

function displayMessage(time) {
    let messages = ['Oh! I dropped them...', 'Really Mixin\' em up...', 'Almost there...', 'Hope you\'re ready.'];
    if (time === 10000) {
        setTimeout(function() {
            let i = 0,
                l = messages.length;
            (function msg() {
                spinner.children[0].textContent = messages[i];
                if (++i < l) {
                    setTimeout(msg, 2000);
                }
            })();
        }, (time / 5));
    } else {
        let randomMsg = Math.floor(Math.random() * messages.length);
        setTimeout(function() {
            spinner.children[0].textContent = messages[randomMsg];
        }, (time / 2));
    }
}

function dealCards(time) {
    let newCards = buildList(cards);

    displayMessage(time);

    setTimeout(function() {
        hideSpinner();
        let i = 0,
            l = newCards.length;
        (function deal() {
            deck.appendChild(newCards[i]);
            newCards[i].classList.remove('hide');

            if (++i < l) {
                setTimeout(deal, 200);
            }
        })();
    }, time);
}

function rebuildDeck() {
    openCards = [];
    refreshUI();
    addMove(0);
    showSpinner();

    let time = Math.floor(Math.random() * 10000);
    if (time < 2200) {
        time += (10000 - time);
    }

    dealCards(time);
}

function checkMatch() {
    let firstCard = openCards[0];
    let lastCard = openCards[1];
    let firstClass = firstCard.classList;
    let lastClass = lastCard.classList;
    let classSelector = lastCard.children[0].classList.value;
    let matches = firstCard.children[0].classList.value === classSelector ? true : false;
    if (!matches) {
        firstClass.add('error', 'shake');
        lastClass.add('error', 'shake');
        setTimeout(function() {
            firstClass.remove('shake');
            lastClass.remove('shake');
        }, 400);
        setTimeout(function() {
            firstClass.remove('rotate');
            lastClass.remove('rotate');
        }, 500);
        setTimeout(function() {
            firstClass.remove('open', 'show', 'error');
            lastClass.remove('open', 'show', 'error');
        }, 600);

    } else {
        firstClass.replace('show', 'match');
        lastClass.replace('show', 'match');

        firstClass.add('success');
        lastClass.add('success');
        addMatch();
    }
    openCards = [];
    addMove();
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

function showCard(el) {
    if (openCards.length <= 2) {
        el.classList.add('rotate');
        setTimeout(function() {
            el.classList.add('open', 'show');
        }, 200);
    } else {
        el.classList.add('shake');
        setTimeout(function() {
            el.classList.remove('shake');
        }, 500);
    }
}

function addMove(count) {
    let moves = document.querySelector('.count');

    if (count === undefined) {
        totalMoves++;
    } else {
        totalMoves = 0;
    }

    moves.textContent = totalMoves;
}

function addMatch() {
    totalMatches++;
    if (totalMatches === 8) {
        winGame();
    }
}

function winGame() {
    setTimeout(function() {
        container.classList.add('blur');
        backdrop.classList.add('show');
        modal.classList.add('show');
    }, 1500);
}

refreshBtn.addEventListener('click', function(e) {
    rebuildDeck();
});
restartBtn.addEventListener('click', function(e) {
    rebuildDeck();
});

deck.addEventListener('click', function(e) {
    e.target.classList.remove('shake');
    if (e.target.nodeName === 'LI' && !e.target.classList.contains('open')) {
        if (clickCount === 0) {
            startTimer();
        }
        clickCount++;
        openCards.push(e.target);
        showCard(e.target);
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