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
            alert(`Achievement! 50 clicks milestone reached! Money multiplier increased to ${achievementMultiplier.toFixed(1)}x`);
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
        baseMoneyPerClick *= multiplier;
        // Apply both multipliers
        moneyPerClick = baseMoneyPerClick * achievementMultiplier;
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
        moneyPerClick = baseMoneyPerClick * achievementMultiplier;
        upgradeCost2 = Math.ceil(upgradeCost2 * 1.2);
        upgradeCount2++;
        updateMoney();
    }
});

// Add handler for the third upgrade
// Add handler for the third upgrade
upgradeBtn3.addEventListener("click", () => {
    if (money >= upgradeCost3) {
        upgradeSound.play();
        money -= upgradeCost3;
        achievementIncrement += 0.1;
        achievementMultiplier += 0.1; // Increase the achievement multiplier by 0.1x
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
        setInterval(() => {
            money += moneyPerClick;
            clickCount++; // Increment click count
            // Achievement check for every 50 clicks
            if (clickCount % 50 === 0) {
                achievementMultiplier += achievementIncrement;
                // Multiply base money per click by total achievement multiplier
                moneyPerClick = baseMoneyPerClick * achievementMultiplier;
                alert(`Achievement! 50 clicks milestone reached! Money multiplier increased to ${achievementMultiplier.toFixed(1)}x`);
            }
            updateMoney();
        }, 1000);
        updateMoney();
    }
});

// Format large numbers (e.g., 1K, 1M, 1B)
function formatNumber(num) {
    let units = ["", "K", "M", "B", "T", "Qa", "Qi"];
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
}

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