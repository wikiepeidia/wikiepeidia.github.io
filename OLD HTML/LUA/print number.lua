local ReplicatedStorage = game:GetService("ReplicatedStorage")
local EN = require(ReplicatedStorage.modules.EternityNum)

-- Calculate 2^(10 billion)
local base = EN.fromNumber(2)
local exponent = EN.fromNumber(10000000000) -- 10 billion
local result = EN.pow(base, exponent)

-- Display the result in different formats
print("2^10B calculations:")
print("Scientific notation: " .. EN.toScientific(result))
print("Short form (abbreviated): " .. EN.short(result))
print("Layer notation: " .. EN.toLayerNotation(result))
print("Suffix form: " .. EN.toSuffix(result))

-- Also show the raw EternityNum structure
print("Raw structure - Sign: " .. result.Sign .. ", Layer: " .. result.Layer .. ", Exp: " .. result.Exp)