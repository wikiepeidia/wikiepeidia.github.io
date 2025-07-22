// Infinite Number System - Based on EternityNum Library
class InfiniteNumber {
    constructor(sign = 1, layer = 0, exp = 0) {
        this.sign = sign;
        this.layer = layer;
        this.exp = exp;
        this.correct();
    }

    static fromNumber(num) {
        if (num === 0) return new InfiniteNumber(0, 0, 0);
        const sign = Math.sign(num);
        const abs = Math.abs(num);
        return new InfiniteNumber(sign, 0, abs);
    }

    correct() {
        if (this.sign === 0 || this.exp === 0) {
            this.sign = 0;
            this.layer = 0;
            this.exp = 0;
            return this;
        }

        const EXPL = 1e10;
        const LDOWN = Math.log10(EXPL);

        if (this.layer === 0 && this.exp < 0) {
            this.exp = -this.exp;
            this.sign = -this.sign;
        }

        if (this.layer === 0 && this.exp < 1e-10) {
            this.layer += 1;
            this.exp = Math.log10(this.exp);
            return this;
        }

        const absExp = Math.abs(this.exp);
        const signExp = Math.sign(this.exp);

        if (absExp >= EXPL) {
            this.layer += 1;
            this.exp = signExp * Math.log10(absExp);
            return this;
        }

        while (absExp < LDOWN && this.layer > 0) {
            this.layer -= 1;
            if (this.layer === 0) {
                this.exp = Math.pow(10, this.exp);
            } else {
                this.exp = Math.pow(10, this.exp);
            }
        }

        return this;
    }

    toNumber() {
        if (this.layer > 1) {
            return this.sign * (Math.sign(this.exp) === -1 ? 0 : 1.8e308);
        }
        if (this.layer === 0) {
            return this.sign * this.exp;
        }
        if (this.layer === 1) {
            return this.sign * Math.pow(10, this.exp);
        }
        return NaN;
    }

    // Add comparison methods
    greaterThan(other) {
        if (typeof other === 'number') other = InfiniteNumber.fromNumber(other);
        
        if (this.sign !== other.sign) return this.sign > other.sign;
        if (this.sign === 0) return false;
        
        if (this.layer !== other.layer) {
            return this.sign > 0 ? this.layer > other.layer : this.layer < other.layer;
        }
        
        return this.sign > 0 ? this.exp > other.exp : this.exp < other.exp;
    }

    greaterThanOrEqual(other) {
        return this.greaterThan(other) || this.equals(other);
    }

    equals(other) {
        if (typeof other === 'number') other = InfiniteNumber.fromNumber(other);
        return this.sign === other.sign && this.layer === other.layer && this.exp === other.exp;
    }

    subtract(other) {
        if (typeof other === 'number') other = InfiniteNumber.fromNumber(other);
        
        if (this.sign === 0) return new InfiniteNumber(-other.sign, other.layer, other.exp);
        if (other.sign === 0) return this;

        // Simple case: same layer
        if (this.layer === 0 && other.layer === 0) {
            const result = this.toNumber() - other.toNumber();
            return InfiniteNumber.fromNumber(result);
        }

        // If this is much larger, return this
        if (this.layer > other.layer || (this.layer === other.layer && this.exp > other.exp + 1)) {
            return this;
        }

        // If other is larger, return negative
        if (other.layer > this.layer || (this.layer === other.layer && other.exp > this.exp)) {
            return new InfiniteNumber(-other.sign, other.layer, other.exp);
        }

        // Close values, do actual subtraction
        const thisNum = this.toNumber();
        const otherNum = other.toNumber();
        return InfiniteNumber.fromNumber(thisNum - otherNum);
    }

    toString() {
        return this.formatNumber();
    }

    formatNumber(digits = 2) {
        if (this.sign === 0) return "0";
        
        const num = this.toNumber();
        if (!isNaN(num) && isFinite(num) && Math.abs(num) < 1000) {
            return num.toFixed(digits);
        }
        
        // Always use suffix notation for numbers >= 1000, never scientific notation
        return this.toSuffix(digits);
    }

