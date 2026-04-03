/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { calculate5x5Average, rgbToLab } = require('./colorMath');

exports.handler = async (event) => {
    console.log(`DetectColor Execution Initialize: ${JSON.stringify(event)}`);

    try {
        // API Gateway maps the HTTP POST request into a string format.
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
        
        const { imageBase64, tapX, tapY, imageWidth, imageHeight } = body;

        // Failsafe parameter parsing
        if (!imageBase64 || tapX === undefined || tapY === undefined) {
             return {
                 statusCode: 400,
                 headers: {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Headers": "*"
                 },
                 body: JSON.stringify({ message: "Missing required parameters: imageBase64, tapX, or tapY vectors missing." })
             };
        }

        // 1. Calculate Average RGB mathematically natively on the Node runtime.
        const avgRgb = calculate5x5Average(imageBase64, Math.floor(tapX), Math.floor(tapY));
        console.log("Calculated 5x5 Average RGB Bounds:", avgRgb);

        // 2. Convert standard RGB scalars uniformly into mathematically constrained CIELAB dimensions.
        const lab = rgbToLab(avgRgb);
        console.log("Converted precise CIELAB structural format:", lab);

        // 3. MOCK DATA RETURN 
        // Tasks 6.2 - 6.5 (The entire Colors Master Database deployment) are completely untouched right now.
        // It is impossible to dynamically evaluate nearest-neighbor groupings without a backend dataset.
        // We will mock the return object format to fully satisfy Task 5.5 and prevent blocking frontend integrations.
        const mockMatchedColor = {
            colorID: "mock-uuid-amethyst",
            detailedColorName: "Amethyst Purple",
            familyColorName: "Purple",
            hex: "#9966cc",
            rgb: avgRgb,         // Inject actual realtime computed mathematical truths!
            lab: lab             // Inject actual realtime perceptual truths!
        };

        return {
            statusCode: 200,
            headers: {
                 "Access-Control-Allow-Origin": "*",
                 "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(mockMatchedColor),
        };

    } catch (error) {
        console.error("DetectColor Lambda Exception Caught:", error);
        return {
            statusCode: 500,
            headers: {
                 "Access-Control-Allow-Origin": "*",
                 "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ message: error.message || "Failed to process color extraction matrices." }),
        };
    }
};
