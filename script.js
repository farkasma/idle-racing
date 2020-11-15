/*turn the button into an object, like, all of them
also probably put them in a list, so I don't have to call GUIButtons one by one
also find a way to calculate mult and display accurate engine upgrade power at the same time*/

var laps = 1.0;
var track = 100;
var resetThreshold = track + 100;
var n = 0;
var lastUpdate = Date.now();
var glitchTrophies = 0;

var engine = {
    bought: 0,
    power: function() {
        return Math.pow(2, mechanic.bought)
    },
    cost: function() {
        return Math.pow(1.1, this.bought)
    },
    buy: function() {
        if (laps < this.cost()) {
            return
        } else {
            car.speed += this.power();
            laps -= this.cost();
            this.bought += 1;
            document.getElementById("engineCost").textContent = "Cost: " + this.cost().toFixed(2) + " laps";
            document.getElementById("engineBought").textContent = "Bought: " + this.bought;
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
            laps -= this.cost();
            this.bought += 1;
            document.getElementById("mechanicCost").textContent = "Cost: " + this.cost() + " laps";
            document.getElementById("mechanicBought").textContent = "Bought: " + this.bought;
            document.getElementById("enginePower").textContent = "Current power is " + engine.power() + ".";
        }
    }
}

var car = {
    speed: 0,
    dist: 0,
    mult: 1,
    multGrowth: 0,
}

function updater() {
    var diff = (Date.now() - lastUpdate) / 1000;
    car.dist += car.speed * diff * car.mult;
    lastUpdate = Date.now();
    if (car.dist >= track && car.dist < resetThreshold) {
        laps += 1;
        car.dist -= track;
    };
    document.getElementById("money").textContent = "You have " + laps.toFixed(2) + " lap(s).";
    document.getElementById("pos").textContent = "You are at " + car.dist.toFixed(2) + " meter(s) out of " + track + ".";
    document.getElementById("speed").textContent = "Your current speed is " + (car.speed * car.mult).toFixed(2) + " m/s.";
    document.getElementById("resetButton").textContent = "Reset the game for " + Math.round(Math.pow(track/100, 2)) + " Glitch Trophies."
    GUIButtons(engine.cost(), "engineUpgrade", laps);
    GUIButtons(mechanic.cost(), "mechanicUpgrade", laps);
    GUIButtons(1, "oilUpgrade", glitchTrophies);
    GUIButtons(2, "AIUpgrade", glitchTrophies);
    if (car.dist > resetThreshold) {
        document.getElementById("ascend1").classList.remove("inactive");
        document.getElementById("resetButton").classList.remove("locked");
    } else {
        document.getElementById("resetButton").classList.add("locked");
    };
    document.getElementById("prestigeStats").textContent = "You have " + glitchTrophies + " Glitch Trophie(s).";
    car.mult += car.multGrowth * diff;
}

function reset() {
    if (Math.round(Math.pow(track/100, 2)) > 0 && car.dist > resetThreshold) {
        glitchTrophies += Math.pow(track/100, 2);
        car.speed = 0;
        car.dist = 0;
        laps = 1;
        engine.bought = 0;
        mechanic.bought = 0;
        document.getElementById("engineCost").textContent = "Cost: " + engine.cost().toFixed(2) + " laps";
        document.getElementById("engineBought").textContent = "Bought: " + engine.bought;
        document.getElementById("enginePower").textContent = "Current power is " + engine.power() + ".";
        document.getElementById("mechanicCost").textContent = "Cost: " + mechanic.cost() + " laps";
        document.getElementById("mechanicBought").textContent = "Bought: " + mechanic.bought;
        document.getElementById("postreset").classList.remove("inactive");
        document.getElementById("preresetText").classList.add("inactive");
    }
}

function oilUpgrade() {
    if (glitchTrophies >= 1) {
        glitchTrophies -= 1;
        car.mult *= 1.5;
        document.getElementById("oilUpgrade").classList.add("inactive");    
    }
}

function AIUpgrade() {
    if (glitchTrophies >= 2) {
        glitchTrophies -= 2;
        car.multGrowth = 0.1;
        document.getElementById("AIUpgrade").classList.add("inactive");
    }
}

function GUIButtons(cost, element, currency) {
    if (cost > currency) {
        document.getElementById(element).classList.add("locked");
    } else {
        document.getElementById(element).classList.remove("locked");
    }
}
setInterval(updater, 50);