let money = 0;
let moneyPerClick = 1;
let upgradeCost = 10;
let upgradeCost2 = 100;
let upgradeCost3 = 1000;
let ultimateUpgradeCost = 1111;
let multiplier = 1.1; // Increases per upgrade
let isCircleActive = false; 
let baseMoneyPerClick = 1;

const moneyDisplay = document.getElementById("money");
const moneyPerClickDisplay = document.getElementById("money-per-click");
const upgradeBtn = document.getElementById("upgrade-btn");
const upgradeBtn2 = document.getElementById("upgrade-btn-2");
const upgradeBtn3 = document.getElementById("upgrade-btn-3");
const ultimateUpgradeBtn = document.getElementById("ultimate-upgrade-btn");
const circle = document.getElementById("circle");
const gameContainer = document.getElementById("game-container");
const clickSound = new Audio('audio/click.ogg');
const upgradeSound = new Audio('audio/moneyupgrade.ogg');
let clickCount = 0;
let achievementMultiplier = 1;
let achievementIncrement = 0.1;
let upgradeCount1 = 0;
let upgradeCount2 = 0;
let upgradeCount3 = 0;
let ultimateUpgradeBought = false;
let autoClickInterval; // Define autoClickInterval outside the rebirth button handler

let totalRebirths = 0;
let rebirthMultiplier = 1;
let rebirthCost = 1000000;

const rebirthBtn = document.getElementById("rebirth-btn");
const totalRebirthsElement = document.getElementById("total-rebirths");
const rebirthMultiplierElement = document.getElementById("rebirth-multiplier");
const sessionTimeElement = document.getElementById("session-time");

const startTime = new Date();

// Modify the circle click event handler
circle.addEventListener("click", () => {
    if (isCircleActive) {
        clickSound.play();
        money += moneyPerClick;
        clickCount++;
        
        // Achievement check for every 50 clicks
        if (clickCount % 50 === 0) {
            achievementMultiplier += achievementIncrement;
            // Multiply base money per click by total achievement multiplier
            moneyPerClick = baseMoneyPerClick * achievementMultiplier;
            
        }
        
        updateMoney();
        circle.style.display = "none";
        isCircleActive = false;
        
        // Spawn new circle after delay
        setTimeout(() => {
            spawnCircle();
        }, 500 + Math.random() * 500);
    }
});

// Modify the upgrade purchase handler
upgradeBtn.addEventListener("click", () => {
    if (money >= upgradeCost) {
        upgradeSound.play();
        money -= upgradeCost;
        baseMoneyPerClick += 0.1;
        // Apply both multipliers
        moneyPerClick = baseMoneyPerClick * achievementMultiplier * rebirthMultiplier;
        upgradeCost = Math.ceil(upgradeCost * 1.1);
        upgradeCount1++;
        updateMoney();
    }
});

// Add handler for the second upgrade
upgradeBtn2.addEventListener("click", () => {
    if (money >= upgradeCost2) {
        upgradeSound.play();
        money -= upgradeCost2;
        baseMoneyPerClick += 1;
        // Apply both multipliers
        moneyPerClick = baseMoneyPerClick * achievementMultiplier * rebirthMultiplier;
        upgradeCost2 = Math.ceil(upgradeCost2 * 1.2);
        upgradeCount2++;
        updateMoney();
    }
});

// Add handler for the third upgrade
upgradeBtn3.addEventListener("click", () => {
    if (money >= upgradeCost3) {
        upgradeSound.play();
        money -= upgradeCost3;
        achievementIncrement += 0.1;
        achievementMultiplier += 0.1; // Increase the achievement multiplier by 0.1x
        moneyPerClick = baseMoneyPerClick * achievementMultiplier; // Apply the achievement multiplier
        upgradeCost3 = Math.ceil(upgradeCost3 * 1.3456);
        upgradeCount3++;
        updateMoney();
    }
});

// Add handler for the ultimate upgrade
ultimateUpgradeBtn.addEventListener("click", () => {
    if (money >= ultimateUpgradeCost && !ultimateUpgradeBought) {
        upgradeSound.play();
        money -= ultimateUpgradeCost;
        ultimateUpgradeBought = true;
        ultimateUpgradeBtn.textContent = "Bought MAX";
        ultimateUpgradeBtn.disabled = true;
        ultimateUpgradeBtn.style.filter = "blur(2px)";
        circle.style.display = "none";
        clearInterval(circleSpawnInterval);
        const autoClickInterval = setInterval(() => {
            if (!ultimateUpgradeBought) {
                clearInterval(autoClickInterval);
                return;
            }
            money += moneyPerClick;
            clickCount++; // Increment click count
            // Achievement check for every 50 clicks
            if (clickCount % 50 === 0) {
                achievementMultiplier += achievementIncrement;
                // Multiply base money per click by total achievement multiplier
                moneyPerClick = baseMoneyPerClick * achievementMultiplier;
            }
            updateMoney();
        }, 1000);
        updateMoney();
    }
});

