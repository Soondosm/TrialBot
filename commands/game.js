const config = require('/Users/soondos/Desktop/independent/TrialBot/configure.json'); // configuration file holding token etc.
const Room = require('/Users/soondos/Desktop/independent/TrialBot/objects/room.js');
const Item = require('/Users/soondos/Desktop/independent/TrialBot//objects/item.js');
const Backpack = require('/Users/soondos/Desktop/independent/TrialBot/objects/backpack.js');
const Hellhound = require('/Users/soondos/Desktop/independent/TrialBot/objects/hellhound.js');
const Creature = require('/Users/soondos/Desktop/independent/TrialBot/objects/creature.js');

const InGame = require('/Users/soondos/Desktop/independent/TrialBot/objects/ingame.js');
let gameBoolean = new InGame(); // default = we are not in game. 

let hellhound = new Hellhound();
let backpack = new Backpack();


let start_room, boss_room, scratched_room, musty_room, eerie_room, fight_room,
earthy_room, dim_room, quiet_room, cluttered_room, warp_room, lastRoom; // rooms

let hurt_fairy, dead_fairy, boss_key, bone, normal_bone, knife, book_rest,
 book_fire, book_firaga, book_growth; //items

let bottled_fairy, gargoyle, master, skeleton, fighting_creature; // creatures

let currentRoom = new Room("current room", "this is our current room.");
let heldItems = new Array();
let randomRooms = new Array();

const weightCapacity = 14;
const maxHealth = 20;
let HP = 20;
const turnLimit = 90;
let currentTurn = 0;
let dogFriend = false;
let fairyFriend = false;
let warpDestroyed = false;
let plantDestroyed = false;

class Game {
    