    toSuffix(digits = 2) {
        const Sets = ["", "K", "M", "B"];
        const FirstOnes = ["", "U", "D", "T", "Qd", "Qn", "Sx", "Sp", "Oc", "No"];
        const SecondOnes = ["", "De", "Vt", "Tg", "qg", "Qg", "sg", "Sg", "Og", "Ng"];
        const ThirdOnes = ["", "Ce", "Du", "Tr", "Qa", "Qi", "Se", "Si", "Ot", "Ni"];
        const MultOnes = [
            "", "Mi", "Mc", "Na", "Pi", "Fm", "At", "Zp", "Yc", "Xo", "Ve", "Me", 
            "Due", "Tre", "Te", "Pt", "He", "Hp", "Oct", "En", "Ic", "Mei", 
            "Dui", "Tri", "Teti", "Pti", "Hei", "Hp", "Oci", "Eni", "Tra", "TeC",
            "MTc", "DTc", "TrTc", "TeTc", "PeTc", "HTc", "HpT", "OcT", "EnT", "TetC", "MTetc",
            "DTetc", "TrTetc", "TeTetc", "PeTetc", "HTetc", "HpTetc", "OcTetc", "EnTetc", "PcT",
            "MPcT", "DPcT", "TPCt", "TePCt", "PePCt", "HePCt", "HpPct", "OcPct", "EnPct", "HCt",
            "MHcT", "DHcT", "THCt", "TeHCt", "PeHCt", "HeHCt", "HpHct", "OcHct", "EnHct", "HpCt",
            "MHpcT", "DHpcT", "THpCt", "TeHpCt", "PeHpCt", "HeHpCt", "HpHpct", "OcHpct", "EnHpct",
            "OCt", "MOcT", "DOcT", "TOCt", "TeOCt", "PeOCt", "HeOCt", "HpOct", "OcOct", "EnOct", "Ent", "MEnT",
            "DEnT", "TEnt", "TeEnt", "PeEnt", "HeEnt", "HpEnt", "OcEnt", "EnEnt", "Hect", "MeHect"
        ];

        function cutDigits(value, digits) {
            if (digits < 0) return value;
            if (!isFinite(value)) return "∞";
            return Math.floor(value * Math.pow(10, digits)) / Math.pow(10, digits);
        }

        // Handle special cases
        if (this.sign === 0) return "0";
        
        // For layer > 0, create a massive number with suffixes
        if (this.layer > 0) {
            // Generate suffix based on layer and exp
            let layerSuffix = "";
            for (let i = 0; i < this.layer && i < MultOnes.length; i++) {
                layerSuffix += MultOnes[Math.min(i + Math.floor(this.exp / 10), MultOnes.length - 1)];
            }
            return cutDigits(this.exp % 1000, digits) + " " + layerSuffix;
        }

        const num = this.toNumber();
        if (num === 0) return "0";
        
        const absNum = Math.abs(num);
        if (absNum < 1000) return cutDigits(num, digits).toString();

        // For very large numbers, use creative suffixing
        if (absNum > 1e308) {
            return cutDigits(absNum / 1e308, digits) + " " + MultOnes[Math.min(85, MultOnes.length - 1)];
        }

        const log = Math.log10(absNum);
        const mantissa = absNum / Math.pow(10, Math.floor(log));
        const exponent = Math.floor(log);
        const modulus3 = exponent % 3;
        let tierExp = Math.floor(exponent / 3) - 1;

        if (tierExp <= -1) return cutDigits(mantissa * Math.pow(10, exponent), digits).toString();

        if (tierExp < 3) {
            const scaledMantissa = cutDigits(mantissa * Math.pow(10, modulus3), digits);
            if (Sets[tierExp + 1]) {
                return scaledMantissa + " " + Sets[tierExp + 1];
            }
        }

        let outString = "";

        function suffixPartOne(n) {
            if (n > 999 || n < 0) return; // Safety check
            const hundreds = Math.floor(n / 100);
            n = n % 100;
            const tens = Math.floor(n / 10);
            n = n % 10;
            const ones = Math.floor(n);

            if (FirstOnes[ones] !== undefined) outString += FirstOnes[ones];
            if (SecondOnes[tens] !== undefined) outString += SecondOnes[tens];
            if (ThirdOnes[hundreds] !== undefined) outString += ThirdOnes[hundreds];
        }

        function suffixPartTwo(n) {
            if (n > 0) n += 1;
            if (n > 1000) n = n % 1000;
            suffixPartOne(n);
        }

        if (tierExp < 1000) {
            suffixPartOne(tierExp);
            const scaledMantissa = cutDigits(mantissa * Math.pow(10, modulus3), digits);
            return scaledMantissa + " " + outString;
        }

        // Handle very large numbers with MultOnes - generate creative suffixes
        const maxIterations = Math.min(10, Math.floor(Math.log10(Math.max(tierExp, 1)) / 3));
        for (let i = maxIterations; i >= 0; i--) {
            const threshold = Math.pow(10, i * 3);
            if (tierExp >= threshold && i < MultOnes.length) {
                const quotient = Math.floor(tierExp / threshold);
                if (quotient > 0 && quotient < 1000) {
                    suffixPartTwo(quotient - 1);
                    if (MultOnes[i]) {
                        outString += MultOnes[i];
                    }
                    tierExp = tierExp % threshold;
                }
            }
        }

        // If we still have no suffix, generate one based on the number
        if (outString === "") {
            const suffixIndex = Math.min(Math.floor(tierExp / 100) % MultOnes.length, MultOnes.length - 1);
            outString = MultOnes[suffixIndex] || "Mega";
        }

        const scaledMantissa = cutDigits(mantissa * Math.pow(10, modulus3), digits);
        return scaledMantissa + " " + outString;
    }

