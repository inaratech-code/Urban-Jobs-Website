"use client";

import {
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  index?: number;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-soft-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-display font-bold text-slate-800 mt-1">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  totalCandidates: number;
  totalEmployers: number;
  activeJobs: number;
  applications: number;
}

export default function DashboardStats({
  totalCandidates,
  totalEmployers,
  activeJobs,
  applications,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Candidates"
        value={totalCandidates}
        icon={<HiOutlineUserGroup className="h-6 w-6" />}
        index={0}
      />
      <StatCard
        title="Total Employers"
        value={totalEmployers}
        icon={<HiOutlineBuildingOffice2 className="h-6 w-6" />}
        index={1}
      />
      <StatCard
        title="Active Jobs"
        value={activeJobs}
        icon={<HiOutlineBriefcase className="h-6 w-6" />}
        index={2}
      />
      <StatCard
        title="Applications"
        value={applications}
        icon={<HiOutlineClipboardDocumentList className="h-6 w-6" />}
        index={3}
      />
    </div>
  );
}
