import { readFileSync } from "fs";
import { join } from "path";

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

export interface Department {
  id: string;
  name: string;
  head_id: string;
  color: string;
  budget_id: string;
}

export interface OrgData {
  company: string;
  updated: string;
  departments: Department[];
  employees: Employee[];
}

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

export function getOrgData(): OrgData {
  const raw = readFileSync(join(process.cwd(), "data/org.json"), "utf8");
  return JSON.parse(raw) as OrgData;
}

export function getProjectsData(): ProjectsData {
  const raw = readFileSync(join(process.cwd(), "data/projects.json"), "utf8");
  return JSON.parse(raw) as ProjectsData;
}

export function getFinancesData(): FinancesData {
  const raw = readFileSync(join(process.cwd(), "data/finances.json"), "utf8");
  return JSON.parse(raw) as FinancesData;
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace(".", ",")} Mio. €`;
  }
  return `${amount.toLocaleString("de-DE")} €`;
}

export function formatCurrencyFull(amount: number): string {
  return `${amount.toLocaleString("de-DE")} €`;
}
