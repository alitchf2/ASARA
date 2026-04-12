import { describe, it, expect } from '@jest/globals';
import { rgbToLab } from '../colorConverters';

describe('RGB to CIELAB Colorimetric Conversions', () => {

    // Helper tolerance check: standard deviation bound due to slight 
    // XYZ / CIELAB reference white point precision limits in testing definitions
    const assertLabClose = (actual: any, expected: any, tolerance: number = 0.5) => {
        expect(Math.abs(actual.l - expected.l)).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(actual.a - expected.a)).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(actual.b - expected.b)).toBeLessThanOrEqual(tolerance);
    };

    it('1. Correctly maps Pure Black', () => {
        const lab = rgbToLab({ r: 0, g: 0, b: 0 });
        assertLabClose(lab, { l: 0, a: 0, b: 0 });
    });

    it('2. Correctly maps Pure White', () => {
        const lab = rgbToLab({ r: 255, g: 255, b: 255 });
        assertLabClose(lab, { l: 100, a: 0, b: 0 }); // Actually close to exactly 100
    });

    it('3. Correctly maps True Red', () => {
        const lab = rgbToLab({ r: 255, g: 0, b: 0 });
        assertLabClose(lab, { l: 53.24, a: 80.09, b: 67.20 }, 0.5);
    });

    it('4. Correctly maps True Green', () => {
        const lab = rgbToLab({ r: 0, g: 255, b: 0 });
        assertLabClose(lab, { l: 87.73, a: -86.18, b: 83.18 }, 0.5);
    });

    it('5. Correctly maps True Blue', () => {
        const lab = rgbToLab({ r: 0, g: 0, b: 255 });
        assertLabClose(lab, { l: 32.30, a: 79.19, b: -107.86 }, 0.5);
    });

    it('6. Correctly maps Secondary Yellow', () => {
        const lab = rgbToLab({ r: 255, g: 255, b: 0 });
        assertLabClose(lab, { l: 97.14, a: -21.55, b: 94.48 }, 0.5);
    });

    it('7. Correctly maps Secondary Cyan', () => {
        const lab = rgbToLab({ r: 0, g: 255, b: 255 });
        assertLabClose(lab, { l: 91.11, a: -48.09, b: -14.13 }, 0.5);
    });

    it('8. Correctly maps Secondary Magenta', () => {
        const lab = rgbToLab({ r: 255, g: 0, b: 255 });
        assertLabClose(lab, { l: 60.32, a: 98.23, b: -60.82 }, 0.5);
    });

    it('9. Correctly maps Mid-Grey', () => {
        const lab = rgbToLab({ r: 128, g: 128, b: 128 });
        assertLabClose(lab, { l: 53.59, a: 0, b: 0 }, 0.5);
    });

    it('10. Correctly maps Dark-Grey', () => {
        const lab = rgbToLab({ r: 64, g: 64, b: 64 });
        assertLabClose(lab, { l: 27.09, a: 0, b: 0 }, 0.5);
    });
});
