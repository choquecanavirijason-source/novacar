/**
 * Core · createApiClient
 * Factory del cliente HTTP hacia el backend Laravel.
 */

import { FetchHttpClient } from "./HttpClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export function createApiClient(token?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return new FetchHttpClient(API_URL, headers);
}

export function getApiBaseUrl(): string {
  return API_URL;
}