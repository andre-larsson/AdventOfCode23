import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");

const parseInput = (input) => {
    const hailstones = input.split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
        const [posStr, velStr] = line.split(" @ ");
        const [x, y, z] = posStr.split(", ").map((n) => parseInt(n));
        const [vx, vy, vz] = velStr.split(", ").map((n) => parseInt(n));

        // const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);
        // const direction = [vx / magnitude, vy / magnitude, vz / magnitude];

        // y = kx + m
        const k = vy / vx;
        const m = y - k * x;

        return { x, y, z, vx, vy, vz, k, m };
    });
    return hailstones;
}

const hailstones = parseInput(input);

const findIntersectionXY = (hailstone1, hailstone2) => {
    const { x: x1, y: y1, k: k1, m: m1 } = hailstone1;
    const { x: x2, y: y2, k: k2, m: m2 } = hailstone2;

    if (k1 === k2) {
        return null;
    }

    // point at which the two paths intersect
    const x = (m2 - m1) / (k1 - k2);
    const y = k1 * x + m1;

    const t1 = (x - x1) / hailstone1.vx; // time at which hailstone1 intersects path traced by hailstone2
    const t2 = (x - x2) / hailstone2.vx; // vice versa
    if (t1 < 0 || t2 < 0) {
        return null;
    }

    return { x, y };
}

let numIntersections = 0;

const bounds = [200000000000000, 400000000000000];
// const bounds = [7, 27];


for(let i = 0; i < hailstones.length; i++) {
    const hailstone1 = hailstones[i];
    for(let j = i + 1; j < hailstones.length; j++) {
        const hailstone2 = hailstones[j];
        const intersection = findIntersectionXY(hailstone1, hailstone2);
        if (intersection) {
            if(intersection.x >= bounds[0] && intersection.x <= bounds[1] &&
                intersection.y >= bounds[0] && intersection.y <= bounds[1]) {
                    numIntersections += 1;
                    // console.log("intersection for", i, j, intersection);
                }
        }
    }
}

console.log("Answer Part 1:", numIntersections);