const config = require('/Users/soondos/Desktop/independent/TrialBot/configure.json'); // configuration file holding token etc.
const Room = require('/Users/soondos/Desktop/independent/TrialBot/objects/room.js');
const Item = require('/Users/soondos/Desktop/independent/TrialBot//objects/item.js');
const Backpack = require('/Users/soondos/Desktop/independent/TrialBot/objects/backpack.js');
const Hellhound = require('/Users/soondos/Desktop/independent/TrialBot/objects/hellhound.js');
const Creature = require('/Users/soondos/Desktop/independent/TrialBot/objects/creature.js');

const InGame = require('/Users/soondos/Desktop/independent/TrialBot/objects/ingame.js');
let gameBoolean = new InGame(); // default = we are not in game. 
let gameHasQuit = false; // to avoid duplicate Game objects, we need to know if we've "quit" once before already.

let hellhound = new Hellhound();
let backpack = new Backpack();


let start_room, boss_room, scratched_room, musty_room, eerie_room, fight_room,
earthy_room, dim_room, quiet_room, cluttered_room, warp_room, lastRoom; // rooms

let hurt_fairy, dead_fairy, boss_key, burned_bone, normal_bone, knife, book_rest,
 book_fire, book_firaga, book_growth; //items

let lone_fairy, gargoyle, master, skeleton, fighting_creature; // creatures

let currentRoom = new Room("current room", "this is our current room.");
let randomRooms = new Array();

const validCommands = [`display`, `go`, `use`, `take`, `drop`, `give`, `inspect`, `attack`, `warp`, `help`]

