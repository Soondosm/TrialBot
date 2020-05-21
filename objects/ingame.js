// just a simple boolean class that tells us whether we're in game or not.

class InGame {
    constructor() {
        let gameState = false;
        this.gameState = gameState;
    }

    getGameBoolean() {
        return this.gameState;
    }

    setGameBoolean(newValue) {
        this.gameState = newValue;
    }

}

module.exports = InGame;