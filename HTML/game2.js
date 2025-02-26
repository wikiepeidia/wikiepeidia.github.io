// Game Variables
let money = 0;
let baseMoneyPerSec = 1;
let multiplier = 1;
let timeInterval = 1000; // 1 second (1000ms)
let upgrade1Cost = 10, upgrade1Count = 0;
let upgrade2Cost = 100, upgrade2Count = 0;
let upgrade3Cost = 1000, upgrade3Count = 0;
let upgrade4Cost = 5000, upgrade4Count = 0;
let startTime = Date.now(); // Track session start

// DOM Elements
const moneyDisplay = document.getElementById("money");
const multiplierDisplay = document.getElementById("multiplier");
const earningRateDisplay = document.getElementById("earningRate");
const sessionTimeDisplay = document.getElementById("sessionTime");
const upgrade1Btn = document.getElementById("upgrade1");
const upgrade2Btn = document.getElementById("upgrade2");
const upgrade3Btn = document.getElementById("upgrade3");
const upgrade4Btn = document.getElementById("upgrade4");

// Number Formatting
function formatNumber(num) {
    if (num < 1000) return num.toFixed(2);
    let tier = Math.floor(Math.log10(num) / 3);
    let scaled = num / Math.pow(10, tier * 3);
    return scaled.toFixed(2) + " " + ["", "K", "M", "B", "T", "Qa", "Qi"][tier];
}

// Session Time Formatter
function formatSessionTime(seconds) {
    let years = Math.floor(seconds / (365 * 24 * 3600));
    seconds %= 365 * 24 * 3600;
    let months = Math.floor(seconds / (30 * 24 * 3600));
    seconds %= 30 * 24 * 3600;
    let weeks = Math.floor(seconds / (7 * 24 * 3600));
    seconds %= 7 * 24 * 3600;
    let days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${years}y ${months}m ${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Show Message
function showMessage(text, color = "red") {
    let messageBox = document.createElement("div");
    messageBox.innerText = text;
    messageBox.style.position = "fixed";
    messageBox.style.bottom = "20px";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translateX(-50%)";
    messageBox.style.background = color;
    messageBox.style.color = "white";
    messageBox.style.padding = "10px 20px";
    messageBox.style.borderRadius = "5px";
    messageBox.style.fontWeight = "bold";
    messageBox.style.zIndex = "1000";
    document.body.appendChild(messageBox);
    
    setTimeout(() => document.body.removeChild(messageBox), 2000);
}

// Update UI
function updateUI() {
    let moneyPerInterval = baseMoneyPerSec * multiplier;
    moneyDisplay.textContent = formatNumber(money);
    multiplierDisplay.textContent = formatNumber(multiplier);
    earningRateDisplay.textContent = `${formatNumber(moneyPerInterval)} 💰 / ${(timeInterval / 1000).toFixed(2)}s`;

    function updateButton(btn, cost, count, upgradeName) {
        btn.textContent = `${upgradeName} (Cost: ${formatNumber(cost)}💰)`;
        if (money >= cost) {
            btn.style.backgroundColor = "green";
        } else {
            btn.style.backgroundColor = "red";
        }
    }

    updateButton(upgrade1Btn, upgrade1Cost, upgrade1Count, "🆙 +1 Money/sec");
    updateButton(upgrade2Btn, upgrade2Cost, upgrade2Count, "🚀 +10 Money/sec");
    updateButton(upgrade3Btn, upgrade3Cost, upgrade3Count, `💎 x${multiplier + 1} Multiplier`);

    if (timeInterval <= 0) {
        upgrade4Btn.textContent = "⏳ Maxed Out";
        upgrade4Btn.disabled = true;
        upgrade4Btn.style.filter = "blur(3px)";
        upgrade4Btn.style.backgroundColor = "gray";
    } else {
        updateButton(upgrade4Btn, upgrade4Cost, upgrade4Count, "⏳ Reduce Time Interval");
    }
}

// Buy Upgrade
function buyUpgrade(cost, count, onSuccess, upgradeName) {
    if (money >= cost) {
        money -= cost;
        count++;
        onSuccess();
        showMessage(`BOUGHT ${upgradeName}! You have bought this ${count} times.`, "green");
        return count;
    } else {
        let needed = formatNumber(cost - money);
        showMessage(`INSUFFICIENT FUNDS! You need ${needed} more 💰`, "red");
        return count;
    }
}

// Upgrade 1: +1 Money/sec
upgrade1Btn.addEventListener("click", () => {
    upgrade1Count = buyUpgrade(upgrade1Cost, upgrade1Count, () => {
        baseMoneyPerSec += 1;
        upgrade1Cost = Math.ceil(upgrade1Cost * 1.5);
    }, "🆙 +1 Money/sec");
    updateUI();
});

// Upgrade 2: +10 Money/sec
upgrade2Btn.addEventListener("click", () => {
    upgrade2Count = buyUpgrade(upgrade2Cost, upgrade2Count, () => {
        baseMoneyPerSec += 10;
        upgrade2Cost = Math.ceil(upgrade2Cost * 1.7);
    }, "🚀 +10 Money/sec");
    updateUI();
});

// Upgrade 3: x2 Multiplier
upgrade3Btn.addEventListener("click", () => {
    upgrade3Count = buyUpgrade(upgrade3Cost, upgrade3Count, () => {
        multiplier *= 2;
        upgrade3Cost = Math.ceil(upgrade3Cost * 2.2);
    }, "💎 x2 Multiplier");
    updateUI();
});

// Upgrade 4: Reduce Time Interval
upgrade4Btn.addEventListener("click", () => {
    upgrade4Count = buyUpgrade(upgrade4Cost, upgrade4Count, () => {
        if (timeInterval > 1) {
            timeInterval = Math.ceil(timeInterval * 0.99);
            if (timeInterval <= 1) timeInterval = 0;

            clearInterval(moneyInterval);
            if (timeInterval > 0) moneyInterval = setInterval(earnMoney, timeInterval);

            upgrade4Cost = Math.ceil(upgrade4Cost * 1.1);
        }

        if (timeInterval <= 1) {
            upgrade4Btn.textContent = "⏳ Maxed Out";
            upgrade4Btn.disabled = true;
            upgrade4Btn.style.filter = "blur(3px)";
            showMessage("You have bought this upgrade max!", "green");
        }
    }, "⏳ Reduce Time Interval");
    updateUI();
});

// Earn Money
function earnMoney() {
    money += baseMoneyPerSec * multiplier;
    updateUI();
}

// Start Earning Interval
let moneyInterval = setInterval(earnMoney, timeInterval);

// Session Timer
setInterval(() => {
    let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    sessionTimeDisplay.textContent = formatSessionTime(elapsedSeconds);
}, 1000);

// Initial UI Update
updateUI();