const weightCapacity = 14;
const maxHealth = 20;
let HP = 20;
const turnLimit = 90;
let currentTurn = 0;
let dogCompanion, dogFree, fairyFriend, warpDestroyed, plantDestroyed;
dogCompanion = dogFree = fairyFriend = warpDestroyed = plantDestroyed = false;

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
                    let testCommand = gameMsg.content.toLowerCase();
                    console.log(testCommand);
                    let command = gameMsg.content.substring(config.Prefix.length).split(' '); // allows us to implement prefix at beginning
                    if(this.turnCheck(command[0]) == true) currentTurn++;
                   
                    if(currentTurn > turnLimit) {
                        this.turnBorneLoss(gameMsg);
                    } else if (HP <= 0) {
                        this.healthBorneLoss(gameMsg);
                    }

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
                            if(!command[1]) {
                                gameMsg.channel.send('use wat');
                            } else {
                                this.useItem(command[1], gameMsg);
                            }
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
                            let target = command[2];
                            if(command[3]) target += " " + command[3];
                            if(!command[1]) {
                                gameMsg.channel.send('Give what?');
                            }else if(backpack.isInBackpack(command[1]) == null) {
                                gameMsg.channel.send(`You don't have that in your bag.`);
                            } else if(!command[2]) {
                                gameMsg.channel.send(`Give ` + command[1] + ` to who?`); 
                            } else if(currentRoom.getCreature(target) == null) {
                                console.log("test" + currentRoom.getCreature(target));
                                gameMsg.channel.send(`There is no ` + target + ` in this room.`);
                            } else {
                                this.giveItem(command[1], target, gameMsg);
                            }
                            
                            break;
                
                        case 'inspect':
                            if(!command[1]) {
                                gameMsg.channel.send(`Inspect what?`);
                            } else {
                                let object;
                                if(command[2]) {
                                    object = command[1] + " " + command[2];
                                } else { 
                                    object = command[1];
                                }
                                this.inspectThing(object, gameMsg);
                            }
                            break;

                        case 'attack':
                            let opponent = command[1];
                            if(!command[1]) {
                                gameMsg.channel.send('You punch the air. nice.');
                            } else {
                                if(command[2]) {
                                    opponent += " " + command[2];
                                }
                                this.attack(opponent, gameMsg);
                            }
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
        burned_bone = new Item("charred_bone", "This looks like a sizeable bone--perfect for a dog to chew on.", 2, 0);
        normal_bone = new Item("bone", "This is a pretty decent bone for a dog to chew on.", 2, 0);
        knife = new Item("knife", "A shiny iron knife. A gargoyle was trying to enjoy " +
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
        lone_fairy = new Creature("Lone Fairy", "She's crying with her face buried in her hands on the floor. \n" +
        "Her voice sounds like sad little bells...what's she crying about? Has she lost something?", 3, 5);
        gargoyle = new Creature("Gargoyle", "The gargoyle statue thing is sitting in a teeny chair in front of a table, \n" +
        "holding a knife over what looks like a flat rock shaped to look like a sunny-side up egg. \n" +
        "It's completely frozen...is it even real? Can it move?", 6, 25);
        master = new Creature("Master", "It's your master...", 5, 35);
        skeleton = new Creature("Skeletal Arm", "This skeletal arm is sticking out in the middle of the ground, \n" +
        "as if the person who used to own it died while trying to reach for something...", 1, 3);
        
        fighting_creature = new Creature("", "", 0, 0); //this creature will have nothing in it until it is replaced by an actual creature.

        //initializes placement of creatures.
        scratched_room.createCreature(hellhound);
        dim_room.createCreature(lone_fairy);
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
        } else if(nextRoom == boss_room && (backpack.isInBackpack(boss_key) == null)) {
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

    useItem(item, gameMsg) {
        let bagString = backpack.isInBackpack(item);
        if(bagString == null && currentRoom != warp_room ) {
            gameMsg.channel.send(`You don't have that in your inventory.`);

        } else if(bagString == burned_bone || bagString == boss_key || bagString == hurt_fairy) {   // you can't use these items for anything. 
            gameMsg.channel.send(`You aren't sure how to use this.`);

         // the if statement for the mage book of growth. can cause the sapling to grow into a massive plant that lets you reach firaga.
        } else if((bagString == book_growth) && (currentRoom == earthy_room)) {
            switch(plantDestroyed) {
                case true:
                    gameMsg.channel.send(`There's nothing to grow here anymore, you plant-burning monster.`);
                    break;

                case false:
                    gameMsg.channel.send(backpack.bookPoof(bagString)); // book of growth poofs bc we used it in earthy room.
                    gameMsg.channel.send(`The sapling fills with light, and grows and grows all the way up to the room's ceiling. 
You climb the now massive plant, and find yourself within reach of the book you had no hope of grabbing before.`);
                    backpack.backpackAdd(book_firaga, currentRoom);
                    gameMsg.channel.send(`You have obtained a ` + book_firaga.getName() + `!`);
                    currentRoom.setRoomDescription(`This quaint room has a now massive plant that takes up a good portion of the room. 
There's a little ledge close to the ceiling, but there's nothing hiding up there anymore.`);
                    break;
            } 
            
        } else if((bagString == book_fire || bagString == book_firaga) && (currentRoom == earthy_room)) {
                switch(plantDestroyed) {
                    case true:
                        gameMsg.channel.send(`You've already destroyed everything in here. What more do you want?`);
                        break;

                    case false:
                        plantDestroyed = true;
                        if(bagString == book_fire) {
                            gameMsg.channel.send(backpack.bookPoof(bagString));
                        }
                        gameMsg.channel.send(`You set fire to the plant. The room is nothing but walls of flame for several minutes. 
By the end of the carnage, the room is reduced to ash...`);
                        earthy_room.setRoomDescription(`This room is all burnt up thanks to your fiery spell...`);
                        break;
                }  
                            // using a book in quiet room on gargoyle
        } else if(currentRoom == quiet_room && currentRoom.getCreatureName() == gargoyle.getCreatureName()) { 
            switch(bagString){
                case book_rest:
                    gameMsg.channel.send(backpack.bookPoof(bagString));
                    currentRoom.removeCreature(gargoyle);
                    gameMsg.channel.send(`The gargoyle closes its eyes...and then crumbles to dust, and the iron knife it was holding clatters 
on the floor. It is yours to take now, if you so wish...`);
                    currentRoom.setRoomDescription(`This quiet room now has little more than a pile of dust on the floor, 
all thanks to your clever work.`);
                    break;
                case book_fire || book_firaga:
                    if(bagString == book_fire) {
                        gameMsg.channel.send(backpack.bookPoof(bagString));
                    }
                    const damageTaken = bagString.getPower()/2;
                    gargoyle.setCHealth(gargoyle.getCHealth() - damageTaken)
                    gameMsg.channel.send(`The gargoyle takes` + damageTaken + `points of damage! 
The gargoyle stirs. It roars...and charges at you!`);
                    break;
                    // implement fighting later...
            }
        } else if(currentRoom == dim_room && currentRoom.getCreatureName() == lone_fairy.getCreatureName()) {
             switch(bagString) {
                 case book_fire || book_firaga:
                     if(bagString == book_fire) {
                         gameMsg.channel.send(backpack.bookPoof(bagString));
                     }
                     gameMsg.channel.send(`The fairy's eyes gleam with rage. She raises an arm and the blast of fire riderects...straight at you. 
You fly back and hit the wall. You are blinded by the light. You can feel your body burning up...`);
                    currentRoom.removeCreature(lone_fairy.getCreatureName());
                    HP = 0;
                    break;
                
                case book_rest:
                    gameMsg.channel.send(backpack.bookPoof(bagString));
                    gameMsg.channel.send(`The fairy falls asleep, tears still on her face...Did you do the right thing? 
 At least she's quiet now...`);
                    lone_fairy.setCDescription("The fairy's asleep...");
                    break;
             }
        } else if((bagString == book_firaga || bagString == book_fire) && currentRoom == scratched_room && dogCompanion == false) {
                if(dogFree == false)  dogFree = true;
                if(bagString == book_fire) gameMsg.channel.send(backpack.bookPoof(bagString));
                hellhound.setCHealth(hellhound.getCHealth() - bagString.getPower());
                gameMsg.channel.send(`The hellhound yips in pain! It takes ` + bagString.getPower() + ` points of damage from your attack. 
The rope burns away, freeing it...and it attacks!`);
                hellhound.setCDescription(`Because you've burnt it, the hellhound is furious with you! And it's no longer restrained!`);
                // FIGHT
            
        } else if(bagString == knife && currentRoom == scratched_room) {
            switch(hellhound.getCHealth()){
                case hellhound.getFriendlyHealth(): // friendly health == 12, higher than default maximum. it becomes 12 when given bone.
                    dogCompanion = true;
                    currentRoom.removeCreature(hellhound.getName());
                    gameMsg.channel.send(`The hellhound does a skip and a spin. It seems you've made him 
pretty happy! He seems to want to follow you...`);
                    currentRoom.setRoomDescription("This room has nothing but a loose length of rope in it, now.");
                    break;

                default:
                    HP = HP - hellhound.getCreatureDmg();
                    dogFree = true;
                    gameMsg.channel.send(`You cut the rope binding the hellhound. It breaks free! It does not seem happy. 
The creature bites you! Ouch! You take ` + hellhound.getCreatureDmg() + ` points of damage.`);
                     hellhound.setCDescription("This hellhound is angry and now that it's free, it charges at you!");
                     // FIGHT HAPPENS HERE;;;
                     break;
            }
                
        } else if(currentRoom == eerie_room && bagString == book_firaga || bagString == book_fire && 
            currentRoom.getCreatureName() == skeleton.getCreatureName()) {
            if(bagString == book_fire) gameMsg.channel.send(backpack.bookPoof(bagString));
            currentRoom.removeCreature(skeleton.getCreatureName());
            gameMsg.channel.send(`The skeletal arm burns quite nicely and crumbles to the ground. 
Now there's a really nice charred_bone on the ground...`);
            currentRoom.createItem(burned_bone); // charred bone obtained!

        } else if(currentRoom == warp_room) {
            switch(warpDestroyed) {
                case false: // runes in warp room are NOT destroyed
                    switch(item) {
                        case book_fire.getName() || book_firaga.getName():
                            gameMsg.channel.send(`You blast fire all over the place. The runes are destroyed...`);
                            warpDestroyed = true;
                            break;

                        case book_growth.getName():
                            gameMsg.channel.send(`Flowers bloom around you. what a pretty spell!`);
                            break;

                        case book_rest.getName():
                            gameMsg.channel.send(`The world goes dark for a moment...oops. Since there was no one in the room 
to cast this spell on but yourself, it looks like you were the one who fell asleep...`);
                             break;

                        default:
                            gameMsg.channel.send(`You aren't sure what that spell is, let alone how to try casting it without hurting yourself.`)
                    }
                    break;

                case true: //runes in warp room ARE destroyed so nothing works
                    gameMsg.channel.send(`Because you've destroyed the runes, there is no magic here anymore.`);
                    break;
            }

        } else if((bagString == book_growth && currentRoom != earthy_room) || 
        (bagString == book_rest && currentRoom != dim_room, quiet_room, fight_room) ||
        ((bagString == book_fire || book_firaga) && currentRoom == scratched_room && dogCompanion == true ) || 
        ((bagString == book_fire || book_firaga) && currentRoom != earthy_room && currentRoom.hasCreature() == false)) {
            gameMsg.channel.send(`Nothing happened...`);
        }

    }

    takeItem(item, gameMsg) {
        const chosenItem = currentRoom.getItem(item);
        if(chosenItem == null) {
            gameMsg.channel.send(`That item isn't in this room.`);
        }else if(chosenItem.getWeight() + backpack.getWeight() > weightCapacity) { // if new item weight + backpack weight > weight capacity (14)
            gameMsg.channel.send(`You're carrying too much! Drop something first.`);
        }else if(currentRoom == quiet_room && chosenItem == knife && currentRoom.getCreature() == gargoyle) {
            gameMsg.channel.send(`Just as you begin to pry the knife from the gargoyle's hand... it moves! Turns out, it's alive. 
And it's not happy you tried to disturb it from its meal. It attacks!`);
            // FIGHTING HAPPENS HERE GO GO
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

    giveItem(item, recipient, gameMsg) {
        let wantedItem = backpack.isInBackpack(item); // gets item object
        let wantedCreature = currentRoom.getCreature(recipient); // gets creature object
        switch(wantedCreature) {
            case hellhound:
                switch(wantedItem) {
                    case burned_bone || normal_bone:
                        if(dogFree == false) {
                            hellhound.setCHealth(hellhound.getFriendlyHealth());
                            backpack.backpackDelete(wantedItem);
                            gameMsg.channel.send(`The hellhound blinks down at the bone you place before it. Its tail wags... 
Its barking has stopped entirely. It gnaws contentedly on the bone--it's pretty happy now. It even looks kinda cute...`);
                            hellhound.setCDescription(`Thanks to the bone you've given it, it seems super happy. 
It's gnawing merrily on the bone. It doesn't even notice you if you walk over.`);     
                        } else {
                            gameMsg.channel.send(`All it appears focused on is keeping you away. It doesn't want to lower its guard at all...`);
                        }
                        break;

                    default:
                        gameMsg.channel.send(`It doesn't seem interested in that.`);
                        break;
                }
                break;
            case lone_fairy:
                switch(wantedItem) {
                    case hurt_fairy:
                        fairyFriend = true;
                        HP = maxHealth; // 20
                        currentRoom.removeCreature(recipient);
                        backpack.backpackDelete(item);
                        gameMsg.channel.send(`You show the hurt fairy to his mother. The two fairies embrace, both crying little bells of joy. 
The mother envelops you in golden magic...` + "\n" +
                        `Your health has been completely restored!` + "\n" +
                        `The united pair disappear in a shower of fairy sparkles.`);    
                        break;
                    
                    case dead_fairy:
                        gameMsg.channel.send(`The fairy stares at the little corpse you offer her. She slowly emerges from the bottle. She is not happy. 
Without warning, she raises her arm and lights the entire room in an explosion. You fly back, entire body burning up...`);
                        HP = 0;
                        break;
            
                    default:
                        HP -= lone_fairy.getCreatureDmg();
                        currentRoom.removeCreature(recipient);
                        gameMsg.channel.send(`The fairy doesn't seem to like what you're holding out to it. Her sadness turns to anger, and she 
leaps into the air with a flap of her wings. A shower of burning sparks burst from her raised palms. Ouch! 
\n You take ` + lone_fairy.getCreatureDmg() + ` damage. She then vanishes in a flash of angry glitter...` );
                        break; 
                }
                    break;

                default:
                    gameMsg.channel.send(`It doesn't seem to give you much of a reaction to what you extend towards it.`);
                    break;
            }
           
    }

    inspectThing(thing, gameMsg){
        let this_room = "room";
        let bagString = backpack.isInBackpack(thing); // string of item in backpack
        if(bagString != null) bagString = bagString.getName();
        
        let roomItemString = currentRoom.getItem(thing); // string of item within room
        if(roomItemString != null) roomItemString = roomItemString.getName();

        let roomString = currentRoom.getRoomName(); // string of room itself, or just "room"

        let creatureString = currentRoom.getCreature(thing); // string of creature in room
        if(creatureString != null) creatureString = creatureString.getCreatureName();
        switch(thing) {
            case bagString:
                gameMsg.channel.send(backpack.getBagDescrip(backpack.isInBackpack(thing)));
                break;

            case roomItemString:
                gameMsg.channel.send(currentRoom.getItem(thing).getDetails());
                break;

            case roomString:
                gameMsg.channel.send(currentRoom.getRoomDescription());
                break;

            case this_room:
                gameMsg.channel.send(currentRoom.getRoomDescription());
                break;

            case creatureString:
                gameMsg.channel.send(currentRoom.getCreature(thing).getCreatureDescription()); // get current room's creature object, get its description
                break;

            default:
                gameMsg.channel.send(`That doesn't seem to be here.`);
                break;
        }
    }

    attack(target, gameMsg) {
        const wantedCreature = currentRoom.getCreature(target);
        switch(wantedCreature) {
            case gargoyle:
                gargoyle.setCHealth(gargoyle.getCHealth() - 1);
                gameMsg.channel.send(`You deliver a wimpy punch to the gargoyle's nose for 1 damage. 
It doesn't seem to like that. In fact, it attacks!`);
                // FIGHT
                break;

            case lone_fairy:
                gameMsg.channel.send(`Attack the crying fairy? How could you? The most you can bring yourself to do is scuff your foot near her.`);
                break;

            case skeleton:
                HP -= 1;
                gameMsg.channel.send(`You throw your best punch at the skeletal arm. It scratches you in the process for 1 point of damage.
But hey, after that one attack, it crumbles into a nice bone!`);
                currentRoom.removeCreature(skeleton.getCreatureName());
                currentRoom.createItem(normal_bone); 
                break;

            case hellhound:
                HP -= 1;
                gameMsg.channel.send(`The hellhound catches your fist in its mouth and bites down. You take 1 point of damage! 
Maybe punching at it when it's so angry isn't a good idea...`);
                break;
            
            case null:
                gameMsg.channel.send(`That creature isn't here.`);
                break;

            default:
                gameMsg.channel.send(`Your flimsy punch fails to connect with anything.`);
                break;
        }
    }

    printDisplay(gameMsg) {
        gameMsg.channel.send(`You are currently carrying ` + backpack.getBagList());
        gameMsg.channel.send(`These items together weigh ` + backpack.getWeight() + ` pounds. You can carry up to ` + weightCapacity + `.`);
        gameMsg.channel.send(`Your current health is ` + HP + `/` + maxHealth + `.`);
        gameMsg.channel.send(`You have currently taken ` + currentTurn + ` actions. Don't fool around too long...`);
        if(dogCompanion == true) {
            gameMsg.channel.send(`Your new hellhound friend is following you!`);
        }
    }

    turnCheck(command) {
        let isValid = false;
        for(let i = 0; i < validCommands.length; i++) {
            if(command == validCommands[i]) isValid = true;
        }
        return isValid;
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
        gameHasQuit = true;
      //  this.client.destroy();

    }

    reportGameState() {
        return gameBoolean.getGameBoolean();
    }

    setGameState(state) {
        gameBoolean.setGameBoolean(state);
    }

    /**
     * In order to not keep running new inGame() functions every time start.js's script runs, we report the boolean of 
     * whether or not the game has quit once already and therefore does not need to be "booted up" again.
     * @return boolean whether or not game has already been exited once already
     */
    getGameInitHistory() {
        return gameHasQuit
    }

    /**
     * resets the game's stuff so that if you quit and come back or win and wanna start anew, ur not where we left off.
     */
    gameReset() {
        currentTurn = 0; // reset turn count?
        this.createRooms();
        currentRoom = start_room;
        console.log(currentRoom.getRoomName());
        this.createItems();
        this.createCreatures();
        HP = maxHealth;
        backpack = new Backpack();
        dogCompanion, fairyFriend, warpDestroyed, plantDestroyed = false;


    }

}

module.exports = Game;