    add(other) {
        if (typeof other === 'number') other = InfiniteNumber.fromNumber(other);
        
        if (this.sign === 0) return other;
        if (other.sign === 0) return this;

        // For simplicity, if layers are very different, return the larger one
        if (this.layer > other.layer + 1 || other.layer > this.layer + 1) {
            return this.greaterThan(other) ? this : other;
        }

        if (this.layer === 0 && other.layer === 0) {
            return InfiniteNumber.fromNumber(this.toNumber() + other.toNumber());
        }

        // Simplified addition for higher layers
        const thisNum = this.toNumber();
        const otherNum = other.toNumber();
        
        if (isFinite(thisNum) && isFinite(otherNum)) {
            return InfiniteNumber.fromNumber(thisNum + otherNum);
        }

        return this.greaterThan(other) ? this : other;
    }

    multiply(other) {
        if (typeof other === 'number') other = InfiniteNumber.fromNumber(other);
        
        if (this.sign === 0 || other.sign === 0) return new InfiniteNumber(0, 0, 0);

        const thisNum = this.toNumber();
        const otherNum = other.toNumber();
        
        if (isFinite(thisNum) && isFinite(otherNum) && Math.abs(thisNum * otherNum) < 1e308) {
            return InfiniteNumber.fromNumber(thisNum * otherNum);
        }

        // For very large numbers, use scientific notation approach
        if (this.layer === 0 && other.layer === 0) {
            const result = thisNum * otherNum;
            if (isFinite(result)) return InfiniteNumber.fromNumber(result);
        }

        // Simplified multiplication for higher layers
        const newSign = this.sign * other.sign;
        if (this.layer === other.layer) {
            return new InfiniteNumber(newSign, this.layer, this.exp + other.exp);
        }
        
        return this.layer > other.layer ? 
            new InfiniteNumber(newSign, this.layer, this.exp) : 
            new InfiniteNumber(newSign, other.layer, other.exp);
    }

    abs() {
        return new InfiniteNumber(1, this.layer, this.exp);
    }
}

// Number Formatting Function
function formatNumber(num) {
    if (num instanceof InfiniteNumber) {
        return num.formatNumber();
    }
    
    const infNum = InfiniteNumber.fromNumber(num);
    return infNum.formatNumber();
}

// Game Variables
let money = new InfiniteNumber(1, 0, 0); // Start with 0 money as shown in HTML
let baseMoneyPerSec = new InfiniteNumber(1, 0, 1);
let multiplier = new InfiniteNumber(1, 0, 1);
let timeInterval = 1000; // 1 second (1000ms)
let upgrade1Cost = new InfiniteNumber(1, 0, 10), upgrade1Count = 0;
let upgrade2Cost = new InfiniteNumber(1, 0, 100), upgrade2Count = 0;
let upgrade3Cost = new InfiniteNumber(1, 0, 1000), upgrade3Count = 0;
let upgrade4Cost = new InfiniteNumber(1, 0, 5000), upgrade4Count = 0;
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
const cheatBtn = document.getElementById("cheatBtn");

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

// Rate limiter for UI updates
let lastUIUpdate = 0;
let pendingUIUpdate = false;

function throttledUpdateUI() {
    const now = Date.now();
    if (now - lastUIUpdate > 100) { // Limit to 10 FPS
        lastUIUpdate = now;
        updateUI();
        pendingUIUpdate = false;
    } else if (!pendingUIUpdate) {
        pendingUIUpdate = true;
        setTimeout(() => {
            if (pendingUIUpdate) {
                throttledUpdateUI();
            }
        }, 100);
    }
}

