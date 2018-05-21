/*
 * Create a list that holds all of your cards
 */
const cards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
const deck = document.querySelector('.deck');
const refreshBtn = document.querySelector('.restart');
const spinner = document.querySelector('.spinner');
let openCards = [];
let totalMoves = 0;
let totalMatches = 0;
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

function showSpinner() {
	let cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

	cards.forEach(card => {
		card.classList.remove('rotate', 'match', 'open', 'show', 'success');
		card.classList.add('hide');
	});
	setTimeout(function () {
		deck.innerHTML = '';
		spinner.children[0].textContent = 'Shuffeling...';
		spinner.classList.add('show');
	}, 800);
}

function hideSpinner() {
	spinner.children[0].textContent = 'Done!!!';
	setTimeout(function () {
		spinner.classList.remove('show');
	}, 200);
}

function displayMessage(time) {
	let messages = ['Oh! I dropped them...', 'Really Mixin\' em up...', 'Almost there...', 'Hope you\'re ready.'];
	if (time === 10000) {
		setTimeout(function () {
			let i = 0,
				l = messages.length;
			(function iterator() {
				spinner.children[0].textContent = messages[i];
				if (++i < l) {
					setTimeout(iterator, 2000);
				}
			})();
		}, (time / 5));
	} else {
		let randomMsg = Math.floor(Math.random() * messages.length);
		setTimeout(function () {
			spinner.children[0].textContent = messages[randomMsg];
		}, (time / 2));
	}
}

function dealCards(time) {
	let newCards = buildList(cards);

	displayMessage(time);

	setTimeout(function () {
		hideSpinner();
		let i = 0,
			l = newCards.length;
		(function iterator() {
			deck.appendChild(newCards[i]);
			newCards[i].classList.remove('hide');

			if (++i < l) {
				setTimeout(iterator, 200);
			}
		})();
	}, time);
}

function rebuildDeck() {
	openCards = [];
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
		setTimeout(function () {
			firstClass.remove('shake');
			lastClass.remove('shake');
		}, 400);
		setTimeout(function () {
			firstClass.remove('rotate');
			lastClass.remove('rotate');
		}, 500);
		setTimeout(function () {
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
		setTimeout(function () {
			el.classList.add('open', 'show');
		}, 200);
	} else {
		el.classList.add('shake');
		setTimeout(function () {
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
		showModal();
	}
}

function showModal() {

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


refreshBtn.addEventListener('click', function (e) {
	rebuildDeck();
});

deck.addEventListener('click', function (e) {
	e.target.classList.remove('shake');
	if (e.target.nodeName === 'LI' && !e.target.classList.contains('open')) {
		openCards.push(e.target);
		showCard(e.target);
		if (openCards.length === 2) {
			setTimeout(function () {
				checkMatch();
			}, 650);
		}
	} else {
		e.target.classList.add('shake');
		setTimeout(function () {
			e.target.classList.remove('shake');
		}, 500);
	}
});