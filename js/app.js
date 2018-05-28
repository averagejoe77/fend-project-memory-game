(function() {
    const cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
    const container = document.querySelector('.container');
    const backdrop = document.querySelector('.backdrop');
    const modal = document.querySelector('.modal');
    const deck = document.querySelector('.deck');
    const refreshBtn = document.querySelector('.restart');
    const restartBtn = document.querySelector('.modal-restart');
    const spinner = document.querySelector('.spinner');
    const time = document.querySelector('.timer');
    const starList = document.querySelectorAll('.fa-star');
    const title = document.querySelector('.title');
    const moveCount = document.querySelector('.totalMoves');
    const stars = [{
            "count": 8,
            "title": "Champion"
        },
        {
            "count": 16,
            "title": "Padawan"
        },
        {
            "count": 24,
            "title": "Youngling"
        }
    ];
    let openCards = [];
    let t, totalMoves = 0,
        totalMatches = 0,
        clickCount = 0,
        seconds = 0,
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
        starList.forEach(function(item, idx, arr) {
            item.classList.remove('fa-star-o');
            item.classList.add('fa-star');
        });
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
    /*
        this method shows my disdain for vanila JS
        ALL HAIL JQUERY!!!!!!!
    */
    function checkMatch() {
        // create all the shorthand variables because vanilla JS
        let firstCard = openCards[0];
        let lastCard = openCards[1];
        let firstClass = firstCard.classList;
        let lastClass = lastCard.classList;
        let classSelector = lastCard.children[0].classList.value;
        let matches = firstCard.children[0].classList.value === classSelector ? true : false;

        if (!matches) {
            firstClass.add('error', 'shake');
            lastClass.add('error', 'shake');
            // give time for the css animation to execute, then remove
            setTimeout(function() {
                firstClass.remove('shake');
                lastClass.remove('shake');
            }, 400);
            // give time for the css animation to execute, then remove
            setTimeout(function() {
                firstClass.remove('rotate');
                lastClass.remove('rotate');
            }, 500);
            // give time for the css animation to execute, then remove
            setTimeout(function() {
                firstClass.remove('open', 'show', 'error');
                lastClass.remove('open', 'show', 'error');
            }, 600);

        } else {
            // WINNER WINNER CHICKEN DINNER!!!!
            firstClass.replace('show', 'match');
            lastClass.replace('show', 'match');

            firstClass.add('success');
            lastClass.add('success');
            // we need to keep track of the number of matches the player has so far.
            addMatch();
        }
        // reset open cards now that we have determined if there is a match or not.
        openCards = [];
        // increment the number of moves the player has made.
        addMove();
        countStars();
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
        handle the showing of the cards as they are clicked;
        handle the not showing of the cards if they are clicked too fast;
    */
    function showCard(el) {
        if (openCards.length <= 2) {
            el.classList.add('rotate');
            // we need a little time for the rotate css animation to complete
            setTimeout(function() {
                el.classList.add('open', 'show');
            }, 200);
        } else {
            el.classList.add('shake');
            // shake the card, then remove the shake class when the animation completes, 
            // this will allow us to add to the same card again if we need to in the future
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

    function countStars() {
        stars.forEach(function(item, idx, arr) {
            if (totalMoves >= item.count) {
                let starEl = starList[idx];
                starEl.classList.remove('fa-star');
                starEl.classList.add('fa-star-o');
                title.textContent = item.title;
                moveCount.textContent = totalMoves;
            }
        });
    }

    refreshBtn.addEventListener('click', function(e) {
        rebuildDeck();
    });
    restartBtn.addEventListener('click', function(e) {
        rebuildDeck();
    });

    deck.addEventListener('click', function(e) {
        // if we have a shake class on our card let's remove it.
        e.target.classList.remove('shake');
        // check that the card is a card element and make sure it is not already open
        if (e.target.nodeName === 'LI' && !e.target.classList.contains('open')) {
            // is this the first click, then start the timer
            if (clickCount === 0) {
                // let the game begin!!!!
                startTimer();
            }
            // increment clicCount to keep the timer fron spawning multiple instances.
            // it causes very fast timer counting
            clickCount++;
            // add the clicked card to our array of open cards
            openCards.push(e.target);
            // call the showCard method to handle showing of cards
            showCard(e.target);
            // check the length of out open cards to see if we have 2 open cards
            if (openCards.length === 2) {
                // we need time for the second cards rotate css animation to finish before we start checking for a match
                setTimeout(function() {
                    // call the check match method to see if the two open cards match
                    checkMatch();
                }, 650);
            }
        } else {
            // if it's not a card element or it's already open, add the shake class
            e.target.classList.add('shake');
            // give the css animation time to complete then remove the shake class
            setTimeout(function() {
                e.target.classList.remove('shake');
            }, 500);
        }
    });
})();