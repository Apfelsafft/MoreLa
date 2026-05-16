"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { OrgData, Employee, Department } from "@/lib/data";

export default function OrgPage() {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then(setOrg);
  }, []);

  if (!org) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header title="Organigramm" subtitle="Abteilungen und Mitarbeiter" />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Wird geladen...</div>
          </main>
        </div>
      </div>
    );
  }

  const cio = org.employees.find((e) => e.reports_to === null);

  const filteredEmployees = searchQuery
    ? org.employees.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const getDeptEmployees = (deptId: string): Employee[] =>
    org.employees.filter((e) => e.department_id === deptId && e.id !== cio?.id);

  const getDeptHead = (dept: Department): Employee | undefined =>
    org.employees.find((e) => e.id === dept.head_id);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-0">
        <Header title="Organigramm" subtitle="Abteilungen und Mitarbeiter der TechCorp AG" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Search */}
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Mitarbeiter suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Zurücksetzen
              </button>
            )}
          </div>

          {/* Search results */}
          {filteredEmployees && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">
                {filteredEmployees.length} Ergebnis{filteredEmployees.length !== 1 ? "se" : ""} für &ldquo;{searchQuery}&rdquo;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredEmployees.map((emp) => (
                  <EmployeeCard key={emp.id} emp={emp} org={org} />
                ))}
              </div>
            </div>
          )}

          {!filteredEmployees && (
            <>
              {/* CIO */}
              {cio && (
                <div className="flex justify-center mb-8">
                  <div className="bg-white rounded-xl border-2 border-blue-200 p-5 flex items-start gap-4 w-72 shadow-sm">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {cio.avatar_initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cio.name}</p>
                      <p className="text-sm text-blue-600 font-medium">{cio.role}</p>
                      <a
                        href={`mailto:${cio.email}`}
                        className="flex items-center gap-1 text-xs text-gray-500 mt-1.5 hover:text-blue-600"
                      >
                        <Mail className="w-3 h-3" />
                        {cio.email}
                      </a>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {cio.phone}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Departments */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {org.departments.map((dept) => {
                  const head = getDeptHead(dept);
                  const members = getDeptEmployees(dept.id).filter(
                    (e) => e.id !== dept.head_id
                  );
                  const allDeptMembers = getDeptEmployees(dept.id);

                  return (
                    <div
                      key={dept.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      {/* Dept header */}
                      <div
                        className="px-5 py-4 flex items-center justify-between"
                        style={{ backgroundColor: dept.color }}
                      >
                        <div>
                          <h3 className="font-semibold text-white text-sm">{dept.name}</h3>
                          <p className="text-xs text-white/80 mt-0.5">{allDeptMembers.length} Mitarbeiter</p>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Dept head */}
                      {head && (
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Abteilungsleitung
                          </p>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: dept.color }}
                            >
                              {head.avatar_initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{head.name}</p>
                              <p className="text-xs text-gray-500">{head.role}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Team members */}
                      <div className="px-5 py-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Team
                        </p>
                        <div className="space-y-2.5">
                          {members.map((emp) => (
                            <div key={emp.id} className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                                {emp.avatar_initials}
                              </div>
                              <div>
                                <p className="text-sm text-gray-800 font-medium">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: dept.color }}
                        >
                          {allDeptMembers.length} Mitarbeiter
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function EmployeeCard({ emp, org }: { emp: Employee; org: OrgData }) {
  const dept = org.departments.find((d) => d.id === emp.department_id);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: dept?.color ?? "#6b7280" }}
      >
        {emp.avatar_initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{emp.name}</p>
        <p className="text-xs text-gray-500">{emp.role}</p>
        {dept && (
          <span
            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: dept.color }}
          >
            {dept.name}
          </span>
        )}
        <a
          href={`mailto:${emp.email}`}
          className="flex items-center gap-1 text-xs text-gray-400 mt-1 hover:text-blue-600"
        >
          <Mail className="w-3 h-3" />
          {emp.email}
        </a>
      </div>
    </div>
  );
}
