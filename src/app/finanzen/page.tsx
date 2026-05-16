"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { FinancesData } from "@/lib/data";

function formatEur(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2).replace(".", ",")} Mio. €`;
  return `${n.toLocaleString("de-DE")} €`;
}

export default function FinanzenPage() {
  const [finances, setFinances] = useState<FinancesData | null>(null);

  useEffect(() => {
    fetch("/api/finances")
      .then((r) => r.json())
      .then(setFinances);
  }, []);

  if (!finances) {
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
