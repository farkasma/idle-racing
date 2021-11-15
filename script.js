var laps = 0;
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
    },
    element: "engineUpgrade"
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
            document.getElementById("mechanicCost").textContent = "Cost: " + this.cost().toFixed(2) + " laps";
            document.getElementById("mechanicBought").textContent = "Bought: " + this.bought;
            document.getElementById("enginePower").textContent = "Current power is " + engine.power() * car.mult + ".";
        }
    },
    element: "mechanicUpgrade"
}

var oil = {
    cost: 1,
    buy: function() {
        if (glitchTrophies >= this.cost) {
            glitchTrophies -= this.cost;
            car.mult *= 1.5;
            document.getElementById("enginePower").textContent = "Current power is " + engine.power() * car.mult + ".";
            document.getElementById(this.element).classList.add("inactive");    
        }    
    },
    element: "oilUpgrade"
}

var AI = {
    cost: 2,
    buy: function() {
        if (glitchTrophies >= this.cost) {
            glitchTrophies -= this.cost;
            car.multGrowth = 0.1;
            document.getElementById(this.element).classList.add("inactive");
        }    
    },
    element: "AIUpgrade"
}

var car = {
    speed: 1,
    dist: 0,
    mult: 1,
    multGrowth: 0
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
    GUIButtons(engine, laps);
    GUIButtons(mechanic, laps);
    GUIButtons(oil, glitchTrophies);
    GUIButtons(AI, glitchTrophies);
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
        car.speed = 1;
        car.dist = 0;
        laps = 0;
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

function GUIButtons(object, money) {
    if (object.cost > money) {
        document.getElementById(object.element).classList.add("locked");
    } else {
        document.getElementById(object.element).classList.remove("locked");
    }
}
setInterval(updater, 50);
