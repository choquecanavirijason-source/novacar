/**
 * Core · Auth · mockUsersStore
 * Directorio de usuarios persistido en localStorage — mientras no haya
 * backend real, esto reemplaza al endpoint `/auth/login` y `/auth/register`.
 * La contraseña se guarda tal cual (sin hash): es un mock local, nunca viaja
 * a ningún servidor. No usar este patrón si algún día esto habla con un API real.
 */

import type { AuthUser, UserRole } from "./types";

interface StoredUser extends AuthUser {
  password: string;
}

const STORAGE_KEY = "novacar.users";

const SEED: StoredUser[] = [
  {
    id: "1",
    name: "Admin NOVACAR",
    email: "admin@novacar.com",
    password: "demo",
    role: "admin",
  },
];

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return SEED;
  }
}

function writeUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function toAuthUser({ password: _password, ...user }: StoredUser): AuthUser {
  return user;
}

export function findUserByCredentials(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const found = readUsers().find((u) => u.email.toLowerCase() === normalized && u.password === password);
  return found ? toAuthUser(found) : null;
}

export function emailIsTaken(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return readUsers().some((u) => u.email.toLowerCase() === normalized);
}

export function createUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}): AuthUser {
  const users = readUsers();
  const user: StoredUser = {
    id: `usr-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    password: input.password,
    role: input.role ?? "customer",
  };
  writeUsers([...users, user]);
  return toAuthUser(user);
}

/** Lista todas las cuentas registradas (sin password) — para el panel admin. */
export function listUsers(): AuthUser[] {
  return readUsers().map(toAuthUser);
}

/** Cambia el rol de una cuenta. Devuelve el usuario actualizado, o null si no existe. */
export function updateUserRole(id: string, role: UserRole): AuthUser | null {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated: StoredUser = { ...users[index], role };
  const next = [...users];
  next[index] = updated;
  writeUsers(next);
  return toAuthUser(updated);
}

/** Elimina una cuenta del directorio. */
export function deleteUser(id: string): void {
  writeUsers(readUsers().filter((u) => u.id !== id));
}
