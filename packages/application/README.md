# @kennelo/application

Package définissant les **contrats d'interface** (ports) de l'application selon les principes de Clean Architecture.

## 📦 Rôle

Ce package contient **uniquement des interfaces** qui définissent les comportements attendus par l'application, sans aucune implémentation concrète. Il représente la couche **Application** dans la Clean Architecture.

## 🏗️ Structure

```
application/
└── ports/
    ├── http/                    # Interfaces HTTP
    │   ├── http-client.interface.ts
    │   └── interceptor.interface.ts
    │
    ├── repositories/            # Interfaces Repository Pattern
    │   ├── base-repository.interface.ts
    │   └── user-repository.interface.ts
    │
    ├── routing/                 # Interfaces de routage
    │   ├── router.interface.ts
    │   └── route-guard.interface.ts
    │
    └── services/                # Interfaces de services
        ├── auth-service.interface.ts
        ├── storage-service.interface.ts
        ├── logger-service.interface.ts
        ├── notification-service.interface.ts
        └── email-service.interface.ts
```

## 🎯 Conventions de Nommage

| Type                  | Convention                  | Exemple                        |
| --------------------- | --------------------------- | ------------------------------ |
| **Interfaces**        | `*.interface.ts`            | `http-client.interface.ts`     |
| **Repository**        | `*-repository.interface.ts` | `user-repository.interface.ts` |
| **Service**           | `*-service.interface.ts`    | `auth-service.interface.ts`    |
| **Types d'interface** | PascalCase                  | `HttpClient`, `AuthService`    |

## 📝 Principes

### 1. **Aucune implémentation**

Les interfaces définissent **quoi faire**, pas **comment le faire**.

### 2. **Indépendance technologique**

Pas de dépendances à des frameworks externes (Axios, Fetch, Next.js, etc.).

### 3. **Contrats stables**

Les interfaces changent rarement. Les implémentations peuvent varier.

## 🔌 Types de Ports

### **HTTP**

Contrats pour les clients HTTP et intercepteurs.

```typescript
interface HttpClient {
  get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(path: string, body?: any): Promise<ApiResponse<T>>;
  addInterceptor(interceptor: Interceptor): void;
}
```

### **Repositories**

Pattern Repository pour l'accès aux données.

```typescript
interface BaseRepository<T> {
  findById(id: string): Promise<T | undefined>;
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<T>>;
  save(entity: T): Promise<void>;
  update(id: string, entity: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### **Services**

Services métier de l'application.

```typescript
interface AuthService {
  login(email: string, password: string): Promise<string | undefined>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}
```

### **Routing**

Abstraction du système de routage.

```typescript
interface Router {
  push(params: string | RouteParams): Promise<boolean>;
  getCurrentRoute(): RouteInfo;
  addGuard(guard: RouteGuard): void;
}
```

## 💡 Utilisation

### Dans l'infrastructure (implémentations)

```typescript
// infrastructure/adapters/http/axios-client.ts
import { HttpClient } from "@kennelo/application/ports/http/http-client.interface";

export class AxiosClient implements HttpClient {
  // Implémentation concrète avec Axios
}
```

### Dans la présentation (injection)

```typescript
// presentation/hooks/use-http-client.tsx
import { HttpClient } from "@kennelo/application/ports/http/http-client.interface";

export function useHttpClient(): HttpClient {
  return container.resolve<HttpClient>(DI_TOKENS.HttpClient);
}
```

## 🚀 Ajouter un Nouveau Port

1. Créer l'interface dans le bon dossier :

```typescript
// application/ports/services/payment-service.interface.ts
export interface PaymentService {
  processPayment(amount: number): Promise<boolean>;
}
```

2. Implémenter dans l'infrastructure :

```typescript
// infrastructure/adapters/services/stripe-payment.service.ts
export class StripePaymentService implements PaymentService {
  async processPayment(amount: number): Promise<boolean> {
    // Implémentation Stripe
  }
}
```

3. Enregistrer dans le container :

```typescript
.withService(DI_TOKENS.PaymentService, new StripePaymentService())
```

## ✅ Bonnes Pratiques

- ✅ Nommer les interfaces selon leur rôle métier
- ✅ Garder les interfaces simples et focalisées
- ✅ Documenter les comportements attendus
- ✅ Utiliser des types de retour explicites
- ✅ Éviter les dépendances externes

## ❌ À Éviter

- ❌ Importer des frameworks (Axios, Next.js, React)
- ❌ Mettre des implémentations concrètes
- ❌ Créer des interfaces trop complexes
- ❌ Dépendre du package `infrastructure`

## 🔗 Relations avec les Autres Packages

```
domain          ←  application (utilise les entités)
application     →  (défini les ports)
infrastructure  →  application (implémente les ports)
presentation    →  application (utilise les ports via DI)
```
