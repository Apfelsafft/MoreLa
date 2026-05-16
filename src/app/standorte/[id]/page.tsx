"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { SitePagesData, SitePage, SitePageSystem, SitePageProject } from "@/lib/types";

function SystemStatusBadge({ status }: { status: SitePageSystem["status"] }) {
  const map = {
    active: { label: "Aktiv", color: "bg-green-100 text-green-700", Icon: CheckCircle },
    in_migration: { label: "In Migration", color: "bg-amber-100 text-amber-700", Icon: Loader2 },
    eol: { label: "EOL", color: "bg-red-100 text-red-700", Icon: XCircle },
    planned: { label: "Geplant", color: "bg-blue-100 text-blue-700", Icon: Clock },
  };
  const { label, color, Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function ProjectStatusBadge({ status }: { status: SitePageProject["status"] }) {
  const map = {
    active: { label: "Aktiv", color: "bg-green-100 text-green-700" },
    planning: { label: "Planung", color: "bg-blue-100 text-blue-700" },
    completed: { label: "Abgeschlossen", color: "bg-gray-100 text-gray-600" },
    "on-hold": { label: "On Hold", color: "bg-red-100 text-red-700" },
  };
  const { label, color } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

export default function StandortDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [site, setSite] = useState<SitePage | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/site-pages")
      .then((r) => r.json())
      .then((data: SitePagesData) => {
        const found = data.site_pages.find((s) => s.id === id);
        if (found) {
          setSite(found);
        } else {
          setNotFound(true);
        }
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 min-h-0">
          <Header title="Standort nicht gefunden" />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Standort &quot;{id}&quot; nicht gefunden.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 min-h-0">
          <Header title="Standort" />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Daten werden geladen...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-0">
        <Header
          title={`${site.flag} ${site.name}`}
          subtitle={`ITOT Site Page · ${site.country}`}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* 1. Beschreibung ITOT */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Beschreibung ITOT</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{site.beschreibung_itot}</p>
          </div>

          {/* 2. In Scope */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">In Scope</h2>
            <div className="flex flex-wrap gap-2">
              {site.in_scope.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Roadmap */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Roadmap</h2>
            <div className="space-y-6">
              {site.roadmap.map((entry, idx) => (
                <div key={entry.quarter} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">{idx + 1}</span>
                    </div>
                    {idx < site.roadmap.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-100 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{entry.quarter}</p>
                    <ul className="space-y-1.5">
                      {entry.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Systeme in Fokus */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Systeme in Fokus</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hinweis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {site.systeme_in_fokus.map((sys) => (
                  <tr key={sys.name} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{sys.name}</td>
                    <td className="px-6 py-3">
                      <SystemStatusBadge status={sys.status} />
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">{sys.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. Projekte in Scope */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Projekte in Scope</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {site.projekte_in_scope.map((proj) => (
                <div
                  key={proj.name}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{proj.name}</p>
                    <ProjectStatusBadge status={proj.status} />
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Lead:</span> {proj.lead}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
