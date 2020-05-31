const Discord = require('discord.js');
const Room = require('/Users/soondos/Desktop/independent/TrialBot/objects/room.js');
const Item = require('/Users/soondos/Desktop/independent/TrialBot//objects/item.js');

class Backpack {
    constructor() {
        let bag = []; // empty array, to consist of items
        this.bag = bag;
    }
    // pick up an item from the room and add it to backpack.
    backpackAdd(item, room) {
        this.bag.push(item);
        if(room != null)
            room.removeItem(item);
        console.log("item added.");
    }

    // drop an item into the room.
    backpackDrop(item, room) {
        this.backpackDelete(item);
        room.createItem(item);
        console.log("item added to room.");
    }

    // deletes the item from inventory. Can happen when user drops an item into room, or uses/gives an item.
    backpackDelete(item) {
        const index = this.bag.indexOf(item); // gives us the location of the item we want to remove within the array
        this.bag.splice(index, 1); // removes the 1 item at index (location, number of items removed)
        console.log("item deleted from inventory.")
    }

    // deletes the item (spellbook growth, fire, or rest) from backpack upon use. returns a string to report to player.
    bookPoof(item) {
        this.backpackDelete(item);
        return `The ` + item.getName() + ` disappears in a puff of smoke.`;

    }

    // returns desired item object if it is in backpack. Parameter is a string.
    isInBackpack(item) {
        let resultItem = null;
        for(let index = 0; index < this.bag.length; index++) {
           if(this.bag[index].getName() == item) {
               resultItem = this.bag[index];
           }
        } 

        return resultItem;
    }

    getBagItemName(item) {
        return item.getName()
    }

    getBagDescrip(item) {
        return item.getDetails()
    }

    getBagList() {
        let resultString = "";
        for(let index = 0; index < this.bag.length; index++) {
            if((index + 1) == this.bag.length) {
                resultString += this.bag[index].getName() + ".";
            } else {
            resultString += this.bag[index].getName() + ", ";
            }
        }
        if(this.bag.length == 0) {
            resultString = "nothing.";
        }
        return resultString;
    }

    getWeight() {
        let sumWeight = 0;
        for(let index = 0; index < this.bag.length; index++) {
          sumWeight +=  this.bag[index].getWeight();
        }
        return sumWeight;
    }
}
module.exports = Backpack;