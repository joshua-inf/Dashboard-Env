import { supabase } from "./SupabaseConfig";

export async function getVendorAnalytics(){
  

  let { data, error } = await supabase
  .from('vendor_analytics')
  .select('*')



if(error){console.log(error);
  throw new Error("an error occured while fetching all vendor analytics")} 

return data;

}