import type { Priority } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────
export interface AgentResult {
  // Complaint Analysis Agent
  issue_summary: string;
  issue_type: string;
  keywords: string[];
  // Priority Agent
  priority: Priority;
  priority_reason: string;
  // Department Routing Agent
  department: string;
  department_reason: string;
  // Action Planning Agent
  recommended_action: string;
  next_step: string;
  expected_response: string;
  // Follow-up Agent
  follow_up_message: string;
  // Summary Agent
  final_report: string;
}

export interface AgentDef {
  name: string;
  label: string;
  icon: string;
  description: string;
}

export const AGENTS: AgentDef[] = [
  { name: 'analysis', label: 'Complaint Analysis Agent', icon: 'ScanText', description: 'Understands the complaint, extracts the main issue, and identifies keywords.' },
  { name: 'priority', label: 'Priority Agent', icon: 'AlertTriangle', description: 'Determines urgency: Low, Medium, High, or Critical.' },
  { name: 'routing', label: 'Department Routing Agent', icon: 'Building2', description: 'Routes the complaint to the correct department.' },
  { name: 'action', label: 'Action Planning Agent', icon: 'ClipboardList', description: 'Generates a recommended action plan.' },
  { name: 'followup', label: 'Follow-up Agent', icon: 'BellRing', description: 'Tracks status and generates follow-up suggestions.' },
  { name: 'summary', label: 'Summary Agent', icon: 'FileText', description: 'Combines all agent outputs into a final report.' },
];

// ─── Keyword dictionaries for demo-mode analysis ─────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'IT / Wi-Fi': ['wi-fi', 'wifi', 'wi fi', 'internet', 'network', 'router', 'connection', 'online', 'lan', 'bandwidth', 'signal', 'access point', 'ethernet'],
  'Electrical': ['fan', 'light', 'lights', 'electrical', 'power', 'switch', 'socket', 'wiring', 'short circuit', 'bulb', 'tube light', 'ac', 'air conditioner', 'fuse'],
  'Maintenance': ['broken', 'desk', 'chair', 'chairs', 'window', 'windows', 'door', 'doors', 'wall', 'ceiling', 'paint', 'furniture', 'board', 'whiteboard', 'projector', 'bench'],
  'Water / Sanitation': ['water', 'tap', 'leak', 'leakage', 'pipe', 'drainage', 'drain', 'toilet', 'washroom', 'restroom', 'bathroom', 'sewage', 'sanitation', 'overflow'],
  'Laboratory': ['lab', 'laboratory', 'equipment', 'microscope', 'computer', 'pc', 'monitor', 'keyboard', 'mouse', 'printer', 'experiment', 'apparatus', 'specimen'],
  'Cleanliness': ['clean', 'cleanliness', 'dust', 'dirty', 'garbage', 'trash', 'waste', 'sweep', 'mop', 'hygiene', 'rodent', 'pest', 'insect', 'smell', 'odor'],
};

const PRIORITY_CRITICAL = ['fire', 'smoke', 'electric shock', 'spark', 'gas leak', 'collapse', 'flood', 'severe', 'dangerous', 'hazard', 'emergency', 'shock'];
const PRIORITY_HIGH = ['not working', 'down', 'broken', 'no power', 'no water', 'cannot access', "can't access", 'exam', 'laboratory', 'lab', 'online lab', 'materials', 'critical equipment', 'entire', 'all'];
const PRIORITY_MEDIUM = ['slow', 'intermittent', 'sometimes', 'flickering', 'noise', 'minor', 'partial', 'few'];

const DEPARTMENT_MAP: Record<string, { department: string; reason: string }> = {
  'IT / Wi-Fi': {
    department: 'IT Support',
    reason: 'The complaint involves network/connectivity infrastructure, which is managed by the IT Support department.',
  },
  'Electrical': {
    department: 'Electrical Maintenance',
    reason: 'The issue relates to electrical fixtures or power systems, handled by the Electrical Maintenance team.',
  },
  'Maintenance': {
    department: 'Campus Maintenance',
    reason: 'Physical infrastructure and furniture repairs fall under Campus Maintenance.',
  },
  'Water / Sanitation': {
    department: 'Water & Sanitation',
    reason: 'Plumbing and water supply issues are managed by the Water & Sanitation department.',
  },
  'Laboratory': {
    department: 'Laboratory Administration',
    reason: 'Lab equipment and laboratory-specific issues are handled by Laboratory Administration.',
  },
  'Cleanliness': {
    department: 'Housekeeping & Cleanliness',
    reason: 'Cleaning and hygiene concerns are the responsibility of the Housekeeping department.',
  },
};

