const Room = require('/Users/soondos/Desktop/independent/TrialBot/objects/room.js');
const room = new Room();
const Game = require('/Users/soondos/Desktop/independent/TrialBot/commands/game.js');
// const game = new Game();
const Creature = require('/Users/soondos/Desktop/independent/TrialBot/objects/creature.js');

let dogSpeak = new Array(); // array of doge text
let dogRooms = new Map(); // map of what doge says in each room
let variable = Math.floor(Math.random() * dogSpeak.length);

class HellHound extends Creature {
    constructor(cName, cDescription, damage, health) {
        this.cName = cName;
        this.cDescription = cDescription;
        this.damage = damage;
        this.health = health;
    }

    createDogeWords() {
        dogSpeak.push("The hellhound nudges you playfully.");
        dogSpeak.push("The hellhound starts chasing its tail--or rather, its knobby stub of a tail.");
        dogSpeak.push("The hellhound cocks its head.");
        dogSpeak.push("The hellhound leans its head against you and gives you puppy-eyes.");
        dogSpeak.push("The hellhound barks politely at you.");
        dogSpeak.push("The hellhound sniffs the air.");
        dogSpeak.push("The hellhound whines and brushes its paw against your foot.");
        dogSpeak.push("The hellhound skips alongside you.");
    }

    createRoomWords() {
        console.log("room test name: ??? " + Game.start_room.room.getRoomName());
        dogRooms.set("start room", "The hellhound sniffs the spot on the floor where you woke up.");
        dogRooms.set("scratched-up room", "The hellhound's tail falls between its legs. It isn't very happy here...");
        dogRooms.set("expansive room", "The hellhound growls and stands in front of you protectively.");
        dogRooms.set("musty room", "The hellhound sneezes.");
        dogRooms.set("earthy-smelling room", "The hellhound bounds around the room, merrily sniffing this way and that.");
        dogRooms.set("dim room", "The hellhound follows you cautiously, tail low.");
        dogRooms.set("quiet room", "The hellhound won't stop growling.");
        dogRooms.set("cluttered room", "The hellhound starts chewing on some paper. Hope that's not important.");
        dogRooms.set("eerie room", "The hellhound runs over to where you found the skeletal arm, and, tail wagging, starts pawing.");
        dogRooms.set("warp room", "The hellhound shifts uncomfortably.");
    }
}

module.exports = HellHound;