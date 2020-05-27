class Creature {
    constructor(cName, cDescription, damage, health) {
        this.cName = cName;
        this.cDescription = cDescription;
        this.damage = damage;
        this.health = health;
    }
    getCreatureName() {
        return this.cName;
    }

    getCreatureDescription() {
        return this.cDescription;
    }

    getFullDescription() {
        return "\n Oh! There's a " + this.cDescription + " here." +
         "\n" + this.cDescription;
    }

    getCreatureDmg() {
        return this.damage;
    }

    getCHealth() {
        return this.health;
    }

    setCDescription(newText) {
        this.cDescription = newText;
    }

    setCHealth(newHealth) {
        this.health = newHealth;
    }
}

module.exports = Creature;