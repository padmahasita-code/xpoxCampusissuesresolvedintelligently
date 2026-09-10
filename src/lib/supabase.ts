import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AgentStatus = 'Waiting' | 'Processing' | 'Completed';

export interface Complaint {
  id: string;
  student_name: string;
  student_id: string | null;
  block: string | null;
  location: string;
  category: string;
  description: string;
  issue_summary: string | null;
  issue_type: string | null;
  keywords: string[] | null;
  priority: Priority;
  priority_reason: string | null;
  department: string | null;
  department_reason: string | null;
  recommended_action: string | null;
  next_step: string | null;
  expected_response: string | null;
  follow_up_message: string | null;
  final_report: string | null;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
}

export interface AgentStep {
  id: string;
  complaint_id: string;
  agent_name: string;
  agent_label: string;
  status: AgentStatus;
  output: string | null;
  timestamp: string;
  step_order: number;
}

export interface NewComplaint {
  student_name: string;
  student_id: string;
  block: string;
  location: string;
  category: string;
  description: string;
}
