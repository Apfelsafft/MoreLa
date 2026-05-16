import { readFileSync } from "fs";
import { join } from "path";
export type {
  Employee,
  Department,
  SiteEmployee,
  SiteTeam,
  Site,
  GlobalTeam,
  PracticeArea,
  FlatEmployee,
  OrgData,
  Project,
  ProjectsData,
  FinanceDepartment,
  FinanceCategory,
  MonthlySpend,
  FinancesData,
} from "./types";
export { formatCurrency, formatCurrencyFull } from "./types";
import type { OrgData, ProjectsData, FinancesData } from "./types";

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
