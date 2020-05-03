let exits = new Map(); // string key, Room variable
let items = new Map(); // string name, item object
let creatures = new Map();

class Room {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    getRoomName() {
        return this.name;
    }
    getRoomDescription() {
        return this.getRoomDescription;
    }

    getExits() {
        return this.exits;
    }

    setExit(direction, neighbor) {
        exits.set(direction, neighbor);
    }

}
module.exports = Room; // NI CE

//  module.exports = {
//      getExits: function() {
//         return room.exits;
//      },

//  };