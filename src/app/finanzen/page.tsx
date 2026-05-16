"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { FinancesData, ActivitiesData, Activity } from "@/lib/types";

function formatEur(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2).replace(".", ",")} Mio. €`;
  return `${n.toLocaleString("de-DE")} €`;
}

function activityTotal(a: Activity): number {
  return (
    a.costs.licences +
    a.costs.msp_service_contracts +
    a.costs.internal_fte +
    a.costs.external_fte +
    a.costs.contractors
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  RUN: "RUN",
  NEW_RUN: "NEW RUN",
  CARRY_OVER: "CARRY OVER",
  LTO: "LTO",
  BC: "BC",
  TECH: "TECH",
};

const CATEGORY_COLORS: Record<string, string> = {
  RUN: "bg-blue-500",
  NEW_RUN: "bg-blue-300",
  CARRY_OVER: "bg-amber-500",
  LTO: "bg-red-500",
  BC: "bg-green-500",
  TECH: "bg-purple-500",
};

export default function FinanzenPage() {
  const [finances, setFinances] = useState<FinancesData | null>(null);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [activeTab, setActiveTab] = useState<"kategorie" | "kostentyp">("kategorie");
  const [tableExpanded, setTableExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/finances")
      .then((r) => r.json())
      .then(setFinances);
    fetch("/api/activities")
      .then((r) => r.json())
      .then(setActivitiesData);
  }, []);

  if (!finances || !activitiesData) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 min-h-0">
          <Header title="Finanzen & Budget" />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Daten werden geladen...</p>
          </main>
        </div>
      </div>
    );
  }

  const totalUsedPct = Math.round((finances.total_spent / finances.total_budget) * 100);
  const forecastPct = Math.round((finances.total_forecast / finances.total_budget) * 100);
  const maxMonthly = Math.max(...finances.monthly_spend.map((m) => m.forecast));

  const activities = activitiesData.activities;

  // Compute category totals
  const categories = ["RUN", "NEW_RUN", "CARRY_OVER", "LTO", "BC", "TECH"] as const;
  const catTotals: Record<string, number> = {};
  for (const cat of categories) {
    catTotals[cat] = activities
      .filter((a) => a.cost_category === cat)
      .reduce((sum, a) => sum + activityTotal(a), 0);
  }

  const runTotal = catTotals["RUN"] + catTotals["NEW_RUN"];
  const investTotal = catTotals["CARRY_OVER"] + catTotals["LTO"] + catTotals["BC"] + catTotals["TECH"];
  const grandTotal = runTotal + investTotal;

  // Compute cost type totals
  const licences = activities.reduce((s, a) => s + a.costs.licences, 0);
  const msp = activities.reduce((s, a) => s + a.costs.msp_service_contracts, 0);
  const internalFte = activities.reduce((s, a) => s + a.costs.internal_fte, 0);
  const externalFte = activities.reduce((s, a) => s + a.costs.external_fte, 0);
  const contractors = activities.reduce((s, a) => s + a.costs.contractors, 0);
  const thirdPartyTotal = licences + msp;
  const labourTotal = internalFte + externalFte + contractors;

  // Sorted activities for table
  const sortedActivities = [...activities].sort((a, b) => activityTotal(b) - activityTotal(a));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-0">
        <Header
          title="Finanzen & Budget"
          subtitle={`Geschäftsjahr ${finances.year} · Stand: ${new Date(finances.updated).toLocaleDateString("de-DE")}`}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              label="Gesamtbudget"
              value={formatEur(finances.total_budget)}
              sub="Genehmigtes Jahresbudget"
              icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
              bg="bg-blue-50"
            />
            <KpiCard
              label="Ausgaben YTD"
              value={formatEur(finances.total_spent)}
              sub={`${totalUsedPct}% des Budgets verbraucht`}
              icon={<AlertCircle className="w-5 h-5 text-orange-500" />}
              bg="bg-orange-50"
            />
            <KpiCard
              label="Prognose Jahresende"
              value={formatEur(finances.total_forecast)}
              sub={`${forecastPct}% des Budgets prognostiziert`}
              icon={<TrendingDown className="w-5 h-5 text-emerald-600" />}
              bg="bg-emerald-50"
            />
          </div>

          {/* Budget utilization bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Gesamt-Budgetauslastung</h2>
              <span className="text-sm font-bold text-gray-900">{totalUsedPct}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${totalUsedPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0 €</span>
              <span>{formatEur(finances.total_spent)} ausgegeben</span>
              <span>{formatEur(finances.total_budget)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Breakdown Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Abteilungs-Budget</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Abteilung</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ausgaben</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ausl.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {finances.departments.map((dept) => {
                    const pct = Math.round((dept.spent / dept.budget) * 100);
                    return (
                      <tr key={dept.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{dept.name}</p>
                          <p className="text-xs text-gray-400">{dept.headcount} MA</p>
                        </td>
                        <td className="px-5 py-3 text-right text-gray-600">{formatEur(dept.budget)}</td>
                        <td className="px-5 py-3 text-right text-gray-600">{formatEur(dept.spent)}</td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`font-semibold ${pct > 80 ? "text-orange-600" : "text-gray-900"}`}
                          >
                            {pct}%
                          </span>
                          <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden w-16 ml-auto">
                            <div
                              className={`h-full rounded-full ${pct > 80 ? "bg-orange-400" : "bg-blue-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cost Categories */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Kostenkategorien</h2>
              <div className="space-y-4">
                {finances.categories.map((cat) => {
                  const pct = Math.round((cat.spent / cat.budget) * 100);
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        <span className="text-gray-500 text-xs">
                          {formatEur(cat.spent)} / {formatEur(cat.budget)}
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 text-right">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monthly Spend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-gray-900">Monatliche Ausgaben {finances.year}</h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                  <span>Ist</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-blue-200 rounded-sm" />
                  <span>Prognose</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {finances.monthly_spend.map((m) => {
                const forecastH = Math.round((m.forecast / maxMonthly) * 100);
                const actualH = m.actual !== null ? Math.round((m.actual / maxMonthly) * 100) : 0;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-32 relative">
                      {/* Forecast bar */}
                      <div
                        className="w-full bg-blue-100 rounded-t-sm absolute bottom-0"
                        style={{ height: `${forecastH}%` }}
                        title={`Prognose: ${formatEur(m.forecast)}`}
                      />
                      {/* Actual bar */}
                      {m.actual !== null && (
                        <div
                          className="w-full bg-blue-500 rounded-t-sm absolute bottom-0"
                          style={{ height: `${actualH}%` }}
                          title={`Ist: ${formatEur(m.actual)}`}
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Activities Section ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Activities — Kostenaufschlüsselung</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activities.length} Activities · Gesamt: {formatEur(grandTotal)}
                </p>
              </div>
              {/* Toggle tabs */}
              <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("kategorie")}
                  className={`px-4 py-2 transition-colors ${
                    activeTab === "kategorie"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Nach Kategorie
                </button>
                <button
                  onClick={() => setActiveTab("kostentyp")}
                  className={`px-4 py-2 border-l border-gray-200 transition-colors ${
                    activeTab === "kostentyp"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Nach Kostentyp
                </button>
              </div>
            </div>

            {activeTab === "kategorie" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RUN Group */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">RUN</h3>
                    <span className="text-sm font-bold text-gray-900">{formatEur(runTotal)}</span>
                  </div>
                  <div className="space-y-3">
                    {(["RUN", "NEW_RUN"] as const).map((cat) => {
                      const pct = grandTotal > 0 ? (catTotals[cat] / grandTotal) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{CATEGORY_LABELS[cat]}</span>
                            <span className="text-gray-500 text-xs">{formatEur(catTotals[cat])}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CATEGORY_COLORS[cat]}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}% vom Gesamt</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* INVESTMENTS Group */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">INVESTMENTS</h3>
                    <span className="text-sm font-bold text-gray-900">{formatEur(investTotal)}</span>
                  </div>
                  <div className="space-y-3">
                    {(["CARRY_OVER", "LTO", "BC", "TECH"] as const).map((cat) => {
                      const pct = grandTotal > 0 ? (catTotals[cat] / grandTotal) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{CATEGORY_LABELS[cat]}</span>
                            <span className="text-gray-500 text-xs">{formatEur(catTotals[cat])}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CATEGORY_COLORS[cat]}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}% vom Gesamt</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 3rd Party */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">3rd Party</h3>
                    <span className="text-sm font-bold text-gray-900">{formatEur(thirdPartyTotal)}</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Licences", value: licences, color: "bg-indigo-500" },
                      { label: "MSP / Service Contracts", value: msp, color: "bg-indigo-300" },
                    ].map((item) => {
                      const pct = grandTotal > 0 ? (item.value / grandTotal) * 100 : 0;
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-500 text-xs">{formatEur(item.value)}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}% vom Gesamt</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LABOUR */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">LABOUR</h3>
                    <span className="text-sm font-bold text-gray-900">{formatEur(labourTotal)}</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Internal FTE", value: internalFte, color: "bg-teal-500" },
                      { label: "External FTE", value: externalFte, color: "bg-teal-300" },
                      { label: "Contractors", value: contractors, color: "bg-teal-200" },
                    ].map((item) => {
                      const pct = grandTotal > 0 ? (item.value / grandTotal) * 100 : 0;
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-500 text-xs">{formatEur(item.value)}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}% vom Gesamt</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activities Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Activity-Tabelle</h2>
              <button
                onClick={() => setTableExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {tableExpanded ? (
                  <>Einklappen <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Alle anzeigen <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">APM-ID</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Kategorie</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Lizenzen</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">MSP</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Int. FTE</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ext. FTE</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contractors</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Gesamt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(tableExpanded ? sortedActivities : sortedActivities.slice(0, 8)).map((a) => {
                    const total = activityTotal(a);
                    return (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{a.servicenow_apm_id}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{a.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${CATEGORY_COLORS[a.cost_category]}`}
                          >
                            {CATEGORY_LABELS[a.cost_category]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                          {a.costs.licences > 0 ? formatEur(a.costs.licences) : "–"}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                          {a.costs.msp_service_contracts > 0 ? formatEur(a.costs.msp_service_contracts) : "–"}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                          {a.costs.internal_fte > 0 ? formatEur(a.costs.internal_fte) : "–"}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                          {a.costs.external_fte > 0 ? formatEur(a.costs.external_fte) : "–"}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                          {a.costs.contractors > 0 ? formatEur(a.costs.contractors) : "–"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                          {formatEur(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={3} className="px-4 py-3 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      Gesamt ({activities.length} Activities)
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatEur(licences)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatEur(msp)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatEur(internalFte)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatEur(externalFte)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatEur(contractors)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">{formatEur(grandTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{sub}</p>
        </div>
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>{icon}</div>
      </div>
    </div>
  );
}
