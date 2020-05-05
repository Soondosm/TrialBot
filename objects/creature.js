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

    getCreatureDmg() {
        return this.damage;
    }

    getCreatureHealth() {
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