# @kennelo/infrastructure

Package contenant les **implémentations concrètes** des ports définis dans `@kennelo/application` et le système d'**injection de dépendances**.

## 📦 Rôle

Ce package fournit toutes les implémentations techniques (adapters) et le système de DI pour configurer l'application selon les besoins de chaque environnement (web, mobile, etc.).

## 🏗️ Structure

```
infrastructure/
├── adapters/                    # Implémentations des ports
│   ├── http/                    # Clients HTTP
│   │   ├── axios-client.ts
│   │   ├── fetch-client.ts
│   │   └── auth.interceptor.ts
│   │
│   ├── repositories/            # Repositories API
│   │   ├── base-api.repository.ts
│   │   ├── api-user.repository.ts
│   │   └── api-category.repository.ts
│   │
│   └── services/                # Implémentations services
│       ├── api-auth.service.ts
│       ├── email/
│       │   └── console-email.service.ts
│       ├── logger/
│       │   └── console-logger.service.ts
│       ├── notification/
│       │   ├── email-notification.service.ts
│       │   └── capacitor-notification.service.ts
│       ├── routing/
│       │   ├── nextjs.router.ts
│       │   ├── react.router.ts
│       │   └── guards/
│       │       ├── auth.guard.ts
│       │       └── role.guard.ts
│       └── storage/
│           ├── local-storage.service.ts
│           ├── session-storage.service.ts
│           ├── cookie-storage.service.ts
│           └── capacitor-storage.service.ts
│
├── di/                          # Système d'injection de dépendances
│   ├── container.ts             # Container DI principal
│   ├── config-builder.ts        # Builder pattern pour configuration
│   └── tokens.ts                # Tokens typés pour DI
│
├── config/                      # Configurations
│   └── router.config.ts
│
└── utils/                       # Utilitaires
    └── jwt.utils.ts
```

## 🎯 Conventions de Nommage

| Type             | Convention                    | Exemple                                  |
| ---------------- | ----------------------------- | ---------------------------------------- |
| **Adapters**     | `*-client.ts`, `*.service.ts` | `axios-client.ts`, `api-auth.service.ts` |
| **Guards**       | `*.guard.ts`                  | `auth.guard.ts`, `role.guard.ts`         |
| **Interceptors** | `*.interceptor.ts`            | `auth.interceptor.ts`                    |
| **Utils**        | `*.utils.ts`                  | `jwt.utils.ts`                           |
| **Classes**      | PascalCase                    | `AxiosClient`, `AuthGuard`               |

## � Types d'Adapters

### **HTTP Clients**

Implémentations de `HttpClient` avec Axios ou Fetch.

```typescript
// infrastructure/adapters/http/axios-client.ts
export class AxiosClient implements HttpClient {
  async get<T>(path: string, params?: any): Promise<ApiResponse<T>> {
    const response = await axios.get(path, { params });
    return response.data;
  }
}
```

### **Repositories**

Implémentations des repositories utilisant l'API REST.

```typescript
// infrastructure/adapters/repositories/api-user.repository.ts
export class ApiUserRepository
  extends BaseApiRepository<User>
  implements UserRepository
{
  constructor(httpClient: HttpClient) {
    super(httpClient, "/users");
  }
}
```

### **Services**

Différentes implémentations selon l'environnement.

| Service          | Web                        | Mobile                         | Test                         |
| ---------------- | -------------------------- | ------------------------------ | ---------------------------- |
| **Storage**      | `LocalStorageService`      | `CapacitorStorageService`      | `InMemoryStorageService`     |
| **Notification** | `EmailNotificationService` | `CapacitorNotificationService` | `ConsoleNotificationService` |
| **Router**       | `NextJsRouter`             | `ReactNativeRouter`            | `MockRouter`                 |

### **Guards**

Protections de routes avec système de priorités.

```typescript
// infrastructure/adapters/services/routing/guards/auth.guard.ts
export class AuthGuard implements RouteGuard {
  priority = 50; // Exécuté en premier

  async canNavigate(to: RouteInfo): Promise<GuardResult> {
    const isAuth = await this.authService.isAuthenticated();
    return isAuth
      ? { allowed: true }
      : { allowed: false, redirectTo: "/login" };
  }
}
```

## 🛠️ Système d'Injection de Dépendances

### **Container**

Registre central pour enregistrer et résoudre les dépendances.

```typescript
// infrastructure/di/container.ts
export class AppContainer {
  register<T>(token: symbol, instance: T): void;
  resolve<T>(token: symbol): T;
  has(token: symbol): boolean;
}
```

