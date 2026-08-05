/**
 * Core · Auth · tipos
 */

export type UserRole = "admin" | "operator" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}