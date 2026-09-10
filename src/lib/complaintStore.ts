import { supabase } from '@/lib/supabase';
import type { Complaint, AgentStep, NewComplaint, ComplaintStatus } from '@/lib/supabase';
import { analyzeComplaint, getAgentOutput } from '@/lib/agents';

export async function fetchComplaints(): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchComplaint(id: string): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchAgentSteps(complaintId: string): Promise<AgentStep[]> {
  const { data, error } = await supabase
    .from('agent_steps')
    .select('*')
    .eq('complaint_id', complaintId)
    .order('step_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createComplaint(input: NewComplaint): Promise<Complaint> {
  const { data, error } = await supabase
    .from('complaints')
    .insert({
      student_name: input.student_name,
      student_id: input.student_id || null,
      block: input.block || null,
      location: input.location,
      category: input.category,
      description: input.description,
      status: 'Submitted',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function runAgentAnalysis(complaint: Complaint): Promise<Complaint> {
  const result = analyzeComplaint({
    description: complaint.description,
    category: complaint.category,
    location: complaint.location,
  });

  const { data, error } = await supabase
    .from('complaints')
    .update({
      issue_summary: result.issue_summary,
      issue_type: result.issue_type,
      keywords: result.keywords,
      priority: result.priority,
      priority_reason: result.priority_reason,
      department: result.department,
      department_reason: result.department_reason,
      recommended_action: result.recommended_action,
      next_step: result.next_step,
      expected_response: result.expected_response,
      follow_up_message: result.follow_up_message,
      final_report: result.final_report,
      status: 'Assigned',
      updated_at: new Date().toISOString(),
    })
    .eq('id', complaint.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveAgentSteps(complaintId: string): Promise<AgentStep[]> {
  // We need the complaint to run analysis
  const complaint = await fetchComplaint(complaintId);
  if (!complaint) throw new Error('Complaint not found');

  const result = analyzeComplaint({
    description: complaint.description,
    category: complaint.category,
    location: complaint.location,
  });

  const agents = [
    { name: 'analysis', label: 'Complaint Analysis Agent' },
    { name: 'priority', label: 'Priority Agent' },
    { name: 'routing', label: 'Department Routing Agent' },
    { name: 'action', label: 'Action Planning Agent' },
    { name: 'followup', label: 'Follow-up Agent' },
    { name: 'summary', label: 'Summary Agent' },
  ];

  const rows = agents.map((agent, i) => ({
    complaint_id: complaintId,
    agent_name: agent.name,
    agent_label: agent.label,
    status: 'Completed' as const,
    output: getAgentOutput(agent.name, result),
    timestamp: new Date().toISOString(),
    step_order: i,
  }));

  const { data, error } = await supabase
    .from('agent_steps')
    .insert(rows)
    .select();
  if (error) throw error;
  return data ?? [];
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint> {
  const { data, error } = await supabase
    .from('complaints')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComplaint(id: string): Promise<void> {
  const { error } = await supabase.from('complaints').delete().eq('id', id);
  if (error) throw error;
}

// ─── Seed sample complaints for demo ─────────────────────
const SAMPLE_COMPLAINTS: NewComplaint[] = [
  {
    student_name: 'Padma Sharma',
    student_id: 'CS21-042',
    block: 'Block A',
    location: 'Block A Computer Lab',
    category: 'IT / Wi-Fi',
    description: 'Wi-Fi is not working in the Block A computer lab and students cannot access their online lab materials.',
  },
  {
    student_name: 'Rahul Verma',
    student_id: 'EE22-015',
    block: 'Block C',
    location: 'Block C Room 204',
    category: 'Electrical',
    description: 'The ceiling fan in room 204 is not working and the lights are flickering. It is very difficult to attend classes in the dark.',
  },
  {
    student_name: 'Anjali Reddy',
    student_id: 'BT20-088',
    block: 'Block B',
    location: 'Block B Washroom',
    category: 'Water / Sanitation',
    description: 'There is a water leakage from the pipe in the Block B washroom. Water is overflowing and the floor is slippery.',
  },
  {
    student_name: 'Karthik Nair',
    student_id: 'ME23-031',
    block: 'Block D',
    location: 'Block D Laboratory',
    category: 'Laboratory',
    description: 'The microscope in the biology lab is broken and cannot be used for the practical exam scheduled tomorrow.',
  },
  {
    student_name: 'Sneha Iyer',
    student_id: 'IT21-067',
    block: 'Block A',
    location: 'Block A Corridor',
    category: 'Cleanliness',
    description: 'The corridor in Block A is very dirty and has not been cleaned for two days. There is a bad smell and garbage is piling up.',
  },
];

export async function seedSampleComplaints(): Promise<void> {
  const { count } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
  if (count && count > 0) return;

  for (const sample of SAMPLE_COMPLAINTS) {
    const complaint = await createComplaint(sample);
    await runAgentAnalysis(complaint);
    await saveAgentSteps(complaint.id);
  }
}