### **Config Builder**

API fluide pour configurer le container.

```typescript
// apps/web/config/container.config.ts
export function createWebContainer(): AppContainer {
  return new AppConfigBuilder()
    .withService(DI_TOKENS.HttpClient, new AxiosClient())
    .withService(DI_TOKENS.StorageService, new LocalStorageService())
    .withService(DI_TOKENS.Router, new NextJsRouter())
    .withGuards([
        new AuthGuard(
            authService,
            ["/s/admin", "/s/app", "/s/my"],
            "/s/account/login"
        ),
        new RoleGuard(
            authService,
            [
                { path: "/s/admin", roles: ["admin"] },
                { path: "/s/app", roles: ["admin", "manager"] },
                { path: "/s/my", roles: ["admin", "manager", "user"] },
            ],
            "/forbidden"
        ),
    ])
    .withInterceptors([new AuthInterceptor(storageService)])
    .build();
}
```

### **Tokens**

Identifiants typés pour le DI (évite les strings magiques).

```typescript
// infrastructure/di/tokens.ts
export const DI_TOKENS = {
  HttpClient: Symbol.for("HttpClient"),
  Router: Symbol.for("Router"),
  StorageService: Symbol.for("StorageService"),
  AuthService: Symbol.for("AuthService"),
  RouteGuards: Symbol.for("RouteGuards"),
  LinkComponent: Symbol.for("LinkComponent"),
  // ...
} as const;
```

## 💡 Utilisation

### 1. Créer la Configuration Container

```typescript
// apps/web/config/container.config.ts
import { AppConfigBuilder } from "@kennelo/infrastructure/di/config-builder";
import { AxiosClient } from "@kennelo/infrastructure/adapters/http/axios-client";

export function createWebContainer() {
  return new AppConfigBuilder()
    .withService(DI_TOKENS.HttpClient, new AxiosClient())
    .build();
}
```

### 2. Initialiser dans l'Application

```typescript
// apps/web/app/layout.tsx
const container = createWebContainer();

export default function RootLayout({ children }) {
  return <AppProvider container={container}>{children}</AppProvider>;
}
```

### 3. Utiliser dans la Présentation

```typescript
// presentation/hooks/use-http-client.tsx
export function useHttpClient(): HttpClient {
  const { container } = useAppContainer();
  return container.resolve<HttpClient>(DI_TOKENS.HttpClient);
}
```

## 🚀 Ajouter un Nouvel Adapter

### 1. Créer l'implémentation

```typescript
// infrastructure/adapters/services/sms-notification.service.ts
import { NotificationService } from "@kennelo/application/ports/services/notification-service.interface";

export class SmsNotificationService implements NotificationService {
  async send(message: string): Promise<void> {
    // Implémentation SMS (Twilio, AWS SNS, etc.)
  }
}
```

### 2. Ajouter un token (optionnel)

```typescript
// infrastructure/di/tokens.ts
export const DI_TOKENS = {
  // ...existants
  SmsService: Symbol.for("SmsService"),
} as const;
```

### 3. Enregistrer dans le container

```typescript
.withService(DI_TOKENS.SmsService, new SmsNotificationService())
```

## ✅ Bonnes Pratiques

### Adapters

- ✅ Implémenter exactement l'interface du port
- ✅ Gérer les erreurs spécifiques au framework
- ✅ Logger les opérations importantes
- ✅ Un adapter = une responsabilité

### DI Container

- ✅ Utiliser les tokens typés (pas de strings)
- ✅ Enregistrer les services au démarrage
- ✅ Résoudre les dépendances via hooks/context
- ✅ Un container par application

### Guards

- ✅ Définir des priorités claires (0-100)
- ✅ Retourner `GuardResult` avec `redirectTo`
- ✅ Garder la logique simple et testable
- ✅ Ne pas dépendre d'autres guards

## ❌ À Éviter

- ❌ Importer des adapters directement dans la présentation
- ❌ Créer des dépendances circulaires entre adapters
- ❌ Mélanger logique métier et implémentation technique
- ❌ Utiliser des strings à la place des tokens
- ❌ Résoudre les services en dehors du context React

## 🔗 Relations avec les Autres Packages

```
domain          ←── infrastructure (utilise les entités)
application     ←── infrastructure (implémente les ports)
infrastructure  ──→ (fournit les adapters)
presentation    ──→ infrastructure (utilise le DI)
apps/*          ──→ infrastructure (configure le container)
```