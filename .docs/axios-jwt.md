
# Axios + JWT + Refresh Token – Best Practices (TypeScript + Vue 3 + Pinia)

## 1. Używaj Axios Interceptorów

Zamiast ustawiać token globalnie (`axios.defaults.headers.common`), używaj interceptorów, które dynamicznie pobierają token ze store'a lub localStorage.

## 2. Obsługa 401 i Refresh Token

Gdy backend zwróci 401 Unauthorized, używaj kolejki (`failedQueue`), aby tylko jedno zapytanie wykonywało `/refresh-token`. Pozostałe poczekają, aż otrzyma nowy token.

## 3. Unikaj magicznych liczb – używaj `HttpStatusCode`

Zamiast:

if (error.response?.status === 401)

używaj:

import { HttpStatusCode } from 'axios';

if (error.response?.status === HttpStatusCode.Unauthorized) { ... }

## 4. Wyciągnij sprawdzanie błędów do helperów

import axios, { AxiosError, HttpStatusCode } from 'axios';

export function isUnauthorized(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Unauthorized
  );
}

export function isForbidden(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Forbidden
  );
}

## 5. Użycie helpera `isUnauthorized` w interceptorze

import { isUnauthorized } from '@/utils/http';

if (isUnauthorized(error) && !originalRequest._retry) {
  // logika odświeżania tokena
}

## 6. Kolejka `failedQueue` do obsługi wielu 401 jednocześnie

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

## 7. Dodawanie tokena w request interceptorze

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${auth.token}`,
    };
  }
  return config;
});


