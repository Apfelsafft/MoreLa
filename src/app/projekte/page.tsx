"use client";

import { useState, useEffect } from "react";
import { User, Calendar, Tag } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import type { Project, OrgData, ProjectsData } from "@/lib/types";
import { formatCurrency } from "@/lib/types";

type FilterStatus = "all" | "active" | "planning" | "completed" | "on-hold";

const filterLabels: Record<FilterStatus, string> = {
  all: "Alle",
  active: "Aktiv",
  planning: "Planung",
  completed: "Abgeschlossen",
  "on-hold": "On Hold",
};

export default function ProjektePage() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [org, setOrg] = useState<OrgData | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/org").then((r) => r.json()),
    ]).then(([pd, od]) => {
      setProjectsData(pd);
      setOrg(od);
    });
  }, []);

  const filteredProjects =
    projectsData?.projects.filter((p) =>
      filter === "all" ? true : p.status === filter
    ) ?? [];

  const getLeadName = (leadId: string): string =>
    org?.employees.find((e) => e.id === leadId)?.name ?? "–";

  const getPracticeAreaName = (id: string): string =>
    org?.practice_areas?.find((p) => p.id === id)?.name ?? "–";

  const getPracticeAreaColor = (id: string): string =>
    org?.practice_areas?.find((p) => p.id === id)?.color ?? "#6b7280";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-0">
        <Header
          title="Projektportfolio"
          subtitle="Alle Projekte der IT-Abteilungen"
        />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filter buttons */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {(Object.keys(filterLabels) as FilterStatus[]).map((status) => {
              const count =
                status === "all"
                  ? projectsData?.projects.length ?? 0
                  : projectsData?.projects.filter((p) => p.status === status).length ?? 0;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filterLabels[status]}
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      filter === status
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {!projectsData && (
            <div className="flex items-center justify-center h-48">
              <div className="animate-pulse text-gray-400">Wird geladen...</div>
            </div>
          )}

          {/* Projects grid */}
          {projectsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  leadName={getLeadName(project.project_lead_id)}
                  practiceAreaName={getPracticeAreaName(project.department_id)}
                  practiceAreaColor={getPracticeAreaColor(project.department_id)}
                />
              ))}
              {filteredProjects.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-400">
                  Keine Projekte in dieser Kategorie
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  leadName,
  practiceAreaName,
  practiceAreaColor,
}: {
  project: Project;
  leadName: string;
  practiceAreaName: string;
  practiceAreaColor: string;
}) {
  const budgetPct = Math.round((project.spent / project.budget) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">{project.name}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Fortschritt</span>
          <span className="font-medium text-gray-700">{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              project.status === "completed"
                ? "bg-gray-400"
                : project.status === "on-hold"
                ? "bg-red-400"
                : "bg-blue-500"
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Budget */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Budget</span>
          <span className="font-medium text-gray-700">{budgetPct}% verbraucht</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-900">{formatCurrency(project.spent)}</span>
          <span className="text-gray-400">/ {formatCurrency(project.budget)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <User className="w-3.5 h-3.5" />
          <span>{leadName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">
            {new Date(project.start_date).toLocaleDateString("de-DE", {
              month: "short",
              year: "numeric",
            })}{" "}
            –{" "}
            {new Date(project.end_date).toLocaleDateString("de-DE", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: practiceAreaColor }}
        >
          {practiceAreaName.replace("IT ", "")}
        </span>
      </div>
    </div>
  );
}
