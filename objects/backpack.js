const Room = require('/Users/soondos/Desktop/independent/TrialBot/objects/room.js');

class Backpack {
    constructor() {
        let bag = []; // empty array, to add items
        this.bag = bag;
    }
    // pick up an item from the room and add it to backpack.
    backpackAdd(item, room) {
        this.bag.push(item);
        room.removeItem(item);
        console.log("item added.");
    }

    // drop an item into the room.
    backpackDrop(item, room) {
        const index = bag.indexOf(item); // gives us the location of the item we want to remove within the array
        this.bag.splice(index, 1); // removes the 1 item at index (location, number of items removed)
        room.createItem(item);
        console.log("item removed.");
    }
    // returns true or false depending on whether or not desired item is in backpack.
    isInBackpack(item) {
        return this.bag.includes(item);

    }
}
module.exports = Backpack;