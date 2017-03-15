/*
Three main classes that constitutes the Game
1. card
  will have two properties - suit and number to uniquely identify given card.
2. deck
3. hand

*/


/** @constructor */
let Card = function (suit, number){
    /** @returns {Number} The number of the card in the deck. (1-52) */
    this.getNumber = () => {
        return number;
    };

    /** @returns {String} The name of the suit. "Hearts","Clubs","Spades", or "Diamonds." */
    this.getSuit = () => {
        return suit;
    };

    /** @returns {String} The HTML-encoded symbol of the suit. */
    this.getSymbol = () => {
        let suitName = '';
        switch (suit){
            case "Hearts":
                suitName = "&#x2665;"; //heart
                break;
            case "Clubs":
                suitName = "&#x2663;"; //club
                break;
            case "Spades":
                suitName = "&#x2660;"; //spade
                break;
            case "Diamonds":
                suitName = "&#x2666;"; //dimond
                break;
        }
        return suitName;
    };
    /** @returns {Number} The value of the card for scoring. */
    this.getValue = () => {
        let value = number;
        if (number >= 10){
            value = 10;
        }
        if(number === 1) {
            value = 11;
        }
        return value;
    };

    /** @returns {String} The full name of the card. "Ace of Spades" */
    this.getName = () => {
        let cardName = '';
        switch (number){
            case 1:
                cardName = "A";
                break;
            case 13:
                cardName = "K";
                break;
            case 12:
               cardName = "Q";
                break;
            case 11:
                cardName = "J";
                break;
            default:
                cardName = number;
                break;
        }
        return cardName+ "<br>" +this.getSymbol();
    };
};

/** @constructor */
let Deck = function (){
    let cards = [];
    const suits = ['Hearts','Clubs', 'Spades', 'Diamonds'];
    /** Creates a new set of cards. */
    let newCards = () => {
            let suit,
            number;
            for(let j=0; j<suits.length; j++) {
              suit = suits[j];
              for (let i=0;i<13;i++) {
                  number = i%13+1;
                  cards.push(new Card(suit,number));
              }
            }
    };
    /* Create those new cards. */
    newCards();
    /** Shuffles the cards. Modifies the private instance of the cards array.
     * @returns {Array} An array of Cards representing the shuffled version of the deck.
     */
    this.shuffle = () => {
        for(let j, x, i = cards.length; i; j = parseInt(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);
        return this.getCards();
    };
    /** @returns {Array} An array of cards representing the Deck. */
    this.getCards = () => {
        return cards;
    };
    /** @returns {Card} Deals the top card off the deck. Removes it from the Deck. */
    this.deal = () => {
        if (!cards.length){
            console.log("Ran out of cards, new deck");
            newCards();
            this.shuffle();
        }
        return cards.pop();
    };
};

/** @constructor */
let Hand = function (deck) {
    let cards = [];

    /* Deal two cards to begin. */
    cards.push( deck.deal(), deck.deal());
    /** @returns {Array} The array of Cards representing the Hand. */
    this.getHand = () => {
        return cards;
    };
    /** @returns {Number} The score of the Hand. */
    this.score = () => {
        let i,
            score = 0,
            cardVal = 0, // Stashing the Card's value
            aces = 0; // Stores the # of Aces in the Hand

        for (i=0;i<cards.length;i++){
            cardVal = cards[i].getValue();
            if (cardVal == 11) {
                aces += 1;
            }
            score += cardVal;
        }
        /* Check to see if Aces should be 1 or 11 */
        while (score > 21 && aces > 0){
            score -= 10;
            aces -=1;
        }
        return score;
    };
    /** @returns {String} Comma separated list of Card names in the Hand. */
    this.printHand = () => {
        let arrayOut = [],
            i;

        for (i=0;i<cards.length;i++){
            arrayOut.push(cards[i].getName());
        }
        return arrayOut.join();
    };
    /** Adds a Card from the Deck into the Hand. */
    this.hitMe = () => {
        if (cards.length < 5){
            cards.push(deck.deal());
        }
    };
    /** @returns {String} HTML representation of the Cards in the Hand. */
    this.toHtml = () => {
        let arrayOut = [],
            i;

        for (i=0;i<cards.length;i++){
            arrayOut.push('<div class="card ',cards[i].getSuit(),' ',cards[i].getNumber(),'">',cards[i].getName(),'</div>');
        }
        return arrayOut.join('');
    };
};

/** Play BLACKJACK! */
(function (){
    /* Set up our Game's Deck */
    let deck = new Deck();

    /* win/lose ratio */
    let wins = 0;
    let losses = 0;

    /** Tally the score to determine the outcome. */
    let declareWinner = (userHand, dealerHand) => {
        let outcome = '',
            dealerScore = dealerHand.score(),
            userScore = userHand.score();

        /* I didn't make the rules, I just enforce them. */
        if (userScore > 21 || dealerScore === 21){
            outcome = "You lose!";
            losses++;
        }else if (userScore <= 21 && userHand.getHand().length >=5){
            outcome = "You win!";
            wins++;
        }else if (dealerScore > 21 || userScore === 21 || userScore > dealerHand.score()){
            outcome = "You win!";
            wins++;
        }else if (dealerScore > userScore){
            outcome = "You lose!";
            losses++;
        }else if (dealerScore === userScore){
            outcome = "You tied!";
        }
        /* Output the result of the round. */
        return outcome+"<br />Dealer: "+dealerHand.score()+"<br />You: "+userScore;
    };

    let dealerHand = () => {
        let hand = new Hand(deck);

        while (hand.score() < 17){
            hand.hitMe();
        }
        return hand;
    };

    /** Holds your Hand */
    let yourHand;

    /* CACHE SELECTORS!!! */
    let $hitButton = $("#hitMe"),
        $standButton = $("#stand"),
        $dealButton = $("#deal"),
        $score = $("#yourScore"),
        $yourHand = $('#yourHand'),
        $dealerHand = $('#dealerHand');

    /** Show the Deal button, hide others. */
    let showDeal = () => {
        $hitButton.hide();
        $standButton.hide();
        $score.hide();
        $dealButton.show();
    };

    /** Show the control buttons, hide Deal. */
    let showControls = () => {
        $hitButton.show();
        $standButton.show();
        $score.show();
        $dealButton.hide();
    };

    /** Update your score and card display. */
    let updateUI = () => {
        /* Cards */
        $yourHand.html(yourHand.toHtml());
        /* Score */
        $score.find(".digits").html(yourHand.score());
        $('#percentage').text(Number((wins*100)/(wins + losses)).toPrecision(3) + ' %');
        $("#wins").text(wins);
        $("#losses").text(losses);
    };

    /* Deal Button */
    $dealButton.on('click', () => {
        yourHand = new Hand(deck);
        updateUI();
        showControls();
    });

    /* Hit Button */
    $hitButton.on('click', () => {
        yourHand.hitMe();
        if (yourHand.getHand().length >= 5 || yourHand.score() > 21){
            $standButton.trigger('click');
        }else{
            updateUI();
        }
    });

    /* Stand Button */
    $standButton.on('click', () => {
        $yourHand.html(declareWinner(yourHand, dealerHand()));
        showDeal();
    });

    /* Make sure to shuffle. */
    deck.shuffle();
}());
