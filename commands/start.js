const index = require('/Users/soondos/Desktop/independent/TrialBot/index.js');
const Game = require('/Users/soondos/Desktop/independent/TrialBot/commands/game.js');
const Room = require('/Users/soondos/Desktop/independent/TrialBot/objects/room.js');

const game = new Game();

class Start {
    constructor(client, input, args, connection) {
        this.client = client;
        this.input = input;
        this.args = args;
        this.connection = connection;
    }


// module.exports = { // these are functions that will not be called within this file, but called by another.


    startGame(client, input, connection) {
        // let msg = await input.channel.send("Generating thing...");
        // let target = input.mentions.users.first() || input.author;
         connection.query(`SELECT * FROM user_info WHERE userID = '${input.author.id}'`, (err, rows) => {
             if(err) throw err; 
     
             let sql;
     
             if(rows.length < 1) {
                 sql = `INSERT INTO user_info (userID, userTag) VALUES ('${input.author.id}', '${input.member.user.tag}')`;
                 input.channel.send('aw boo u a new game eh?');
                 input.channel.send(this.printWelcome());
             } 
             else {
                input.channel.send(`hunty u already have save data`);
                 // start the user off where they last left off~
             }
            // connection.query(sql, console.log);
             input.channel.send(`Okeydokey done! Starting!`);
             if(game.reportGameState() == false) {
                game.setGameState(true);
            } 
            else {
                game.setGameState(false);
            }
            input.channel.send(game.getCurrentRoom().getLongDescription());
            game.inGame(client, input, connection);
         });
     }

     printWelcome() {
        return "You find yourself lying on the floor of a barren room. \n" +
        "How did you get here? \n" +
        "You dust off your robes before slowly rising to a stand. \n" + 
        "You remember now. You, a novice mage, ran into one of the \n" +
        "most powerful mages in the kingdom. She's taking apprentices, \n" +
        "and it seems she took a liking to you. \n" +
        "She won't just let you study under her without a test, though. \n" +
        "This must be why she sent you here. \n" +
        "'Good luck, young one.' You suddenly hear a voice. \n" +
        "The master mage's voice. \n" +
        "Well. Here goes nothing. \n \n" +
        "display lets you check your health, items, and backpack weight. \n" +
        "go + a cardinal direction lets you move through rooms. \n" +
        "back lets you go to the room you were last in. \n" +
        "use + an item you are holding lets you use that item or cast from that spellbook. \n" +
        "take + an item in the room lets you pick up an item to take with you. \n" +
        "drop + an item you are holding lets you drop that item into the room you're in. \n" +
        "give + an item you are holding + a creature lets you give an item to a creature. \n" +
        "inspect + an item you are holding lets you view the item's description. \n" +
        "attack lets you attack whatever is in the room with your bare fists. \n" +
        "warp, if used in the right room, lets you teleport to a random place. \n" +
        "help lets you see your commands. \n" +
        "quit lets you quit the game. \n";
    }

    startGameState() {
        return game.reportGameState();
    }

    // startGameToggle(bool) {
    //     game.setGameState(bool);
    // }

}

 module.exports = Start;



// };

