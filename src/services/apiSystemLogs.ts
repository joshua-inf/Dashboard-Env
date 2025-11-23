import { supabase } from "./SupabaseConfig";

export async function getSystemLogs(){
  

  let { data, error } = await supabase
  .from('system_logs')
  .select('*')




if(error){console.log(error);
  throw new Error("an error occured while fetching all system logs")} 

return data;

}