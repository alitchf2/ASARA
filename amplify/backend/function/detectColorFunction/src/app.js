/* detectColorFunction/src/app.js */
const colorsData = require('./colors.json'); 

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

function respond(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

function hexToRgb(hex) {
  const cleanHex = (hex || '').replace('#', '');
  if (cleanHex.length !== 6) return null;
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16),
  };
}

let colorsList = [];

// Parse the DynamoDB dumped Items into a flatter structure on Lambda cold start
function getColorsList() {
  if (colorsList.length > 0) return colorsList;
  if (colorsData.Items) {
    colorsList = colorsData.Items.map(item => {
      const r = item.rgb?.M?.r?.N;
      const g = item.rgb?.M?.g?.N;
      const b = item.rgb?.M?.b?.N;

      return {
        hex: item.hex?.S || '',
        name: item.detailedColorName?.S || item.colorName?.S || '',
        family: item.familyColorName?.S || '',
        id: item.colorID?.S || '',
        r: r ? parseInt(r, 10) : 0,
        g: g ? parseInt(g, 10) : 0,
        b: b ? parseInt(b, 10) : 0,
      };
    }).filter(c => c.hex !== '');
  }
  return colorsList;
}

exports.handler = async (event) => {
  try {
    const list = getColorsList();
    const method = event.httpMethod;
    const path = event.path || '';

    // Allow CORS preflight
    if (method === 'OPTIONS') return respond(200, {});
    
    if (method === 'POST') {
      let body;
      try { 
        body = JSON.parse(event.body || '{}'); 
      } catch { 
        body = {}; 
      }
      
      const targetHex = body.hexColor;
      if (!targetHex) {
        return respond(400, { error: "hexColor is required in the JSON body" });
      }
      
      const targetRgb = hexToRgb(targetHex);
      if (!targetRgb) {
        return respond(400, { error: "invalid hexColor format. Expected #RRGGBB" });
      }
      
      let closestColor = null;
      let minDistance = Infinity;
      
      // Calculate Euclidean distance in O(n)
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        const dr = c.r - targetRgb.r;
        const dg = c.g - targetRgb.g;
        const db = c.b - targetRgb.b;
        
        const distSq = dr*dr + dg*dg + db*db;
        if (distSq < minDistance) {
          minDistance = distSq;
          closestColor = c;
        }
      }
      
      return respond(200, {
        closestColor: closestColor ? {
          hex: closestColor.hex,
          name: closestColor.name,
          family: closestColor.family
        } : null
      });
    }
    
    return respond(404, { error: "Not Found" });
  } catch (err) {
    console.error("detectColorFunction ERROR:", err);
    return respond(500, { error: err.message, stack: err.stack });
  }
};
