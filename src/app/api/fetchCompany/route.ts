import { supabase } from "@/services/SupabaseConfig";
import { allowedOrigins } from "@/utils/routesfunc";

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
    const { business_id } = await request.json();
    console.log(business_id)

    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', business_id)
            .single();

        if (!data) {
            console.log('User does not exist');
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
                status: 401,
                headers: getCorsHeaders(request),
            });
        }

        console.log(data)

        if(data)  {
             return new Response(
                JSON.stringify({ message: 'data collectd successfully', data : data }),
                {
                    status: 200,
                    headers: getCorsHeaders(request),
                }
            );
        }

        if(error){
            console.error("Error fetching business:", error);
            return new Response(JSON.stringify({ message: 'Error fetching business' }), {
                status: 500,
                headers: getCorsHeaders(request),
            });
        }

    } catch (err) {
        console.error("Unexpected error during login:", err);
    }

    return new Response(JSON.stringify({ message: 'Business does not exist' }), {
        status: 401,
        headers: getCorsHeaders(request),
    });
}
