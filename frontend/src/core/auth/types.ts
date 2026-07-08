/**
 * Core · Auth · tipos
 */

export type UserRole = "admin" | "operator";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}