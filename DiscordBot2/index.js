// require the discord.js module
const Discord = require('discord.js');
const config = require('./configure.json'); // configuration file holding token etc.
const questions = require('./questions.json'); //
const Start = require('./commands/start.js');
let start = new Start();
// const Game = require('./commands/game.js');
// const game = new Game();
const mysql = require('mysql');

// create a new Discord client
const client = new Discord.Client();
const questionListLength = questions.length; // obtains length of array in questions.json


var connection = mysql.createConnection({ // create a connection, store it in the "connection" variable
host: "localhost",
user: "root",
password: config.DatabasePassword,
database: "wizard_trials"
});

//                  -------------------------------------FUNCTIONS-----------------------------------------------


//                  -----------------------------------END FUNCTIONS---------------------------------------------
 



// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Bootying up (version 2)!');
});

connection.connect(err => { // run when database is first connected
    if(err) throw err;
    console.log("Connected to the base of data!!!");
    connection.query("SHOW TABLES", console.log);
});

// --------------------------------------------------------------------------------------------------
// ----------------------------------LISTENING FOR COMMANDS-----------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* client.on('message', message => {
    console.log(message.content);
    // message.channel.sendMessage(message.content);
});  */

client.on('message', async input=>{ // listening
  //  if(input.author.client) return; // if message entered is by bot itself, stop
    if(input.channel.type === 'dm') return; // if message entered is a dm, stop
    if(start.getGameBoolean() === 1) return; // if we're already in game, DON'T use these commands.

    let item = questions[Math.floor(Math.random() * questionListLength)];
    const testFilter = response => { // you iterate through the answers to find what you want.
        return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
    };

    let args = input.content.substring(config.Prefix.length).split(' '); // allows us to implement prefix at beginning
    
    switch(args[0]) { // 0 = first word, 1 = second, etc
        case 'help':
            input.channel.sendMessage('NO HELP FOR U. SUFFER');
            break;

        case 'question':
            input.channel.send(item.question).then(() => {
                input.channel.awaitMessages(testFilter, { maxMatches: 1, time: 3000, errors: ['time'] })
                    .then(collected => {
                        input.channel.send(`${collected.first().author} got the correct answer!`);
                    })
                    .catch(collected => {
                        input.channel.send('Looks like nobody got the answer this time.');
                    });
            });
            break;

        case 'server':
            input.channel.send(`This server's name is: ${input.guild.name} `);
            break;

        case 'start':
            input.channel.send(`Welcome!`);
            start.startGame(client, input, args, connection); // runs "start" program in start.js
            break;
            
    }
});


// login to Discord with your app's token
client.login(config.Token);