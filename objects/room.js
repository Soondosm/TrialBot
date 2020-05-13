// let exits, items, creatures;

class Room {
    constructor(name, description) {
        this.name = name;
        this.description = description;

        let exits = new Map(); // key: string(name of room), value: Room
        let items = new Map(); // string name, item object
        let creatures = new Map();
        this.exits = exits;
        this.items = items;
        this.creatures = creatures;
    }

    getRoomName() {
        return this.name;
    }

    getRoomDescription() {
        return this.description;
    }

    setRoomDescription(newText) {
        this.description = newText;
    }

    getLongDescription() {
        return "You are in " + this.name + ". \n" + this.description + "\n" + this.getExitString();
    }

    getExit(direction) {
        return this.exits.get(direction);
    }

    hasExit(direction) {
        console.log(this.exits.has(direction));
        return this.exits.has(direction);
    }

    setExit(direction, neighbor) {
        this.exits.set(direction, neighbor);
    }

    /** 
     * Return the room that is reached if we go from this room in direction
     * "direction". If there is no room in that direction, return null.
     * @param direction The exit's direction.
     * @return The room in the given direction.
     */
    getNewRoom(direction) {
        return this.exits.get(direction); 
    }

    getExitString() {
        let returnString = "There are doors on: ";
        let keys = Array.from(this.exits.keys());
        returnString += keys.join(", ") + ".";
        return returnString
    }

    // creates item and sets it to "items" hashmap
    createItem(item) {
        this.items.set(item.getName(), item);
    }

    getItemString() {
        let returnString = "The items in this room are: ";
        let keys = Array.from(this.items.keys()); // get the map's keys as an iterator and convert it into an Array.
        returnString += keys.join(", "); // join the whole array as a string with commas separating each exit.
        console.log(returnString);
        return returnString + "."
    }

    /**
     * Removes item from the items Hashmap, likely because item was picked up by player.
     * @param thing is the item we're removing.
     * @return none.
     */
    removeItem(item) {
        this.items.delete(item);
    }

    createCreature(creature) {
        this.creatures.set(creature.getCreatureName(), creature);
    }

    /**
     * Returns a string naming all of the creatures located in the room, if any.
     * "Oh! There's a Hellhound here."
     * @return names of the room's creature(s).
     */
    getCreatureString() { // NOTE: TURN THE THREE GET STRING FUNCTIONS INTO ONE METHOD W/ JSON STRING GRAB
        let returnString = "Oh! There's a ";
        let keys = Array.from(this.creatures.keys());
        returnString += keys.join(", ") + " here.";
        return returnString
    }

     /**
     * Removes creature from the creatures hashmap, likely bc of an action by player.
     * @param thing the String name of the creature we want to remove.
     */
    removeCreature(creature) {
        this.creatures.delete(creature);
    }

}
module.exports = Room; // NI CE