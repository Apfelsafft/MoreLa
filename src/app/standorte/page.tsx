"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { SitePagesData, SitePage } from "@/lib/types";

export default function StandortePage() {
  const [data, setData] = useState<SitePagesData | null>(null);

  useEffect(() => {
    fetch("/api/site-pages")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 min-h-0">
          <Header title="Standorte" />
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
          title="Standorte"
          subtitle={`ITOT Site Pages · Stand: ${new Date(data.updated).toLocaleDateString("de-DE")}`}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.site_pages.map((site: SitePage) => (
              <Link
                key={site.id}
                href={`/standorte/${site.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{site.flag}</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {site.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">{site.country}</p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{site.beschreibung_itot}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{site.in_scope.length} In-Scope Items</span>
                    <span>{site.systeme_in_fokus.length} Systeme</span>
                    <span>{site.projekte_in_scope.length} Projekte</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
