let finish; // a boolean. While false, fight sequence continues.

class FightMode {
    // int HP, room object fight_room, creature fighting creature, backpack held items, boolean dogfriend
    constructor(client, HP, fight_room, fightingCreature, heldItems, dogFriend) { 
        this.client = client;
        this.HP = HP;
        this.fight_room = fight_room;
        this.fightingCreature = fightingCreature;
        this.heldItems = heldItems;
        this.dogFriend = dogFriend;

    }

    fight(gameMsg) {
        gameMsg.channel.send(this.printWelcome());
        finish = false;
        while(finish == false) {
            client.on('message', async fightMsg=>{
                gameMsg.channel.send(`What will you do?`);
                let command = fightMsg.content.toLowerCase();
                command = command.substring(config.Prefix.length).split(' '); // allows us to implement prefix at beginning
                switch(command[0]) { 
                    case 'help':
                        fightMsg.channel.send(`test for help`);
                        break;
                    
                    case 'attack':
                        fightMsg.channel.send(`test for attack`);
                        break;

                    case 'use':
                        fightMsg.channel.send(`test for use`);
                        break;

                    case 'inspect':
                        fightMsg.channel.send(`test for inspect`);
                        break;

                    case 'flee':
                        fightMsg.channel.send(`test for flee`);
                        break;

                }
            })
        }
    }

    prepareFight(HP, fighter, backpack, doggo, gameMsg) {
        this.HP = HP;
        this.fightingCreature = fighter;
        this.backpack = backpack;
        this.dogFriend = doggo;
        this.fight(gameMsg);
    }

    printWelcome() {
        return `You are now in combat with ` + fightingCreature.getCreatureName() + `! Your commands are attack, use 
(mage book fire, iron knife, or mage book firaga), inspect creature, help, and flee.`
    }

    /**
     * The random number generator for hit/miss chance for both player and the creature.
     * @returns {*} integer 1-10
     */
    successChance() {
        return Math.floor(Math.random() * 10) + 1 // 1 - 10 range.
    }

    canweFlee(fightingCreature, fightMsg) {
        let flee = false;
        if(fightingCreature.getCreatureName() == "master" ) {
            fightMsg.channel.send(`You can't flee your master now!`);
            return false
        } else if(fightingCreature.getCreatureName() == "gargoyle") {       // 60% chance fleeing gargoyle bc he slo boi.
            if(this.successChance() >= 5) {
                fightMsg.channel.send(`You have fled the battle!`); 
                return true
            }
        } else if(this.successChance() >= 8) {
            fightMsg.channel.send(`You have fled the battle!`); // 30% chance fleeing anyone else.
            return true
        }

    }


}