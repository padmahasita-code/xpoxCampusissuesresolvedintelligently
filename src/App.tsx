import { useCallback, useEffect, useState } from 'react';
import { Navbar, type Page } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { ReportIssuePage } from '@/pages/ReportIssuePage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { ResultPage } from '@/pages/ResultPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AgentActivity } from '@/components/AgentActivity';
import { LoadingSpinner, ErrorState } from '@/components/States';
import type { Complaint, NewComplaint, ComplaintStatus, AgentStep } from '@/lib/supabase';
import {
  fetchComplaints,
  createComplaint,
  runAgentAnalysis,
  saveAgentSteps,
  fetchAgentSteps,
  updateComplaintStatus,
  deleteComplaint,
  seedSampleComplaints,
} from '@/lib/complaintStore';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingDescription, setPendingDescription] = useState('');
  const [seeded, setSeeded] = useState(false);

  // Initial load + seed
  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!seeded) {
        await seedSampleComplaints();
        setSeeded(true);
      }
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [seeded]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  // Navigation
  const navigate = (p: Page) => {
    setPage(p);
    if (p === 'home' || p === 'dashboard') {
      setSelectedComplaint(null);
      setAgentSteps([]);
    }
  };

  // Submit new complaint → run agents → go to analysis page
  const handleSubmit = async (input: NewComplaint) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setPendingDescription(input.description);

      // 1. Create the complaint record
      const complaint = await createComplaint(input);

      // 2. Run AI agent analysis (updates complaint with all agent outputs)
      await runAgentAnalysis(complaint);

      // 3. Save agent steps for visualization
      const steps = await saveAgentSteps(complaint.id);
      setAgentSteps(steps);

      // 4. Refresh complaints list
      const refreshed = await fetchComplaints();
      setComplaints(refreshed);

      // 5. Find the updated complaint
      const updated = refreshed.find((c) => c.id === complaint.id) || null;
      setSelectedComplaint(updated);

      // 6. Navigate to analysis page
      setPage('analysis');
      setIsAnalyzing(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  // After analysis animation completes
  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    if (selectedComplaint) {
      setPage('result');
    }
  };

  // Select a complaint from dashboard
  const handleSelectComplaint = async (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    try {
      const steps = await fetchAgentSteps(complaint.id);
      setAgentSteps(steps);
    } catch {
      setAgentSteps([]);
    }
    setPage('result');
  };

  // Update status
  const handleUpdateStatus = async (id: string, status: ComplaintStatus) => {
    const updated = await updateComplaintStatus(id, status);
    setSelectedComplaint(updated);
    setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  // Delete complaint
  const handleDelete = async (id: string) => {
    await deleteComplaint(id);
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  // Compute stats
  const stats = complaints.length > 0
    ? {
        total: complaints.length,
        pending: complaints.filter((c) => c.status !== 'Resolved').length,
        high: complaints.filter((c) => c.priority === 'HIGH' || c.priority === 'CRITICAL').length,
        resolved: complaints.filter((c) => c.status === 'Resolved').length,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white">
      <Navbar current={page} onNavigate={navigate} />

      <main>
        {loading && page !== 'report' && <LoadingSpinner label="Loading CampusCare AI..." className="min-h-[50vh]" />}

        {!loading && error && (
          <div className="mx-auto max-w-3xl px-4 py-20">
            <ErrorState message={error} onRetry={loadComplaints} />
          </div>
        )}

        {!loading && !error && (
          <>
            {page === 'home' && <HomePage onNavigate={navigate} stats={stats} />}

            {page === 'report' && (
              <ReportIssuePage
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={submitError}
              />
            )}

            {page === 'analysis' && selectedComplaint && (
              <AnalysisPage
                onComplete={handleAnalysisComplete}
                agentSteps={agentSteps}
                isRunning={isAnalyzing}
                complaintDescription={pendingDescription}
              />
            )}

            {page === 'result' && selectedComplaint && (
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ResultPage
                      complaint={selectedComplaint}
                      onBack={() => navigate('dashboard')}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <AgentActivity steps={agentSteps} complaintDescription={selectedComplaint.description} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === 'dashboard' && (
              <DashboardPage
                complaints={complaints}
                onSelect={handleSelectComplaint}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </main>

      <footer className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 -z-0 opacity-50">
          <div className="absolute left-1/4 bottom-0 h-20 w-40 rounded-full bg-cyan-200/20 blur-2xl" />
          <div className="absolute right-1/4 bottom-0 h-20 w-40 rounded-full bg-blue-200/20 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-sm font-medium text-transparent">
            CampusCare AI — Report. Analyze. Resolve. Built for the All Things Agentic Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
