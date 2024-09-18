function decodeY(base, value) {
    // Parse the value from the given base to decimal
    return parseInt(value, base);
}

function lagrangeInterpolation(points) {
    function basis(j, x) {
        let term = 1;
        for (let i = 0; i < points.length; i++) {
            if (i !== j) {
                term *= (x - points[i][0]) / (points[j][0] - points[i][0]);
            }
        }
        return term;
    }

    function interpolate(x) {
        let total = 0;
        for (let j = 0; j < points.length; j++) {
            total += points[j][1] * basis(j, x);
        }
        return total;
    }

    // Find the constant term by evaluating the polynomial at x = 0
    return interpolate(0);
}

// Sample input
const inputJson = `
{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}
`;

// Parse the input JSON
const data = JSON.parse(inputJson);
const n = data.keys.n;
const k = data.keys.k;

// Decode the points
let points = [];
for (const key in data) {
    if (key !== "keys") {
        const x = parseInt(key);
        const base = parseInt(data[key]["base"]);
        const yEncoded = data[key]["value"];
        const y = decodeY(base, yEncoded);
        points.push([x, y]);
    }
}

// Using Lagrange interpolation to find the constant term
const constant = lagrangeInterpolation(points);
console.log(`The constant term c is: ${constant}`);
