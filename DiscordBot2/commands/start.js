const index = require('/Users/soondos/Desktop/independent/DiscordBot2/index.js');
const Game = require('/Users/soondos/Desktop/independent/DiscordBot2/commands/game.js');
const game = new Game();
let gameBoolean = 0; // default = we are not in game. 

class Start {
    constructor(client, input, args, connection) {
        this.client = client;
        this.input = input;
        this.args = args;
        this.connection = connection;
    }

// module.exports = { // these are functions that will not be called within this file, but called by another.

    getGameBoolean() {
        return gameBoolean;
    }

    startGame(client, input, args, connection) {
        // let msg = await input.channel.send("Generating thing...");
        // let target = input.mentions.users.first() || input.author;
         connection.query(`SELECT * FROM user_info WHERE userID = '${input.author.id}'`, (err, rows) => {
             if(err) throw err; 
     
             let sql;
     
             if(rows.length < 1) {
                 sql = `INSERT INTO user_info (userID, userTag) VALUES ('${input.author.id}', '${input.member.user.tag}')`;
                 input.channel.send('aw boo u a new game eh?');
             } 
             else {
                input.channel.send(`hunty u already have save data`);
                 // start the user off where they last left off~
             }
            // connection.query(sql, console.log);
             input.channel.send(`Okeydokey done! Starting!`);
             if(gameBoolean === 0) {
                gameBoolean = 1;
            } 
            else {
                gameBoolean = 0;
            }
             game.inGame(client, input, connection);
         });
     }

}

 module.exports = Start;



// };

