import { supabase } from "./SupabaseConfig";

export async function getCustomersInsight(){
  
let { data, error } = await supabase
.from('customer_insights')
.select('*')

if(error){console.log(error);
  throw new Error("an error occured while fetching all customer insights")} 

return data;

}