const config = require('/Users/soondos/Desktop/independent/DiscordBot2/configure.json'); // configuration file holding token etc.
const Room = require('/Users/soondos/Desktop/independent/DiscordBot2/objects/room.js');
let currentRoom = new Room();
let heldItems = new Array();
let randomRooms = new Array();

// module.exports = { // these are functions that will not be called within this file, but called by another.

   // inGame: function(client, args, connection, game) {
class Game {
    
        constructor(client, input, connection) {
            this.client = client;
            this.input = input;
            this.connection = connection;
        }
            inGame(client, input, connection) {
                this.createRooms();
                this.createItems();
                this.createCreatures();
                console.log(currentRoom);
                client.on('message', async gameMsg=>{ 
                    if(gameMsg.channel.type === 'dm') return;
                    let command = gameMsg.content.substring(config.Prefix.length).split(' '); // allows us to implement prefix at beginning
                    switch(command[0]) {
                        case 'display':
                            gameMsg.channel.send('u got dis shit');
                            break;
                    
                        case 'go':
                            gameMsg.channel.send('go where?');
                            break;

                        case 'use':
                            gameMsg.channel.send('use wat');
                            break;
                
                        case 'take':
                            gameMsg.channel.send('take wat');
                            break;

                        case 'drop':
                            gameMsg.channel.send('drop wat');
                            break;

                        case 'give':
                            gameMsg.channel.send('give wat');
                            break;
                
                        case 'inspect':
                            gameMsg.channel.send('inspect wat');
                            break;

                        case 'attack':
                            gameMsg.channel.send('attack wat');
                            break;

                        case 'warp':
                            gameMsg.channel.send('wat, u egg??');
                            break;
                    
                        case 'help':
                            gameMsg.channel.send('WE IN GAME WHAT HELP U NEED');
                            break;
                     }
            

                });
        }

    createRooms() {
        console.log("vroom room");

        let start_room = new Room("start room", "Oh, this is the room you woke up in...");
        let boss_room = new Room("expansive room", "This is a super big room...it looks elegant but also somewhat creepy.");
        let scratched_room = new Room("scratched-up room", "This room has claw marks all over it. It smells like animals.");
        let musty_room = new Room("musty room", "This room smells a lot like old books...");
        let earthy_room = new Room("earthy-smelling room", "This quaint room has a little sprout on the ground. \n" +
        "It smells like dirt in here. There's a little ledge near the ceiling. \n" +
        "It looks like a book is hanging off of it, but...it's too high to reach.");
        let dim_room = new Room("dim room", "This is a pretty dim room...It's hard to see things in here.");
        let quiet_room = new Room("quiet room", "This room is super duper quiet, for whatever reason...");
        let cluttered_room = new Room("cluttered room", "This looks like your potential master's study space. \n" +
        "Torn papers and sticks and broken potion bottles are everywhere.");
        let eerie_room = new Room("eerie room", "This place gives you an eerie feeling...");
        let warp_room = new Room("warp room", "This is definitely a room intense with magic. \n" + 
        "Runic circles and symbols are etched everywhere. The entire room glows with \n" +
        "power. you feel like you can cast any spell you want here. Or you can \n" +
        "try to teleport...");

        let fight_room = new Room("", ""); // the combat room. It does not need descriptions or anything. This is just
        //where we place fightingCreature.
        
        // initialise room exits
        start_room.setExit("east", dim_room);
        start_room.setExit("west", scratched_room);
        start_room.setExit("south", boss_room);
        start_room.setExit("north", musty_room);
        
        boss_room.setExit("north", start_room);
        
        scratched_room.setExit("east", start_room);
        scratched_room.setExit("north", earthy_room);
        
        musty_room.setExit("south", start_room);
        musty_room.setExit("east", quiet_room);
        musty_room.setExit("west", earthy_room);
        musty_room.setExit("north", eerie_room);
        
        earthy_room.setExit("south", scratched_room);
        earthy_room.setExit("east", musty_room);
        earthy_room.setExit("north", cluttered_room);
        
        dim_room.setExit("west", start_room);
        dim_room.setExit("north", quiet_room);
        
        quiet_room.setExit("west", musty_room);
        quiet_room.setExit("south", dim_room);
        
        cluttered_room.setExit("east", eerie_room);
        cluttered_room.setExit("south", earthy_room);
        cluttered_room.setExit("north", warp_room);
        
        eerie_room.setExit("south", musty_room);
        eerie_room.setExit("west", cluttered_room);
        
        warp_room.setExit("south", cluttered_room);

        currentRoom = start_room; // start game in the starting room

        randomRooms.push(start_room);
        randomRooms.push(boss_room);
        randomRooms.push(scratched_room);
        randomRooms.push(musty_room);
        randomRooms.push(earthy_room);
        randomRooms.push(dim_room);
        randomRooms.push(quiet_room);
        randomRooms.push(cluttered_room);
        randomRooms.push(eerie_room);
        randomRooms.push(warp_room);

    }

    createItems() {
        console.log("item bite em");

    }

    createCreatures() {
        console.log("creature creeper");

    }
}

module.exports = Game;

// };