const config = require(`/Users/soondos/Desktop/independent/TrialBot/configure.json`);
let inFight = false; // a boolean. While false, fight sequence continues.
const possibleCommands = ["help", "attack", "use", "inspect", "flee"];

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

    fight(client, gameMsg) {
        gameMsg.channel.send(this.printWelcome());
            client.on('message', async fightMsg=>{
                let command = fightMsg.content.toLowerCase();
                command = command.substring(config.Prefix.length).split(' '); // allows us to implement prefix at beginning
                if(inFight == false || fightMsg.author.bot || !possibleCommands.includes(command[0])) return
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
                        this.canWeFlee(this.fightingCreature, fightMsg);
                        break;

                }
            })
    }

    prepareFight(client, HP, fighter, backpack, doggo, gameMsg) {
        inFight = true;
        this.HP = HP;
        this.fightingCreature = fighter;
        this.backpack = backpack;
        this.dogFriend = doggo;
        this.fight(client, gameMsg);
    }

    printWelcome() {
        return `You are now in combat with ` + this.fightingCreature.getCreatureName() + '! Your commands are `attack`, `use` ' + 
'(mage book fire, iron knife, or mage book firaga), `inspect` + creature, `help`, and `flee`. \n' + this.whatWillDo()
    }

    whatWillDo() {
        return `What will you do?`
    }

    /**
     * The random number generator for hit/miss chance for both player and the creature.
     * @returns {*} integer 1-10
     */
    successChance() {
        return Math.floor(Math.random() * 10) + 1 // 1 - 10 range.
    }



    canWeFlee(fightingCreature, fightMsg) {
        let chance = this.successChance();
        console.log("chance: " + chance);
        if(fightingCreature.getCreatureName() == "master" ) {
            fightMsg.channel.send(`You can't flee your master now!`);
            inFight = true;
        } else if(fightingCreature.getCreatureName() == "gargoyle" && chance >= 5) {       // 60% chance fleeing gargoyle bc he slo boi.
            fightMsg.channel.send(`You have fled the battle!`);  
            inFight = false;
        } else if(chance >= 8) {
            fightMsg.channel.send(`You have fled the battle!`); // 30% chance fleeing anyone else.
            inFight = false;
        } else { 
            fightMsg.channel.send(`You couldn't escape!`);
            console.log(`flee fail`);
            this.creatureAttack(fightMsg);
            inFight = true;
            fightMsg.channel.send(this.whatWillDo());
        }
    }

    creatureAttack(fightMsg) {
        if(this.successChance() >= 4) {
            let totalDmg = this.enemyPower();
            this.HP -= totalDmg;
            fightMsg.channel.send(`The ` + this.fightingCreature.getCreatureName() + ` strikes you for ` + totalDmg + ` points of damage!` + `\n`
            + `Your HP is now ` + this.HP + `/20.`);
        } else {
            fightMsg.channel.send(`The ` + this.fightingCreature.getCreatureName() `'s attack misses!`);
            }
        }


    enemyPower() {
        let minPower = Math.ceil(this.fightingCreature.getCreatureDmg() - 3);
        let maxPower = Math.floor(this.fightingCreature.getCreatureDmg() + 2);
        return Math.floor(Math.random() * (maxPower - minPower)) + minPower;
    }

    playerPower() {

    }

    finalHealth() {
        return this.HP
    }

    finalCreatureHealth() {
        return 
    }

    getFightStatus() {
        return inFight
    }

    setFightStatus(status) {
        inFight = status;
    }

}
module.exports = FightMode;