// Update UI
function updateUI() {
    try {
        let moneyPerInterval = baseMoneyPerSec.multiply(multiplier);
        
        // Safe format numbers with error handling
        const safeFormat = (num) => {
            try {
                return formatNumber(num);
            } catch (e) {
                console.warn("Number formatting error:", e);
                return "∞";
            }
        };

        moneyDisplay.textContent = safeFormat(money);
        multiplierDisplay.textContent = safeFormat(multiplier);
        earningRateDisplay.textContent = `${safeFormat(moneyPerInterval)} 💰 / ${(timeInterval / 1000).toFixed(2)}s`;

        function updateButton(btn, cost, count, upgradeName) {
            try {
                btn.textContent = `${upgradeName} (Cost: ${safeFormat(cost)}💰)`;
                if (money.greaterThanOrEqual(cost)) {
                    btn.style.backgroundColor = "green";
                    btn.disabled = false;
                } else {
                    btn.style.backgroundColor = "red";
                    btn.disabled = false; // Keep enabled so users can click to see the message
                }
            } catch (e) {
                console.warn("Button update error:", e);
                btn.textContent = `${upgradeName} (Error)`;
                btn.style.backgroundColor = "gray";
            }
        }

        updateButton(upgrade1Btn, upgrade1Cost, upgrade1Count, "🆙 +1 Money/sec");
        updateButton(upgrade2Btn, upgrade2Cost, upgrade2Count, "🚀 +10 Money/sec");
        updateButton(upgrade3Btn, upgrade3Cost, upgrade3Count, `💎 x2 Multiplier`);

        if (timeInterval <= 1) {
            upgrade4Btn.textContent = "⏳ Maxed Out";
            upgrade4Btn.disabled = true;
            upgrade4Btn.style.filter = "blur(3px)";
            upgrade4Btn.style.backgroundColor = "gray";
        } else {
            updateButton(upgrade4Btn, upgrade4Cost, upgrade4Count, "⏳ Reduce Time Interval");
        }
    } catch (e) {
        console.error("Critical UI update error:", e);
        // Fallback display
        moneyDisplay.textContent = "Error";
        multiplierDisplay.textContent = "Error";
        earningRateDisplay.textContent = "Error";
    }
}

// Buy Upgrade
function buyUpgrade(cost, count, onSuccess, upgradeName) {
    if (money.greaterThanOrEqual(cost)) {
        money = money.subtract(cost);
        count++;
        onSuccess();
        return count;
    } else {
        return count;
    }
}

// Upgrade 1: +1 Money/sec
upgrade1Btn.addEventListener("click", () => {
    upgrade1Count = buyUpgrade(upgrade1Cost, upgrade1Count, () => {
        baseMoneyPerSec = baseMoneyPerSec.add(1);
        upgrade1Cost = upgrade1Cost.multiply(1.5);
    }, "🆙 +1 Money/sec");
    throttledUpdateUI();
});

// Upgrade 2: +10 Money/sec
upgrade2Btn.addEventListener("click", () => {
    upgrade2Count = buyUpgrade(upgrade2Cost, upgrade2Count, () => {
        baseMoneyPerSec = baseMoneyPerSec.add(10);
        upgrade2Cost = upgrade2Cost.multiply(1.7);
    }, "🚀 +10 Money/sec");
    throttledUpdateUI();
});

// Upgrade 3: x2 Multiplier
upgrade3Btn.addEventListener("click", () => {
    upgrade3Count = buyUpgrade(upgrade3Cost, upgrade3Count, () => {
        multiplier = multiplier.multiply(2);
        upgrade3Cost = upgrade3Cost.multiply(2.2);
    }, "💎 x2 Multiplier");
    throttledUpdateUI();
});

// Upgrade 4: Reduce Time Interval
upgrade4Btn.addEventListener("click", () => {
    if (timeInterval <= 1) {
        return;
    }
    
    upgrade4Count = buyUpgrade(upgrade4Cost, upgrade4Count, () => {
        if (timeInterval > 1) {
            timeInterval = Math.max(1, Math.ceil(timeInterval * 0.9));

            clearInterval(moneyInterval);
            moneyInterval = setInterval(earnMoney, timeInterval);

            upgrade4Cost = upgrade4Cost.multiply(1.5);
        }
    }, "⏳ Reduce Time Interval");
    throttledUpdateUI();
});

