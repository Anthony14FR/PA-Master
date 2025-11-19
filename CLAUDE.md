# Context du Projet Kennelo - Clean Architecture

## 🎯 Vue d'ensemble

Projet **Clean Architecture** en **TypeScript** organisé en **monorepo npm workspaces** avec 4 couches :
- `@kennelo/domain` - Entités métier, Value Objects, erreurs
- `@kennelo/application` - Ports (interfaces)
- `@kennelo/infrastructure` - Adapters (implémentations) + DI Container
- `@kennelo/presentation` - UI Feature-Based + hooks React

## 🏗️ Architecture Clés

### 1. Dependency Injection (DI)
```typescript
// Container + Builder pattern
const container = new AppConfigBuilder()
  .withService(DI_TOKENS.HttpClient, new AxiosClient())
  .withService(DI_TOKENS.StorageService, new LocalStorageService())
  .withGuards([new AuthGuard(...)])
  .build();
```

**Règles** :
- ✅ Utiliser **tokens** (Symbol) pour services ayant plusieurs implémentations
- ✅ Utiliser **classes directes** pour services uniques
- ❌ Ne JAMAIS importer des adapters directement dans presentation

### 2. Presentation Layer - Feature-Based

```
features/[feature]/
├── core/              # Framework-agnostic (ViewModels, mappers)
└── react/             # React-specific (hooks, views, contexts)
```

**Hooks patterns existants** :
```typescript
// 1. Accès aux services via DI
const httpClient = useHttpClient();
const authService = useAuthService();

// 2. Repositories avec dépendances multiples
const repository = useRepository(ProductRepository, [
  DI_TOKENS.HttpClient,
  DI_TOKENS.LoggerService
]);

// 3. Gestion async (loading/error)
const { execute, isLoading, error } = useAsyncState();
const result = await execute(() => repository.findById(id));

// 4. Mapping Entity → ViewModel
return result ? ProductViewModel.fromEntity(result) : undefined;

// 5. Pagination
return PaginatedViewModel.map(result, ProductViewModel.fromEntity);
```

### 3. Conventions de Nommage

| Type | Pattern | Exemple |
|------|---------|---------|
| **Entity** | `.entity.ts` | `user.entity.ts` |
| **Value Object** | `.value.ts` | `email.value.ts` |
| **Port (interface)** | `.interface.ts` | `http-client.interface.ts` |
| **Adapter** | `.ts` (impl name) | `axios-client.ts` |
| **Repository** | `api-*.repository.ts` | `api-user.repository.ts` |
| **Guard** | `.guard.ts` | `auth.guard.ts` |
| **Hook** | `use-*.tsx` | `use-products.tsx` |
| **View** | `.view.tsx` | `login.view.tsx` |
| **Component** | `.tsx` ou `.component.tsx` | `app-link.component.tsx` |
| **ViewModel** | `.view-model.ts` | `product.view-model.ts` |

## 🚫 Anti-Patterns à ÉVITER

### ❌ Sur-Engineering
```typescript
// ❌ NE PAS créer des abstractions inutiles
class ProductService extends BaseService<Product> extends CrudService {}

// ✅ Garder simple
const repository = useRepository(ProductRepository, [DI_TOKENS.HttpClient]);
```

### ❌ Dépendances directes dans presentation
```typescript
// ❌ JAMAIS ça
import { AxiosClient } from '@kennelo/infrastructure/adapters/http/axios-client';

// ✅ Toujours via DI
const httpClient = useHttpClient(); // Résout depuis le container
```

### ❌ Spread du repository
```typescript
// ❌ Éviter
return { ...repository };

// ✅ Encapsuler avec logique UI
return { findById, findAll, isLoading, error };
```

### ❌ Factory functions instables
```typescript
// ❌ Re-création à chaque render
const repo = useRepositoryFactory((c) => new Repo(c.resolve(...)));

// ✅ Utiliser useRepository simple
const repo = useRepository(ProductRepository, [DI_TOKENS.HttpClient]);
```

## ✅ Patterns à UTILISER

### Domain Layer
```typescript
// Entité avec factory method
export class UserEntity {
  private constructor(public uuid: string, public email: Email) {}
  
  static from(data: { uuid: string; email: Email }) {
    return new UserEntity(data.uuid, data.email);
  }
}

// Value Object avec validation
export class Email {
  private constructor(public readonly value: string) {}
  
  static create(email: string) {
    if (!/.+@.+\..+/.test(email)) {
      return new EmailInvalidError(email);
    }
    return new Email(email);
  }
}
```