const ACTION_PLANS: Record<string, { action: string; next_step: string; response: string }> = {
  'IT / Wi-Fi': {
    action: 'Dispatch a network technician to inspect the router/access point and verify connectivity at the reported location.',
    next_step: 'Test network connectivity from a student device after repair; log the access point status in the IT inventory.',
    response: '2-4 hours for high priority, same day for medium priority.',
  },
  'Electrical': {
    action: 'Send an electrician to inspect the fixture, check wiring, and repair or replace the faulty component.',
    next_step: 'Verify the repaired fixture is operational and conduct a safety check of nearby electrical points.',
    response: '2-4 hours for high priority, within 24 hours for medium priority.',
  },
  'Maintenance': {
    action: 'Assign a maintenance worker to repair or replace the damaged furniture/fixture.',
    next_step: 'Inspect adjacent items for similar wear and schedule preventive maintenance if needed.',
    response: 'Within 24 hours for high priority, 2-3 days for medium priority.',
  },
  'Water / Sanitation': {
    action: 'Dispatch a plumber to locate the source of the leak/blockage and repair the affected pipe or fixture.',
    next_step: 'Check surrounding areas for water damage and sanitize the affected area after repair.',
    response: '2-4 hours for high priority, within 24 hours for medium priority.',
  },
  'Laboratory': {
    action: 'Notify the lab in-charge to inspect the equipment and arrange for repair or replacement.',
    next_step: 'Tag the faulty equipment, record it in the lab maintenance log, and arrange a temporary replacement if available.',
    response: 'Same day for high priority, within 48 hours for medium priority.',
  },
  'Cleanliness': {
    action: 'Deploy housekeeping staff to clean and sanitize the reported area immediately.',
    next_step: 'Add the area to the regular cleaning schedule and inspect for recurring issues.',
    response: 'Within 4 hours for high priority, same day for medium priority.',
  },
};

// ─── Helpers ─────────────────────────────────────────────
function lower(text: string): string {
  return text.toLowerCase();
}

function containsAny(text: string, words: string[]): string | null {
  for (const w of words) {
    if (text.includes(w)) return w;
  }
  return null;
}

function detectCategory(description: string): { category: string; matched: string[] } {
  const text = lower(description);
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matched = keywords.filter((k) => text.includes(k));
    if (matched.length > 0) return { category, matched };
  }
  return { category: 'General', matched: [] };
}

