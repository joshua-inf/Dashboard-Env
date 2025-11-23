export interface GenerateParams {
  supabase: any;
  userId: string;
  businessId?: string | null;
  authToken?: string;
  model?: string;
}

export interface Insight {
  id?: string;
  business_id: string;
  title: string;
  summary: string;
  insight_type: string;
  insight_data: Record<string, any>;
  confidence: number;
  generated_at: string;
  source_refs: { tables: string[] };
  model_version: string;
  hash: string;
  created_at: string;
  updated_at: string;
}