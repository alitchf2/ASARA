const { decode } = require('jpeg-js');

const calculate5x5Average = (base64Data, tapX, tapY) => {
    // Standard defensive cleanup: Strip React Native UI padding tags natively if passed unexpectedly
    const pureBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

    const imgBuffer = Buffer.from(pureBase64, 'base64');
    const rawImageData = decode(imgBuffer, { useTArray: true }); // Fast array mode
    
    const width = rawImageData.width;
    const height = rawImageData.height;
    const pixelData = rawImageData.data;

    const startX = Math.max(0, tapX - 2);
    const endX = Math.min(width - 1, tapX + 2);
    const startY = Math.max(0, tapY - 2);
    const endY = Math.min(height - 1, tapY + 2);

    let sumR = 0, sumG = 0, sumB = 0, pixelCount = 0;

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            const index = (y * width + x) * 4;
            sumR += pixelData[index];
            sumG += pixelData[index + 1];
            sumB += pixelData[index + 2];
            pixelCount++;
        }
    }

    if (pixelCount === 0) return { r: 0, g: 0, b: 0 };

    return {
        r: Math.round(sumR / pixelCount),
        g: Math.round(sumG / pixelCount),
        b: Math.round(sumB / pixelCount)
    };
};

const srgbToLinear = (colorChannel) => {
    const normalized = colorChannel / 255.0;
    if (normalized > 0.04045) {
        return Math.pow((normalized + 0.055) / 1.055, 2.4);
    }
    return normalized / 12.92;
};

const f = (t) => {
    if (t > 0.008856) return Math.pow(t, 1.0 / 3.0);
    return (903.3 * t + 16.0) / 116.0;
};

const rgbToLab = ({ r, g, b }) => {
    const linearR = srgbToLinear(r);
    const linearG = srgbToLinear(g);
    const linearB = srgbToLinear(b);

    let x = (linearR * 0.4124 + linearG * 0.3576 + linearB * 0.1805) * 100.0;
    let y = (linearR * 0.2126 + linearG * 0.7152 + linearB * 0.0722) * 100.0;
    let z = (linearR * 0.0193 + linearG * 0.1192 + linearB * 0.9505) * 100.0;

    const vx = x / 95.047;
    const vy = y / 100.000;
    const vz = z / 108.883;

    const fy = f(vy);
    const fx = f(vx);
    const fz = f(vz);

    return {
        l: (116.0 * fy) - 16.0,
        a: 500.0 * (fx - fy),
        b: 200.0 * (fy - fz)
    };
};

module.exports = { calculate5x5Average, rgbToLab };
