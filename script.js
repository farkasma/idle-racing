var laps = 1.0;
var track = 100;
var n = 0;
var lastUpdate = Date.now();

var engine = {
    bought: 0,
    power: 1,
    cost: function() {
        return Math.pow(1.1, this.bought)
    },
    buy: function() {
        if (laps < this.cost()) {
            return
        } else {
            car.speed += this.power;
            laps -= this.cost();
            this.bought += 1;
            document.getElementById("engine").textContent = "Engine: " + this.cost().toFixed(2) + " laps.";
            document.getElementById("engineButton").textContent = "LVL " + this.bought;
        }
    }
};

var mechanic = {
    bought: 0,
    cost: function() {
        return 10 * (this.bought + 1)
    },
    buy: function() {
        if (laps < this.cost()) {
            return
        } else {
            engine.power *= 2;
            laps -= this.cost();
            this.bought += 1;
            document.getElementById("mechanic").textContent = "Mechanic: " + this.cost() + " laps";
            document.getElementById("mechanicButton").textContent = this.bought + "x";
            document.getElementById("engineButton").title = "Every bought upgrade increases the speed of your car. Current power is " + this.power + " m/s per upgrade."
        }
    }
}

var car = {
    speed: 0,
    dist: 0,
}

function updater() {
    var diff = (Date.now() - lastUpdate) / 1000;
    car.dist += car.speed * diff;
    lastUpdate = Date.now();
    if (car.dist >= track) {
        laps += 1;
        car.dist -= track;
    };
    document.getElementById("money").textContent = "You have " + laps.toFixed(2) + " lap(s).";
    document.getElementById("pos").textContent = "You are at " + car.dist.toFixed(2) + " meter(s) out of " + track + ".";
    document.getElementById("speed").textContent = "Your current speed is " + car.speed + " m/s.";
}

setInterval(updater, 50);