// Cheat Button for Testing Large Numbers
let cheatLevel = 0;
let cheatUnlocked = false;

cheatBtn.addEventListener("click", () => {
    if (!cheatUnlocked) {
        showPasscodeDialog();
        return;
    }
    
    cheatLevel++;
    
    switch(cheatLevel) {
        case 1:
            money = new InfiniteNumber(1, 0, 1e12); // Trillion
            break;
        case 2:
            money = new InfiniteNumber(1, 0, 1e18); // Quintillion
            break;
        case 3:
            money = new InfiniteNumber(1, 0, 1e24); // Septillion
            break;
        case 4:
            money = new InfiniteNumber(1, 0, 1e33); // Decillion
            break;
        case 5:
            money = new InfiniteNumber(1, 1, 100); // Layer 1 number
            break;
        case 6:
            money = new InfiniteNumber(1, 1, 1000); // Bigger Layer 1
            break;
        case 7:
            money = new InfiniteNumber(1, 2, 50); // Layer 2 number
            break;
        default:
            money = new InfiniteNumber(1, Math.min(cheatLevel, 10), 100); // Extreme layers (capped at 10)
            break;
    }
    
    throttledUpdateUI();
});

// Passcode Dialog System
function showPasscodeDialog() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "10000";
    overlay.style.backdropFilter = "blur(5px)";
    
    // Create dialog box
    const dialog = document.createElement("div");
    dialog.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    dialog.style.padding = "30px";
    dialog.style.borderRadius = "15px";
    dialog.style.textAlign = "center";
    dialog.style.color = "white";
    dialog.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
    dialog.style.border = "2px solid rgba(255,255,255,0.2)";
    dialog.style.minWidth = "300px";
    
    dialog.innerHTML = `
        <h2 style="margin-top: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🔐 Cheat Access</h2>
        <p style="margin: 20px 0; font-size: 16px;">Enter the passcode to unlock cheat features:</p>
        <input type="password" id="passcodeInput" style="
            padding: 12px;
            border: none;
            border-radius: 8px;
            width: 200px;
            font-size: 16px;
            text-align: center;
            background: rgba(255,255,255,0.9);
            color: #333;
            margin: 10px 0;
        " placeholder="Enter passcode">
        <br>
        <button id="submitPasscode" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            margin: 10px 5px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s;
        ">Unlock</button>
        <button id="cancelPasscode" style="
            background: #f44336;
            color: white;
            border: none;
            padding: 12px 24px;
            margin: 10px 5px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s;
        ">Cancel</button>
        <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">💡 Hint: owner's name</p>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const input = document.getElementById("passcodeInput");
    const submitBtn = document.getElementById("submitPasscode");
    const cancelBtn = document.getElementById("cancelPasscode");
    
    // Focus on input
    input.focus();
    
    // Handle submit
    function handleSubmit() {
        const passcode = input.value.trim();
        if (passcode === "wikiepeidia") {
            cheatUnlocked = true;
            document.body.removeChild(overlay);
            cheatBtn.style.background = "linear-gradient(45deg, #ff6b6b, #4ecdc4)";
            cheatBtn.textContent = "🧪 Cheat Menu (UNLOCKED)";
        } else {
            input.style.background = "rgba(255,0,0,0.3)";
            input.value = "";
            input.placeholder = "Wrong passcode! Try again...";
            setTimeout(() => {
                input.style.background = "rgba(255,255,255,0.9)";
                input.placeholder = "Enter passcode";
            }, 1000);
        }
    }
    
    // Handle cancel
    function handleCancel() {
        document.body.removeChild(overlay);
    }
    
    // Event listeners
    submitBtn.addEventListener("click", handleSubmit);
    cancelBtn.addEventListener("click", handleCancel);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") handleCancel();
    });
    
    // Close on overlay click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) handleCancel();
    });
}

// Earn Money
function earnMoney() {
    let earnings = baseMoneyPerSec.multiply(multiplier);
    money = money.add(earnings);
    throttledUpdateUI();
}

// Start Earning Interval
let moneyInterval = setInterval(earnMoney, timeInterval);

// Session Timer
setInterval(() => {
    let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    sessionTimeDisplay.textContent = formatSessionTime(elapsedSeconds);
}, 1000);

// Initial UI Update
throttledUpdateUI();