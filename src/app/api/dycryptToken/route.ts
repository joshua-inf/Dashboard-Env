import { decodeToken, verifyToken } from "@/services/token";
import { allowedOrigins } from "@/utils/routesfunc";
import ncrypt from "ncrypt-js";


// ✅ Dynamic CORS header generator
function getCorsHeaders(request: Request): Record<string, string> {
    const origin = request.headers.get('origin') || '';
    const isAllowed = allowedOrigins.includes(origin);

    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
    };

    if (isAllowed) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return headers;
}

export async function OPTIONS(request: Request) {
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
}


export async function POST(request: Request) {
  const headers = getCorsHeaders(request);

  try {
    const { token } = await request.json();

    // Your secret key — MUST match the one used for encryption
    const SECRET_KEY = 'your-super-secret-key';
    const ncryptInstance = new ncrypt(SECRET_KEY);

    // Decrypt the token
    const decryptedData = ncryptInstance.decrypt(token); // This will return "id:companyAlias"

    // Ensure decryptedData is a string before splitting
    const [id, companyAlias] = String(decryptedData).split(':');

    return new Response(JSON.stringify({ id, companyAlias }), {
      status: 200,
      headers,
    });

  } catch (err) {
    console.error("Token decryption error:", err);
    return new Response(JSON.stringify({ error: "Decryption failed" }), {
      status: 500,
      headers,
    });
  }
}
