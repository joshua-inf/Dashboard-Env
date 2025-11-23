import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://gaicgetnnwptxbqooywd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhaWNnZXRubndwdHhicW9veXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzI0MzksImV4cCI6MjA0NzQwODQzOX0.RZex9divfq6kxl8jwHeOvhvB_Qwqu4UiTuPz-4rOmEY';

console.log(supabaseUrl, supabaseKey)
// @ts-ignore
export const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Supabase connection failed:", error.message);
        } else {
            console.log("Supabase connection successful!");
        }
    } catch (err) {
        console.error("Error connecting to Supabase:", err);
    }
})();
