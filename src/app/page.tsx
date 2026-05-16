import Link from "next/link";
import { Users, FolderKanban, BarChart3, ArrowRight, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getOrgData, getProjectsData, getFinancesData, getActivitiesData, formatCurrency } from "@/lib/data";

export default async function DashboardPage() {
  const org = getOrgData();
  const projectsData = getProjectsData();
  const finances = getFinancesData();
  const activitiesData = getActivitiesData();

  const activeProjects = projectsData.projects.filter((p) => p.status === "active").length;
  const planningProjects = projectsData.projects.filter((p) => p.status === "planning").length;
  const completedProjects = projectsData.projects.filter((p) => p.status === "completed").length;
  const onHoldProjects = projectsData.projects.filter((p) => p.status === "on-hold").length;

  const totalEmployees = org.employees.length;
  const totalSites = org.sites.length;

  const budgetUsedPercent = Math.round((finances.total_spent / finances.total_budget) * 100);

  const kpiCards = [
    {
      label: "Gesamtbudget 2025",
      value: formatCurrency(finances.total_budget),
      icon: BarChart3,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Aktive Projekte",
      value: String(activeProjects),
      icon: FolderKanban,
      color: "bg-green-600",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Mitarbeiter",
      value: String(totalEmployees),
      icon: Users,
      color: "bg-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Standorte",
      value: String(totalSites),
      icon: MapPin,
      color: "bg-orange-600",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const quickLinks = [
    {
      href: "/org",
      label: "Organigramm",
      description: "Globale Standorte und Matrix-Teams",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      href: "/projekte",
      label: "Projektportfolio",
      description: "Alle laufenden und geplanten Projekte",
      icon: FolderKanban,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      href: "/finanzen",
      label: "Finanzen & Budget",
      description: "Budgetübersicht und Ausgaben",
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const statusItems = [
    { label: "Aktiv", count: activeProjects, color: "bg-green-500" },
    { label: "Planung", count: planningProjects, color: "bg-yellow-500" },
    { label: "Abgeschlossen", count: completedProjects, color: "bg-gray-400" },
    { label: "On Hold", count: onHoldProjects, color: "bg-red-500" },
  ];

  const top3Depts = finances.departments.slice(0, 3);

  // Activities cost breakdown
  const acts = activitiesData.activities;
  const actTotal = acts.reduce(
    (sum, a) =>
      sum +
      a.costs.licences +
      a.costs.msp_service_contracts +
      a.costs.internal_fte +
      a.costs.external_fte +
      a.costs.contractors,
    0
  );
  const runTotal = acts
    .filter((a) => a.cost_group === "RUN")
    .reduce(
      (sum, a) =>
        sum +
        a.costs.licences +
        a.costs.msp_service_contracts +
        a.costs.internal_fte +
        a.costs.external_fte +
        a.costs.contractors,
      0
    );
  const investTotal = actTotal - runTotal;
  const thirdPartyTotal = acts.reduce((s, a) => s + a.costs.licences + a.costs.msp_service_contracts, 0);
  const labourTotal = acts.reduce((s, a) => s + a.costs.internal_fte + a.costs.external_fte + a.costs.contractors, 0);
  const runPct = actTotal > 0 ? Math.round((runTotal / actTotal) * 100) : 0;
  const thirdPartyPct = actTotal > 0 ? Math.round((thirdPartyTotal / actTotal) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-0">
        <Header
          title="Dashboard"
          subtitle="Willkommen beim IT Support Assistant — TechCorp AG"
        />
        <main className="flex-1 overflow-y-auto p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
                >
                  <div
                    className={`${card.lightColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Projects by Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Projekte nach Status</h2>
              <div className="space-y-3">
                {statusItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Gesamt: {projectsData.projects.length} Projekte
                </p>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Budget Übersicht</h2>
              <div className="space-y-3">
                {top3Depts.map((dept) => {
                  const pct = Math.round((dept.spent / dept.budget) * 100);
                  return (
                    <div key={dept.id}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span className="truncate pr-2">{dept.name}</span>
                        <span className="flex-shrink-0">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Gesamtauslastung</span>
                  <span className="font-medium text-gray-700">{budgetUsedPercent}%</span>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
              <div className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`${link.bg} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${link.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{link.label}</p>
                        <p className="text-xs text-gray-500 truncate">{link.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Aktive Projekte (Übersicht)</h2>
              <Link
                href="/projekte"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Alle anzeigen <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {projectsData.projects
                .filter((p) => p.status === "active")
                .slice(0, 4)
                .map((project) => {
                  const lead = org.employees.find((e) => e.id === project.project_lead_id);
                  return (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                        <p className="text-xs text-gray-500">{lead?.name ?? "–"}</p>
                      </div>
                      <div className="w-24 flex-shrink-0">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Fortschritt</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Cost Breakdown Widget */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Kostenaufschlüsselung (Activities)</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Gesamt: {formatCurrency(actTotal)} · {acts.length} Activities
                </p>
              </div>
              <Link
                href="/finanzen"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* RUN vs INVESTMENTS */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Nach Kategorie</p>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">RUN</span>
                      <span className="text-xs text-gray-500">{runPct}% · {formatCurrency(runTotal)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${runPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">INVESTMENTS</span>
                      <span className="text-xs text-gray-500">{100 - runPct}% · {formatCurrency(investTotal)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${100 - runPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* 3rd Party vs LABOUR */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Nach Kostentyp</p>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">3rd Party</span>
                      <span className="text-xs text-gray-500">{thirdPartyPct}% · {formatCurrency(thirdPartyTotal)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${thirdPartyPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">LABOUR</span>
                      <span className="text-xs text-gray-500">{100 - thirdPartyPct}% · {formatCurrency(labourTotal)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${100 - thirdPartyPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