        constructor(client, input, connection) {
            this.client = client;
            this.input = input;
            this.connection = connection;

            console.time(); // performance test
            this.createRooms();
            this.createItems();
            this.createCreatures();
            hellhound.createDogeWords();
            hellhound.createRoomWords();
            console.timeEnd(); // performance test
        }
            inGame(client, input, connection) {               

                client.on('message', async gameMsg=>{ 
                    if(gameBoolean.getGameBoolean() == false) return;
                    if(gameMsg.channel.type === 'dm') return;
                    let command = gameMsg.content.substring(config.Prefix.length).split(' '); // allows us to implement prefix at beginning
                    currentTurn++;

                    switch(currentTurn, HP) {
                        case currentTurn > turnLimit:
                            this.turnBorneLoss(gameMsg);
                            break;
                        case HP <= 0:
                            this.healthBorneLoss(gameMsg);
                            break;
                    }
                    // if(currentTurn > turnLimit) {
                        
                    // }

                    switch(command[0]) {
                        case 'display':
                            currentRoom.getItemString();
                            this.printDisplay(gameMsg);
                            break;
                        case 'go':
                            if(!command[1]) {
                                gameMsg.channel.send('go where?');
                            } else {
                                this.goRoom(command[1], gameMsg);
                            }

                            break;

                        case 'use':
                            gameMsg.channel.send('use wat');
                            break;
                
                        case 'take':
                            if(!command[1]) {
                                gameMsg.channel.send('take what?');
                            } else {
                                this.takeItem(command[1], gameMsg);
                            }
                            break;

                        case 'drop':
                            if(!command[1]) {
                                gameMsg.channel.send('drop what?');
                            } else {
                                this.dropItem(command[1], gameMsg);
                            }
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

                        case 'quit':
                            this.quitProcess(gameMsg);

                     }
            

                });
        }
        // note to make cleaner via loop.
    createRooms() {
        start_room = new Room("start room", "Oh, this is the room you woke up in...");
        boss_room = new Room("expansive room", "This is a super big room...it looks elegant but also somewhat creepy.");
        scratched_room = new Room("scratched-up room", "This room has claw marks all over it. It smells like animals.");
        musty_room = new Room("musty room", "This room smells a lot like old books...");
        earthy_room = new Room("earthy-smelling room", "This quaint room has a little sprout on the ground. \n" +
        "It smells like dirt in here. There's a little ledge near the ceiling. \n" +
        "It looks like a book is hanging off of it, but...it's too high to reach.");
        dim_room = new Room("dim room", "This is a pretty dim room...It's hard to see things in here.");
        quiet_room = new Room("quiet room", "This room is super duper quiet, for whatever reason...");
        cluttered_room = new Room("cluttered room", "This looks like your potential master's study space. \n" +
        "Torn papers and sticks and broken potion bottles are everywhere.");
        eerie_room = new Room("eerie room", "This place gives you an eerie feeling...");
        warp_room = new Room("warp room", "This is definitely a room intense with magic. \n" + 
        "Runic circles and symbols are etched everywhere. The entire room glows with \n" +
        "power. you feel like you can cast any spell you want here. Or you can \n" +
        "try to teleport...");

        fight_room = new Room("", ""); // the combat room. It does not need descriptions or anything. This is just
        // where we place fightingCreature.
        
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
        hurt_fairy = new Item("hurt_fairy", "A 3-inch tall fairy, missing a wing, is trembling." + "\n" + 
        "It doesn't look like he can move very far.", 1, 0);
        dead_fairy = new Item("dead_fairy", "The fairy's dead...", 1, 0);
        boss_key = new Item("boss_key", "A glittering key sits on the floor, underneath the fairy.", 4, 0);
        bone = new Item("charred_bone", "This looks like a sizeable bone--perfect for a dog to chew on.", 2, 0);
        normal_bone = new Item("bone", "This is a pretty decent bone for a dog to chew on.", 2, 0);
        knife = new Item("knife", "A shiny iron knife. A gargoyle was trying to enjoy" +
        "its stone omelette with this.", 2, 2);
        book_rest = new Item("spellbook_rest", "A mage book that, when cast, puts enemies to sleep.", 10, 0);
        book_fire = new Item("spellbook_fire", "A mage book that, when cast, flings a small fireball.", 10, 3);
        book_firaga = new Item("spellbook_firaga", "A mage book that, when cast, flings a large fireball.", 5, 6);
        book_growth = new Item("spellbook_growth", "A mage book that, when cast, promotes the growth of plantlife.", 10, 0);
        
        // initializes the placement of items within rooms.
        musty_room.createItem(book_fire);
        musty_room.createItem(book_rest);
        musty_room.createItem(book_growth);
        
        quiet_room.createItem(knife);
        
        cluttered_room.createItem(hurt_fairy);
        cluttered_room.createItem(boss_key);
        console.log("item bitem");
    }


    createCreatures() {
        //creates creatures
        hellhound = new Hellhound("Hellhound", "It growls menacingly at you. It's held in place only by rope...", 4, 10);
        bottled_fairy = new Creature("Bottled Fairy", "She's crying with her face buried in her hands. \n" +
        "Her voice sounds like sad little bells...", 3, 5);
        gargoyle = new Creature("Gargoyle", "The gargoyle statue thing is sitting in a teeny chair in front of a table, \n" +
        "holding a knife over what looks like a flat rock shaped to look like a sunny-side up egg. \n" +
        "It's completely frozen...is it even real? Can it move?", 6, 25);
        master = new Creature("Master", "It's your master...", 5, 35);
        skeleton = new Creature("Skeletal Arm", "This skeletal arm is sticking out in the middle of the ground, \n" +
        "as if the person who used to own it died while trying to reach for something...", 1, 3);
        
        fighting_creature = new Creature("", "", 0, 0); //this creature will have nothing in it until it is replaced by an actual creature.

        //initializes placement of creatures.
        scratched_room.createCreature(hellhound);
        dim_room.createCreature(bottled_fairy);
        quiet_room.createCreature(gargoyle);
        eerie_room.createCreature(skeleton);
        boss_room.createCreature(master);
        
        fight_room.createCreature(fighting_creature); //places the fighting creature into combat room. Note
        //that current room is never actually set to fight room at any point in the game.

    }
    getCurrentRoom() {
        return currentRoom
    }

