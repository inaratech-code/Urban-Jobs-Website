import type { CandidateWorkflowStatus, EmployerJobPipelineStatus } from "@/types";

export const CANDIDATE_WORKFLOW_OPTIONS: CandidateWorkflowStatus[] = [
  "New",
  "Processed",
  "Leads Provided",
  "Matched",
  "Completed (Payment Done)",
  "Renew ID",
];

export const EMPLOYER_JOB_PIPELINE_OPTIONS: EmployerJobPipelineStatus[] = [
  "New",
  "Processed",
  "Leads Given",
  "Matched",
  "Completed",
];
