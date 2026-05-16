// ── Legacy interfaces (kept for backward compat) ──────────────────────────────
/** @deprecated Use SiteEmployee instead */
export interface Employee {
  id: string;
  name: string;
  role: string;
  department_id: string | null;
  email: string;
  phone: string;
  reports_to: string | null;
  hire_date: string;
  avatar_initials: string;
}

/** @deprecated Use PracticeArea instead */
export interface Department {
  id: string;
  name: string;
  head_id: string;
  color: string;
  budget_id: string;
}

// ── New multi-site org interfaces ──────────────────────────────────────────────

export interface SiteEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar_initials: string;
}

export interface SiteTeam {
  id: string;
  name: string;
  teamlead: SiteEmployee;
  members: SiteEmployee[];
}

export interface Site {
  id: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  flag: string;
  timezone: string;
  lat: number;
  lng: number;
  sitehead: SiteEmployee;
  staff_positions: SiteEmployee[];
  teams: SiteTeam[];
}

export interface GlobalTeam {
  id: string;
  name: string;
  scope: "global" | "regional";
  region: string | null;
  lead_site_id: string;
  lead_id: string;
  member_ids: string[];
}

export interface PracticeArea {
  id: string;
  name: string;
  color: string;
}

export interface FlatEmployee {
  id: string;
  name: string;
  role: string;
  site_id: string | null;
}

export interface OrgData {
  company: string;
  updated: string;
  itot_head: SiteEmployee & { location: string };
  sites: Site[];
  global_teams: GlobalTeam[];
  practice_areas: PracticeArea[];
  employees: FlatEmployee[];
}

// ── Project interfaces ─────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "completed" | "on-hold";
  priority: "high" | "medium" | "low";
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  project_lead_id: string;
  department_id: string;
  progress: number;
  tags: string[];
}

export interface ProjectsData {
  updated: string;
  projects: Project[];
}

// ── Finance interfaces ─────────────────────────────────────────────────────────

export interface FinanceDepartment {
  id: string;
  name: string;
  budget: number;
  spent: number;
  forecast: number;
  headcount: number;
}

export interface FinanceCategory {
  name: string;
  budget: number;
  spent: number;
}

export interface MonthlySpend {
  month: string;
  actual: number | null;
  forecast: number;
}

export interface FinancesData {
  year: number;
  updated: string;
  total_budget: number;
  total_spent: number;
  total_forecast: number;
  departments: FinanceDepartment[];
  categories: FinanceCategory[];
  monthly_spend: MonthlySpend[];
}

// ── Utility functions ──────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace(".", ",")} Mio. €`;
  }
  return `${amount.toLocaleString("de-DE")} €`;
}

export function formatCurrencyFull(amount: number): string {
  return `${amount.toLocaleString("de-DE")} €`;
}