    /** 
     * Try to go in one direction. If there is an exit, enter
     * the new room, otherwise print an error message.
     */
    goRoom(direction, gameMsg) {
        let nextRoom = currentRoom.getExit(direction);
        if(!currentRoom.hasExit(direction)) {
            gameMsg.channel.send(`There's no door here.`);
        } else if(nextRoom == boss_room && (backpack.isInBackpack(boss_key) == false)) {
            gameMsg.channel.send('This door is locked.');
        } else {
            lastRoom = currentRoom; // saves the previous room we were at to come back to later.
            /*If we exit the cluttered room and leave the hurt fairy item in it, fairy dies and cant be taken anymore.*/
            // let fairyTest = hurt_fairy.getName(); // should be a string, "hurt_fairy"
            if(currentRoom == cluttered_room && (currentRoom.getItemString().includes(hurt_fairy.getName()) == true)
          //   && (backpack.isInBackpack(hurt_fairy) == false)
            ) { 
                console.log(currentRoom.getItemString());
                console.log("hurt fairy registered: " + currentRoom.getItemString().includes(hurt_fairy.getName()));
                this.fairyDies();
            }
            currentRoom = nextRoom;
            gameMsg.channel.send(currentRoom.getLongDescription());
        }
    }
    // executes if we let the fairy die.
    fairyDies() {
        cluttered_room.removeItem(hurt_fairy.getName());
        cluttered_room.setRoomDescription("This looks like your master's messy study space...but the little injured fairy" + "\n" +
        "here is laying on the floor, quiet. He may have died from his wounds...");

    }

    takeItem(item, gameMsg) {
        const chosenItem = currentRoom.getItem(item);
        if(chosenItem == null) {
            gameMsg.channel.send(`That item isn't in this room.`);
        }else if(chosenItem.getWeight() + backpack.getWeight() > weightCapacity) { // if new item weight + backpack weight > weight capacity (14)
            gameMsg.channel.send(`You're carrying too much! Drop something first.`);
        } else {
            backpack.backpackAdd(chosenItem, currentRoom); 
            gameMsg.channel.send(`You took the ` + item + `.`);
        }
    }

    dropItem(item, gameMsg) { //item is a STRING. we need to convert to item.
        let bagString = backpack.isInBackpack(item);
        if(bagString == null) {
            gameMsg.channel.send(`That item isn't in your bag.`);
        }else if(bagString == hurt_fairy) {
            backpack.backpackDelete(bagString);
            currentRoom.createItem(dead_fairy);
            gameMsg.channel.send(`The fairy drops to the ground with a tiny thud, since he can't fly. He's not moving...`);
        } else {
            backpack.backpackDrop(bagString, currentRoom);
            gameMsg.channel.send(`You dropped the ` + item + ` on the floor in front of you.`);
        }
    }

    printDisplay(gameMsg) {
        gameMsg.channel.send(`You are currently carrying ` + backpack.getBagList());
        gameMsg.channel.send(`These items together weigh ` + backpack.getWeight() + ` pounds. You can carry up to ` + weightCapacity + `.`);
        gameMsg.channel.send(`Your current health is ` + HP + `/` + maxHealth + `.`);
        gameMsg.channel.send(`You have currently taken ` + currentTurn + ` actions. Don't fool around too long...`);
        if(dogFriend == true) {
            gameMsg.channel.send(`Your new hellhound friend is following you!`);
        }
    }

    turnBorneLoss(gameMsg) {
        gameMsg.channel.send(`"Gods," you suddenly hear the master say, "How slow can you get? I'm done with you." \n` +
        `Everything suddenly goes black...`);
        this.quitProcess(gameMsg);
    }

    healthBorneLoss(gameMsg) {
        gameMsg.channel.send(`Your wounds overwhelm you and you collapase. Everything goes black...`);
        this.quitProcess(gameMsg);
    }

    quitProcess(gameMsg) {
        gameMsg.channel.send('Exiting game...');
        gameBoolean.setGameBoolean(false);
    }

    reportGameState() {
        return gameBoolean.getGameBoolean();
    }

    setGameState(state) {
        gameBoolean.setGameBoolean(state);
    }

}

module.exports = Game;