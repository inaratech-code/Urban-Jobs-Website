/** Admin workflow for candidates */
export type CandidateWorkflowStatus =
  | "New"
  | "Processed"
  | "Leads Provided"
  | "Matched"
  | "Completed (Payment Done)"
  | "Renew ID";

/** Admin pipeline for employer job postings */
export type EmployerJobPipelineStatus =
  | "New"
  | "Processed"
  | "Leads Given"
  | "Matched"
  | "Completed";
