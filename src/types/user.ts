export interface User {
  token: string;
  perimetre: string;
  code_postal: string;
  permissions: { id: number; name: string; grade: number }[];
  role: string;
  indispo: string | null;
}