function extractKeywords(description: string, matchedKeywords: string[]): string[] {
  const text = lower(description);
  const stopWords = new Set(['the', 'is', 'are', 'not', 'in', 'a', 'an', 'and', 'or', 'to', 'of', 'for', 'on', 'at', 'by', 'with', 'it', 'this', 'that', 'there', 'here', 'was', 'has', 'have', 'had', 'been', 'being', 'from', 'as', 'so', 'do', 'does', 'did', 'can', "can't", 'cannot', 'could', 'will', 'would', 'should', 'may', 'might', 'must', 'shall', 'about', 'into', 'but', 'if', 'then', 'else', 'when', 'where', 'which', 'who', 'whom', 'whose', 'what', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also']);

  const words = text
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const unique = [...new Set([...matchedKeywords, ...words])];
  return unique.slice(0, 10);
}

function detectPriority(description: string, category: string): { priority: Priority; reason: string } {
  const text = lower(description);

  if (containsAny(text, PRIORITY_CRITICAL)) {
    return {
      priority: 'CRITICAL',
      reason: 'The complaint contains language indicating a potential safety hazard or emergency situation, requiring immediate attention.',
    };
  }

  if (containsAny(text, PRIORITY_HIGH)) {
    return {
      priority: 'HIGH',
      reason: 'The issue disrupts core academic activities (such as lab access or exams) or describes a complete outage of an essential service.',
    };
  }

  if (containsAny(text, PRIORITY_MEDIUM) || category === 'General') {
    return {
      priority: 'MEDIUM',
      reason: 'The issue affects usability but is not a complete outage or safety risk. It should be addressed within a reasonable timeframe.',
    };
  }

  return {
    priority: 'LOW',
    reason: 'The complaint describes a minor inconvenience that does not disrupt academic activities or safety. It can be addressed during routine maintenance.',
  };
}

function generateSummary(description: string, category: string, keywords: string[]): string {
  const trimmed = description.trim();
  if (trimmed.length <= 120) return trimmed;
  return trimmed.slice(0, 117).trimEnd() + '...';
}

function generateFollowUp(status: string, priority: Priority): string {
  switch (status) {
    case 'Submitted':
      return `Complaint has been submitted and routed. The assigned department has been notified. ${priority === 'CRITICAL' || priority === 'HIGH' ? 'Given the high urgency, expect an initial response within a few hours.' : 'Expect an initial response within 24 hours.'}`;
    case 'Assigned':
      return 'The complaint has been assigned to the relevant department. A technician or staff member should begin work shortly. No further action is needed from the student at this time.';
    case 'In Progress':
      return 'The department is actively working on resolving this complaint. The student will be notified once the issue is resolved. If the problem worsens, please add a follow-up note.';
    case 'Resolved':
      return 'This complaint has been marked as resolved. The student is encouraged to verify the fix and reopen the complaint if the issue persists.';
    default:
      return 'Complaint is being tracked. The system will provide updates as the status changes.';
  }
}

function generateFinalReport(params: {
  issueSummary: string;
  issueType: string;
  priority: Priority;
  department: string;
  action: string;
  status: string;
}): string {
  return [
    `FINAL COMPLAINT REPORT`,
    ``,
    `Issue: ${params.issueSummary}`,
    `Type: ${params.issueType}`,
    `Priority: ${params.priority}`,
    `Routed Department: ${params.department}`,
    `Recommended Action: ${params.action}`,
    `Current Status: ${params.status}`,
    ``,
    `This report was generated collaboratively by six AI agents: Complaint Analysis, Priority, Department Routing, Action Planning, Follow-up, and Summary agents.`,
  ].join('\n');
}

// ─── Main analysis function ──────────────────────────────
export function analyzeComplaint(params: {
  description: string;
  category: string;
  location: string;
}): AgentResult {
  const { description, category, location } = params;

  // Override category via keyword detection, but respect manual category if it matches
  const detected = detectCategory(description);
  const finalCategory = detected.category !== 'General' ? detected.category : category;

  const keywords = extractKeywords(description, detected.matched);
  const issueSummary = generateSummary(description, finalCategory, keywords);
  const issueType = detected.matched.length > 0
    ? `The complaint is about ${finalCategory.toLowerCase()} — specifically related to: ${detected.matched.slice(0, 3).join(', ')}.`
    : `The complaint is a ${finalCategory.toLowerCase()} issue reported at ${location}.`;

  const { priority, reason: priority_reason } = detectPriority(description, finalCategory);

  const deptInfo = DEPARTMENT_MAP[finalCategory] ?? {
    department: 'Administration',
    reason: 'The complaint does not clearly map to a specific maintenance department, so it has been routed to Administration for manual review.',
  };

  const actionPlan = ACTION_PLANS[finalCategory] ?? {
    action: 'Review the complaint details and assign it to the appropriate maintenance or administrative team.',
    next_step: 'Confirm the issue is resolved and update the complaint status accordingly.',
    response: priority === 'CRITICAL' || priority === 'HIGH' ? 'Within 4 hours.' : 'Within 24-48 hours.',
  };

  const followUp = generateFollowUp('Submitted', priority);

  const finalReport = generateFinalReport({
    issueSummary,
    issueType,
    priority,
    department: deptInfo.department,
    action: actionPlan.action,
    status: 'Submitted',
  });

  return {
    issue_summary: issueSummary,
    issue_type: issueType,
    keywords,
    priority,
    priority_reason,
    department: deptInfo.department,
    department_reason: deptInfo.reason,
    recommended_action: actionPlan.action,
    next_step: actionPlan.next_step,
    expected_response: actionPlan.response,
    follow_up_message: followUp,
    final_report: finalReport,
  };
}

// ─── Per-agent outputs (for agent activity display) ──────
export function getAgentOutput(agentName: string, result: AgentResult): string {
  switch (agentName) {
    case 'analysis':
      return `Summary: "${result.issue_summary}" | Keywords: ${result.keywords.join(', ')}`;
    case 'priority':
      return `${result.priority} — ${result.priority_reason}`;
    case 'routing':
      return `${result.department} — ${result.department_reason}`;
    case 'action':
      return `${result.recommended_action} Next: ${result.next_step}`;
    case 'followup':
      return result.follow_up_message;
    case 'summary':
      return 'Final report generated combining all agent outputs.';
    default:
      return '';
  }
}
