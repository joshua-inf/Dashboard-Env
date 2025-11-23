import { supabase } from "@/services/SupabaseConfig";
import { generateToken } from "@/services/token";
import { allowedOrigins } from "@/utils/routesfunc";
import bcrypt from 'bcryptjs';


// ✅ Dynamic CORS handler
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
    interface RegisterPayload {
        name: string;
        email: string;
        password: string;
    }
    const headers = getCorsHeaders(request);

    const { name, email, password } = await request.json() as RegisterPayload;;
    // console.log(name, email, password);
    if (email) {
        try {
            const lowerCaseEmail = email;

            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', lowerCaseEmail)
                .single();

            if (existingUser) {
                return new Response(JSON.stringify({ message: 'User already exists' }), {
                    status: 409,
                    headers,
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        name,
                        email: lowerCaseEmail,
                        password_hash: hashedPassword,
                        role: "business_owner",
                    }
                ])
                .select()
                .single(); // so we get the inserted user back

            if (insertError) {
                console.error('Insert error:', insertError.message);
                return new Response(JSON.stringify({ message: 'Error inserting user' }), {
                    status: 500,
                    headers,
                });
            }

            const Token = generateToken(insertData, '24h');

            return new Response(JSON.stringify({ message: 'User created successfully', Token, userdata: insertData }), {
                status: 201,
                headers,
            });

        } catch (err) {
            console.error("Unexpected error:", err);
            return new Response(JSON.stringify({ message: 'Unexpected error' }), {
                status: 500,
                headers,
            });
        }
    } else {
        return new Response(JSON.stringify({ message: 'email npt valid or null' }), {
            status: 404,
            headers,
        });
    }

}
