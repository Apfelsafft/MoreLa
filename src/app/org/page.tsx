"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Users, Globe, ChevronDown, X, MapPin, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { OrgData, Site, SiteEmployee, GlobalTeam, FlatEmployee } from "@/lib/types";

// ── Helper: count all employees at a site ─────────────────────────────────────
function siteEmployeeCount(site: Site): number {
  let count = 1 + site.staff_positions.length; // sitehead + stabsstellen
  for (const team of site.teams) {
    count += 1 + team.members.length; // teamlead + members
  }
  return count;
}

// ── World Map Dot ─────────────────────────────────────────────────────────────
function MapDot({
  site,
  selected,
  onClick,
}: {
  site: Site;
  selected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const x = ((site.lng + 180) / 360) * 100;
  const y = ((90 - site.lat) / 180) * 100;

  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {hovered && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap z-20 pointer-events-none border border-gray-200">
          <span className="mr-1">{site.flag}</span>
          {site.name}
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`rounded-full border-2 transition-all duration-200 ${
          selected
            ? "w-4 h-4 bg-yellow-400 border-yellow-200 shadow-lg shadow-yellow-400/50"
            : "w-3 h-3 bg-blue-400 border-blue-300 animate-pulse hover:animate-none hover:bg-blue-300"
        }`}
        aria-label={site.name}
      />
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div
      className={`${sizes[size]} bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ── Employee row ──────────────────────────────────────────────────────────────
function EmployeeRow({ emp }: { emp: SiteEmployee }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
        {emp.avatar_initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-tight">{emp.name}</p>
        <p className="text-xs text-gray-500 leading-tight">{emp.role}</p>
      </div>
    </div>
  );
}

// ── Site Detail Panel ─────────────────────────────────────────────────────────
function SiteDetailPanel({ site, onClose }: { site: Site; onClose: () => void }) {
  return (
    <div className="mt-4 bg-white rounded-xl border border-blue-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-600">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{site.flag}</span>
          <div>
            <h2 className="text-lg font-bold text-white">{site.name}</h2>
            <p className="text-sm text-blue-200">{site.country} · {site.timezone}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Sitehead */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Standortleitung
          </p>
          <div className="flex items-start gap-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <Avatar initials={site.sitehead.avatar_initials} size="lg" />
            <div>
              <p className="font-semibold text-gray-900">{site.sitehead.name}</p>
              <p className="text-sm text-blue-700 font-medium">{site.sitehead.role}</p>
              <a
                href={`mailto:${site.sitehead.email}`}
                className="flex items-center gap-1 text-xs text-gray-500 mt-1.5 hover:text-blue-600"
              >
                <Mail className="w-3 h-3" />
                {site.sitehead.email}
              </a>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Phone className="w-3 h-3" />
                {site.sitehead.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Stabsstellen */}
        {site.staff_positions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Stabsstellen
            </p>
            <div className="space-y-2">
              {site.staff_positions.map((emp) => (
                <div key={emp.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <Avatar initials={emp.avatar_initials} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.role}</p>
                    <a
                      href={`mailto:${emp.email}`}
                      className="flex items-center gap-1 text-xs text-gray-400 mt-1 hover:text-blue-600"
                    >
                      <Mail className="w-3 h-3" />
                      {emp.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teams */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Teams
          </p>
          <div className="space-y-4">
            {site.teams.map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">{team.name}</h4>
                  <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                    {1 + team.members.length} Personen
                  </span>
                </div>
                <div className="px-4 py-3 space-y-1 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Teamleitung
                  </p>
                  <EmployeeRow emp={team.teamlead} />
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Mitglieder
                  </p>
                  <div className="space-y-0.5">
                    {team.members.map((m) => (
                      <EmployeeRow key={m.id} emp={m} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Global Team Card ──────────────────────────────────────────────────────────
function GlobalTeamCard({
  team,
  org,
}: {
  team: GlobalTeam;
  org: OrgData;
}) {
  // Resolve lead name and site
  const leadSite = org.sites.find((s) => s.id === team.lead_site_id);
  const allSiteEmps: (SiteEmployee & { site: Site })[] = [];
  for (const site of org.sites) {
    const add = (e: SiteEmployee) => allSiteEmps.push({ ...e, site });
    add(site.sitehead);
    site.staff_positions.forEach(add);
    site.teams.forEach((t) => { add(t.teamlead); t.members.forEach(add); });
  }
  const lead = allSiteEmps.find((e) => e.id === team.lead_id);
  const members = team.member_ids
    .map((id) => allSiteEmps.find((e) => e.id === id))
    .filter((e): e is SiteEmployee & { site: Site } => !!e);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{team.name}</h3>
        </div>
        <span
          className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
            team.scope === "global"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {team.scope === "global" ? "Global" : `Regional · ${team.region}`}
        </span>
      </div>

      {lead && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Leitung
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {lead.avatar_initials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{lead.name}</p>
              <p className="text-xs text-gray-500">
                {lead.site.flag} {lead.site.name}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Mitglieder ({members.length})
        </p>
        <div className="space-y-1.5">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                {m.avatar_initials}
              </div>
              <span className="text-sm text-gray-700 truncate">{m.name}</span>
              <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{m.site.flag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Site Card ─────────────────────────────────────────────────────────────────
function SiteCard({
  site,
  selected,
  onClick,
}: {
  site: Site;
  selected: boolean;
  onClick: () => void;
}) {
  const empCount = siteEmployeeCount(site);

  return (
    <button
      onClick={onClick}
      className={`text-left bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all w-full ${
        selected
          ? "border-l-blue-500 ring-2 ring-blue-300"
          : "border-l-slate-300 hover:border-l-blue-400"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{site.flag}</span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{site.city}</h3>
              <p className="text-xs text-gray-500">{site.country}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform mt-0.5 ${selected ? "rotate-180" : ""}`}
          />
        </div>

        {/* Timezone */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Clock className="w-3 h-3" />
          {site.timezone}
        </div>

        {/* Sitehead */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {site.sitehead.avatar_initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-800 leading-tight truncate">
              {site.sitehead.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight truncate">{site.sitehead.role}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <span>{empCount} Mitarbeiter</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{site.teams.length} Teams</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Search Result Card ────────────────────────────────────────────────────────
function SearchResultCard({ emp, site }: { emp: FlatEmployee; site?: Site }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {emp.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{emp.name}</p>
        <p className="text-xs text-gray-500">{emp.role}</p>
        {site && (
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
            {site.flag} {site.name}
          </span>
        )}
        {!site && (
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            ITOT Head
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrgPage() {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

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
          <Header title="Organigramm" subtitle="Globale Standorte und Matrix-Teams" />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Wird geladen...</div>
          </main>
        </div>
      </div>
    );
  }

  const totalEmployees = org.employees.length;
  const totalTeams = org.sites.reduce((sum, s) => sum + s.teams.length, 0);
  const selectedSite = org.sites.find((s) => s.id === selectedSiteId) ?? null;

  const filteredEmployees = searchQuery.length >= 2
    ? org.employees.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const getSiteForEmployee = (e: FlatEmployee): Site | undefined =>
    e.site_id ? org.sites.find((s) => s.id === e.site_id) : undefined;

  const handleSiteClick = (siteId: string) => {
    setSelectedSiteId((prev) => (prev === siteId ? null : siteId));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-0">
        <Header title="Organigramm" subtitle="Globale Standorte und Matrix-Teams der TechCorp AG" />
        <main className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* ── ITOT Head ── */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl border-2 border-blue-300 p-5 flex items-start gap-4 w-80 shadow-sm">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {org.itot_head.avatar_initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">{org.itot_head.name}</p>
                <p className="text-sm text-blue-700 font-medium">{org.itot_head.role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{org.itot_head.location}</p>
                <a
                  href={`mailto:${org.itot_head.email}`}
                  className="flex items-center gap-1 text-xs text-gray-500 mt-1.5 hover:text-blue-600"
                >
                  <Mail className="w-3 h-3" />
                  {org.itot_head.email}
                </a>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {org.itot_head.phone}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              <strong className="text-gray-900">{org.sites.length}</strong> Standorte
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              <strong className="text-gray-900">{totalEmployees}</strong> Mitarbeiter
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              <strong className="text-gray-900">{totalTeams}</strong> Teams
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <strong className="text-gray-900">{org.global_teams.length}</strong> Globale Teams
            </span>
          </div>

          {/* ── World Map ── */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Weltweite Standorte
            </h2>
            <div
              className="relative bg-slate-900 rounded-xl overflow-hidden"
              style={{ aspectRatio: "2/1" }}
            >
              {/* Subtle grid lines */}
              <div className="absolute inset-0">
                {/* Horizontal lines at 25%, 50%, 75% */}
                <div className="absolute w-full border-t border-slate-700/50" style={{ top: "25%" }} />
                <div className="absolute w-full border-t border-slate-500/60" style={{ top: "50%" }}>
                  <span className="absolute right-3 top-1 text-xs text-slate-400 font-medium select-none">
                    Äquator
                  </span>
                </div>
                <div className="absolute w-full border-t border-slate-700/50" style={{ top: "75%" }} />
                {/* Vertical lines at 25%, 50%, 75% */}
                <div className="absolute h-full border-l border-slate-700/30" style={{ left: "25%" }} />
                <div className="absolute h-full border-l border-slate-700/30" style={{ left: "50%" }} />
                <div className="absolute h-full border-l border-slate-700/30" style={{ left: "75%" }} />
              </div>

              {/* Site dots */}
              {org.sites.map((site) => (
                <MapDot
                  key={site.id}
                  site={site}
                  selected={selectedSiteId === site.id}
                  onClick={() => handleSiteClick(site.id)}
                />
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 right-3 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span>Standort</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span>Ausgewählt</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Mitarbeiter über alle Standorte suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Zurücksetzen
              </button>
            )}
          </div>

          {/* ── Search Results ── */}
          {filteredEmployees && (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                {filteredEmployees.length} Ergebnis{filteredEmployees.length !== 1 ? "se" : ""}{" "}
                für &ldquo;{searchQuery}&rdquo;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredEmployees.map((emp) => (
                  <SearchResultCard
                    key={emp.id}
                    emp={emp}
                    site={getSiteForEmployee(emp)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Standorte Grid ── */}
          {!filteredEmployees && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                Standorte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {org.sites.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    selected={selectedSiteId === site.id}
                    onClick={() => handleSiteClick(site.id)}
                  />
                ))}
              </div>

              {/* Detail panel */}
              {selectedSite && (
                <SiteDetailPanel
                  site={selectedSite}
                  onClose={() => setSelectedSiteId(null)}
                />
              )}
            </div>
          )}

          {/* ── Globale & Regionale Teams ── */}
          {!filteredEmployees && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                Globale &amp; Regionale Teams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {org.global_teams.map((team) => (
                  <GlobalTeamCard key={team.id} team={team} org={org} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
