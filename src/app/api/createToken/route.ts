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
        const { id, companyAlias } = await request.json();

        // Your secret key (preferably load this from an environment variable in real applications)
        const SECRET_KEY = 'your-super-secret-key';
        const ncryptInstance = new ncrypt(SECRET_KEY);

        // Combine and encrypt data
        const combinedData = `${id}:${companyAlias}`;
        const gottentoken = ncryptInstance.encrypt(combinedData);

        return new Response(JSON.stringify({ token: gottentoken }), {
            status: 200,
            headers,
        });

    } catch (err) {
        console.error("Token encryption error:", err);
        return new Response(JSON.stringify({ token: "error somewhere" }), {
            status: 500,
            headers,
        });
    }
}
