class Item {
    constructor(name, detail, weight, power) {
        this.name = name;
        this.detail = detail;
        this.weight = weight;
        this.power = power;
    }

    getName() {
        return this.name;
    }

    getDetails() {
        return this.detail;
    }

    getWeight() {
        return this.weight;
    }

    getPower() {
        return this.power;
    }
}

module.exports = Item;