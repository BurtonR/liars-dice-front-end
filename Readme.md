## Liars Dice Web App
#### A simple imperfect node backend + Angular skeleton for UI engineer interviews

###Liar's Dice

In the game Liar's Dice, each player begins the game with 5 dice, hidden from the other players.  Every player rolls the dice and hides the result. The first player puts X(ex. 0 to 5) number of dice in the middle and declares how many dice of a certain number exist amongst all the dice in play. For example, if he puts out 3 4s and says "There are at least 10 4s", then he believes there are 10 4's across everyone's hand including the 3 dice in the middle.

After a player places dice on the board and makes a dieForBoard(note: the player doesn't have to place any dice on the board, they can just make a dieForBoard), he/she must reroll the remaining dice in their hand.

The next player must either challenge the previous player's claim, or make a new claim that is at least one die higher (it can be an different number is the player chooses). For example, "There are at least 11 4s" or "There are at least 11 3s".

###The Exercise

Write a JavaScript front end application for playing a game of Liar's Dice!

The game should allow the user to:

* Start a new game, specifying the number of players and number of dice per player.
* See the current state of the game (including player's turn, number of dice, etc.)
* Move dice to the middle, claim a number of dice in hand, or challenge the last player's claim
* See all moves taken by players in the game


### Burton R's implementation
___
* Download/Clone the project
* Make sure you have Node installed (https://nodejs.org/download/)
* Run `npm install` on the `/public` directory
    * This is the Angular 2 app dependencies
* Run `npm intall` on the root directory
    * This is the NodeJs API dependencies
* Run `npm start` from the root directory
    * This builds the Angular 2 app and performs WebPack to uglify and minify the files
    * Also builds the NodeJs API code and executes `node ./index.js` to start the app

*The server will run on localhost:8080*
    
* Test cases exist for the Angular 2 app
    * In the `/public` directory, run `npm test`
    * This will start Chrome and a PhantomJS (headless) browser to execute all the unit tests
    
Dice images retrieved from [WPClipart](http://www.wpclipart.com/recreation/games/dice/)
___

## API Notes
___

### Verifying backend API

There is a Postman collection included test/LiarsDice.json.postman_collection. This file can be loaded into the Chrome app, Postman and demonstrates usage of all the endpoints.

### Endpoints

* Start a new game

    ```
    POST /games
        numPlayers: Integer
        numDice: Integer
    ```

* Get a single game

    ```
    GET /games/:id
    ```

* List Games

    ```
    GET /games
    ```

#### On a users turn, they can either make a claim and move dice to the middle, or challenge the previous player.

* Make a claim

    ```
    POST /games/:id/claim
        player: Integer
        moveNumber: Integer
        moveFace: Integer
        claimNumber: Integer
        claimFace: Integer
    ```

* Challenge the last move

    ```
    POST /games/:id/challenge
        player: Integer
    ```

##Submission

The final submission or any questions related to the excercise should be sent to recruiting@bypassmobile.com

Thanks!