// Rebirth button handler
rebirthBtn.addEventListener("click", () => {
    if (money >= rebirthCost) {
        
        money = 0;
        totalRebirths++;
        rebirthMultiplier += 1; // Increase multiplier by 1 for each rebirth (e.g., 1x -> 2x -> 3x)
        baseMoneyPerClick = 1; // Reset base money per click to 1
        moneyPerClick = baseMoneyPerClick * achievementMultiplier * rebirthMultiplier; // Apply rebirth multiplier
        upgradeCost = 10;
        upgradeCost2 = 100;
        upgradeCost3 = 1000;
        ultimateUpgradeCost = 1111;
        achievementMultiplier = 1;
        achievementIncrement = 0.1;
        upgradeCount1 = 0;
        upgradeCount2 = 0;
        upgradeCount3 = 0;
        ultimateUpgradeBought = false;
        ultimateUpgradeBtn.disabled = false;
        ultimateUpgradeBtn.style.filter = "none";
        ultimateUpgradeBtn.textContent = `Ultimate Upgrade: Autoclick/s (Cost: ${formatNumber(ultimateUpgradeCost)}) [Bought: 0]`;
        
        rebirthCost *= 2; // Increase rebirth cost for next rebirth
        updateMoney();
        // Reset circle spawning logic
        isCircleActive = false; // Ensure the circle can spawn again
        circle.style.display = "none"; // Hide the circle initially
        clearInterval(circleSpawnInterval); // Clear the existing circle spawn interval
        circleSpawnInterval = setInterval(spawnCircle, 1000); // Restart circle spawning

        if (autoClickInterval) {
            clearInterval(autoClickInterval); // Stop autoclick
        }
        clearInterval(autoClickInterval); // Stop autoclick
        
    }
});

// Format large numbers (e.g., 1K, 1M, 1B)
function formatNumber(num) {
    let units = [
        "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", 
    "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc",
    "Vg", "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg", 
    "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg", 
    "Qd", "UQd", "DQd", "TQd", "QaQd", "QiQd", "SxQd", "SpQd", "OcQd", "NoQd",
    "Qn", "UQn", "DQn", "TQn", "QaQn", "QiQn", "SxQn", "SpQn", "OcQn", "NoQn",
    "Ce", "UC", "DC", "TC", "QaC", "QiC", "SxC", "SpC", "OcC", "NoC"
    ];
    
    let unitIndex = 0;
    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }
    return num.toFixed(2) + units[unitIndex];
}

// Update money display
function updateMoney() {
    moneyDisplay.textContent = formatNumber(money);
    moneyPerClickDisplay.textContent = formatNumber(moneyPerClick);
    upgradeBtn.textContent = `Upgrade Money Gain by 0.1 (Cost: ${formatNumber(upgradeCost)}) [Bought: ${upgradeCount1}]`;
    upgradeBtn2.textContent = `Upgrade Money Gain by +1 (Cost: ${formatNumber(upgradeCost2)}) [Bought: ${upgradeCount2}]`;
    upgradeBtn3.textContent = `Upgrade Achievement Multiplier+0.1x (Cost: ${formatNumber(upgradeCost3)}) [Bought: ${upgradeCount3}]`;
    ultimateUpgradeBtn.textContent = ultimateUpgradeBought ? "Ultimate Upgrade: Autoclick/s  [Bought: MAX]" : `Ultimate Upgrade: Autoclick/s (Cost: ${formatNumber(ultimateUpgradeCost)}) [Bought: 0]`;
    document.getElementById("click-count").textContent = clickCount;
    document.getElementById("achievement-multiplier").textContent = achievementMultiplier.toFixed(1);
    totalRebirthsElement.textContent = totalRebirths;
    rebirthMultiplierElement.textContent = rebirthMultiplier; // Display rebirth multiplier
    rebirthBtn.textContent = `Rebirth (Cost: ${formatNumber(rebirthCost)})`;
}

// Calculate and display session time
function updateSessionTime() {
    const now = new Date();
    const elapsed = now - startTime;

    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / (1000 * 60)) % 60;
    const hours = Math.floor(elapsed / (1000 * 60 * 60)) % 24;
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24)) % 7;
    const weeks = Math.floor(elapsed / (1000 * 60 * 60 * 24 * 7)) % 4;
    const months = Math.floor(elapsed / (1000 * 60 * 60 * 24 * 30)) % 12;
    const years = Math.floor(elapsed / (1000 * 60 * 60 * 24 * 365));

    sessionTimeElement.textContent = `${years}y ${months}m ${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateSessionTime, 1000);

// Move the circle to a random position within the game container
function spawnCircle() {
    if (!isCircleActive) {
        const padding = 10; // Add padding to prevent circle from going outside
        const maxX = gameContainer.clientWidth - circle.clientWidth - padding;
        const maxY = gameContainer.clientHeight - circle.clientHeight - padding;
        const minX = padding;
        const minY = padding;
        circle.style.left = Math.random() * (maxX - minX) + minX + "px";
        circle.style.top = Math.random() * (maxY - minY) + minY + "px";
        circle.style.display = "block";
        isCircleActive = true;
    }
}

// Initialize game
updateMoney();
const circleSpawnInterval = setInterval(spawnCircle, 1000);
spawnCircle();