### Application Layer (Ports)
```typescript
// Interface pure, aucune implémentation
export interface HttpClient {
  get<T>(path: string, params?: any): Promise<ApiResponse<T>>;
  post<T>(path: string, body?: any): Promise<ApiResponse<T>>;
}
```

### Infrastructure Layer
```typescript
// Adapter implémentant le port
export class AxiosClient implements HttpClient {
  async get<T>(path: string, params?: any) {
    const response = await axios.get(path, { params });
    return response.data;
  }
}

// Repository pattern
export class ApiUserRepository extends BaseApiRepository<User> {
  constructor(httpClient: HttpClient) {
    super(httpClient, '/users');
  }
}
```

### Presentation Layer - Hook Feature
```typescript
export function useProducts() {
  // 1. Récupérer le repository
  const repository = useRepository(ProductRepository, [
    DI_TOKENS.HttpClient,
    DI_TOKENS.LoggerService
  ]);

  // 2. Gérer l'état async
  const { execute, isLoading, error } = useAsyncState();

  // 3. Encapsuler les méthodes avec mapping
  const findById = async (id: string) => {
    const result = await execute(() => repository.findById(id));
    return result ? ProductViewModel.fromEntity(result) : undefined;
  };

  const findAll = async (page?: number, pageSize?: number) => {
    const result = await execute(() => repository.findAll(page, pageSize));
    if (!result) return undefined;
    return PaginatedViewModel.map(result, ProductViewModel.fromEntity);
  };

  // 4. Exposer seulement ce qui est nécessaire
  return { findById, findAll, isLoading, error };
}
```

## 🎯 Principes de Développement

1. **KISS (Keep It Simple)** - Pas de sur-abstraction
2. **Réutiliser l'existant** - Hooks partagés (`useAsyncState`, `useRepository`, etc.)
3. **DI pour tout** - Jamais d'imports directs d'adapters
4. **Feature-Based** - Chaque feature est autonome
5. **ViewModels** - Toujours mapper Entity → ViewModel dans les hooks
6. **Type-safe** - Exploiter TypeScript au maximum
7. **Clean Architecture** - Respecter la séparation des couches

## 📚 Hooks Partagés Disponibles

| Hook | Usage | Fichier |
|------|-------|---------|
| `useHttpClient()` | Accès HttpClient | `use-services.hook.tsx` |
| `useAuthService()` | Accès AuthService | `use-services.hook.tsx` |
| `useStorage()` | Accès StorageService | `use-services.hook.tsx` |
| `useRouter()` | Accès Router | `use-services.hook.tsx` |
| `useRepository(Class, tokens)` | Instancier repositories | `use-repository.tsx` |
| `useAsyncState()` | Gérer loading/error | `use-async-state.tsx` |
| `useAppContainer()` | Accès container DI | `app-container.context.tsx` |

## 🧩 Composants Globaux

| Composant | Usage |
|-----------|-------|
| `<ProtectedRoute>` | Protection de routes avec guards |
| `<AppLink>` | Liens framework-agnostic |
| `<AppProvider>` | Injecter le container DI |

## 💡 Quand Créer Quoi ?

**Nouvelle feature** → `presentation/features/[feature]/`
- `core/view-models/` - ViewModels
- `react/hooks/` - Hooks métier
- `react/views/` - Composants pages

**Nouveau service** → Ajouter port + adapter
1. Port dans `application/ports/services/`
2. Adapter dans `infrastructure/adapters/services/`
3. Token dans `infrastructure/di/tokens.ts`
4. Hook dans `presentation/shared/hooks/use-services.hook.tsx`

**Nouveau repository** → Utiliser pattern existant
1. Interface dans `application/ports/repositories/`
2. Implémentation dans `infrastructure/adapters/repositories/`
3. Utiliser avec `useRepository()`

**Code réutilisable entre features** → `presentation/shared/`

## ⚡ Performance

- `useMemo` pour les repositories
- `useCallback` pour les fonctions stables
- `useAsyncState` pour éviter la duplication loading/error
- Pas de re-création inutile d'instances

---

**En résumé** : Réutilise au maximum l'existant, garde la simplicité, respecte les patterns établis, utilise le DI pour tout.
