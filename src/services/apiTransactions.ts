import { supabase } from "./SupabaseConfig";

export async function getTransactions(){
  

  let { data: Transactions, error } = await supabase
  .from('Transactions')
  .select('*')


if(error) throw new Error(error.message)
return Transactions;

}