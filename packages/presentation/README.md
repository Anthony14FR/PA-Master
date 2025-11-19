# @kennelo/presentation

Package contenant la **couche présentation** organisée en **Feature-Based Architecture** avec composants React, hooks et ViewModels.

## 📦 Rôle

Gère l'UI et les interactions utilisateur de manière framework-agnostic grâce au système DI. Organisé par fonctionnalités métier.

## 🏗️ Structure

```
presentation/
├── features/                    # Features métier (vertical slices)
│   ├── auth/
│   │   ├── core/               # Logique indépendante du framework
│   │   │   └── view-models/
│   │   └── react/              # Implémentation React
│   │       ├── hooks/
│   │       ├── views/
│   │       └── contexts/
│   │
│   ├── users/
│   │   ├── core/
│   │   └── react/
│   │
│   └── booking/
│       ├── core/
│       └── react/
│
└── shared/                      # Code partagé entre features
    ├── components/              # Composants réutilisables
    │   ├── app-link.component.tsx
    │   ├── protected-route.component.tsx
    │   └── layouts/
    │
    ├── hooks/                   # Hooks partagés
    │   ├── use-services.hook.tsx
    │   └── use-route-guards.hook.tsx
    │
    ├── contexts/                # Contexts globaux
    │   └── app-container.context.tsx
    │
    ├── adapters/                # Adapters framework
    │   └── link.adapter.tsx
    │
    └── types/                   # Types partagés
        └── view-state.types.ts
```

## 🎯 Conventions

| Type          | Emplacement           | Exemple               |
| ------------- | --------------------- | --------------------- |
| **Feature**   | `features/{feature}/` | `features/auth/`      |
| **Hook**      | `use-*.tsx`           | `use-auth.tsx`        |
| **View**      | `*.view.tsx`          | `login.view.tsx`      |
| **Component** | `*.tsx`               | `protected-route.tsx` |
| **ViewModel** | `*.view-model.ts`     | `user.view-model.ts`  |

## 📝 Organisation Feature-Based

Chaque feature contient tout ce dont elle a besoin :

### **Structure d'une Feature**

```
features/auth/
├── core/                        # Framework-agnostic
│   └── view-models/
│       └── user.view-model.ts
│
└── react/                       # React-specific
    ├── hooks/
    │   └── use-auth.tsx
    ├── views/
    │   ├── login.view.tsx
    │   └── register.view.tsx
    └── contexts/
        └── auth.context.tsx
```

### **Exemple : Hook Feature**

```typescript
// features/auth/react/hooks/use-auth.tsx
import { useAuthService } from "../../../../shared/hooks/use-services";

export function useAuth() {
  const authService = useAuthService();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const token = await authService.login(email, password);
    setIsLoading(false);
    return token;
  };

  return { login, isLoading };
}
```

### **Exemple : View Feature**

```typescript
// features/auth/react/views/login.view.tsx
import { useAuth } from "../hooks/use-auth";

export function LoginView() {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    const token = await login(email, password);
    if (token) router.push("/dashboard");
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🔌 Shared : Code Partagé

### **Hooks pour Services**

Accès aux services via DI container.

```typescript
// shared/hooks/use-services.tsx
export function useAuthService(): AuthService {
  const container = useAppContainer();
  return container.resolve<AuthService>(DI_TOKENS.AuthService);
}

export function useHttpClient(): HttpClient {
  const container = useAppContainer();
  return container.resolve<HttpClient>(DI_TOKENS.HttpClient);
}
```

### **Composants Globaux**

#### **ProtectedRoute**

Protection de routes avec guards automatiques.

```typescript
// shared/components/protected-route.tsx
<ProtectedRoute fallback={<LoginView />}>
  <AdminDashboard />
</ProtectedRoute>
```

#### **AppLink**

Liens framework-agnostic via adapter.

```typescript
// shared/components/app-link.component.tsx
<AppLink href="/dashboard" className="nav-link">
  Dashboard
</AppLink>
```

### **Contexts**

```typescript
// shared/contexts/app-container.context.tsx
export function AppProvider({ container, children }) {
  return (
    <AppContainerContext.Provider value={container}>
      {children}
    </AppContainerContext.Provider>
  );
}
```

## 💡 Utilisation

### 1. Initialiser le Container

```typescript
// apps/web/app/layout.tsx
import { createWebContainer } from "../config/container.config";
import { AppProvider } from "@kennelo/presentation/shared/contexts/app-container.context";

const container = createWebContainer();

export default function RootLayout({ children }) {
  return <AppProvider container={container}>{children}</AppProvider>;
}
```

### 2. Utiliser dans une Feature

```typescript
// features/users/react/hooks/use-users.tsx
import { useHttpClient } from "../../../../shared/hooks/use-services";

export function useUsers() {
  const httpClient = useHttpClient();

  const fetchUsers = async () => {
    const response = await httpClient.get("/users");
    return response.data;
  };

  return { fetchUsers };
}
```

## ✅ Bonnes Pratiques

### Features

- ✅ Une feature = un dossier autonome
- ✅ `core/` pour logique framework-agnostic
- ✅ `react/` pour implémentation React
- ✅ Hooks feature-specific dans la feature

### Shared

- ✅ Uniquement du code réutilisé par 2+ features
- ✅ Hooks d'accès aux services centralisés
- ✅ Composants UI génériques (Button, Modal, etc.)

### Hooks

- ✅ Préfixe `use-` obligatoire
- ✅ Résoudre les services via container
- ✅ Gérer loading/error states
- ✅ Un hook = une responsabilité

## ❌ À Éviter

- ❌ Importer directement des adapters infrastructure
- ❌ Dépendre d'une feature depuis une autre
- ❌ Mettre tout dans `shared/` (créer des features)
- ❌ Appeler `container.resolve()` directement dans les composants

## 🚀 Ajouter une Nouvelle Feature

```bash
presentation/features/products/
├── core/
│   └── view-models/
│       └── product.view-model.ts
└── react/
    ├── hooks/
    │   └── use-products.hook.tsx
    └── views/
        ├── product-list.view.tsx
        └── product-detail.view.tsx
```

```typescript
// features/products/core/view-models/product.view-model.ts
export class ProductViewModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly formattedPrice: string,
    public readonly isAvailable: boolean
  ) {}

  static fromEntity(entity: ProductEntity): ProductViewModel {
    return new ProductViewModel(
      entity.uuid,
      entity.name,
      `${entity.price.toFixed(2)} €`,
      entity.stock > 0
    );
  }
}
```

```typescript
// features/products/react/hooks/use-products.tsx
export function useProducts() {
  const httpClient = useHttpClient();

  const fetchProducts = async (): ProductViewModel => {
    const res = await httpClient.get("/products");
    return ProductViewModel.fromEntity(res.data);
  };

  return { fetchProducts };
}
```

### Avec Repository Pattern

Utilisation de `useRepository` et `useAsyncState` dans une feature avec dépendances multiples :

```typescript
// features/products/react/hooks/use-products.tsx
import { useRepository } from "../../../../shared/hooks/use-repository";
import { useAsyncState } from "../../../../shared/hooks/use-async-state";
import { PaginatedViewModel } from "../../../../shared/view-models/paginated.view-model";
import { ProductRepository } from "@kennelo/infrastructure/adapters/repositories/api-product.repository";
import { DI_TOKENS } from "@kennelo/infrastructure/di/tokens";
import { ProductEntity } from "@kennelo/domain/entities/product.entity";
import { ProductViewModel } from "../../core/view-models/product.view-model";

export function useProducts() {
  const repository = useRepository(ProductRepository, [
    DI_TOKENS.HttpClient,
    DI_TOKENS.LoggerService,
  ]);

  const { execute, isLoading, error } = useAsyncState();

  const findById = async (
    id: string
  ): Promise<ProductViewModel | undefined> => {
    const result = await execute(() => repository.findById(id));
    if (!result) return undefined;
    return ProductViewModel.fromEntity(result);
  };

  const findAll = async (
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResult<ProductViewModel> | undefined> => {
    const result = await execute(() => repository.findAll(page, pageSize));
    if (!result) return undefined;
    return PaginatedViewModel.map(result, ProductViewModel.fromEntity);
  };

  const save = async (product: ProductEntity): Promise<boolean> => {
    const result = await execute(() => repository.save(product));
    return result !== undefined;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const result = await execute(() => repository.delete(id));
    return result !== undefined;
  };

  return { findById, findAll, save, deleteProduct, isLoading, error };
}
```

**Avantages** :

- ✅ Chaque repository peut avoir ses propres dépendances
- ✅ Pas besoin d'enregistrer chaque repository dans le DI
- ✅ Instance mise en cache via `useMemo`
- ✅ Flexibilité totale sur les dépendances
- ✅ Type-safe avec génériques

### Utilisation dans un Composant

```typescript
// features/products/react/views/product-list.view.tsx
import { useEffect, useState } from "react";
import { useProducts } from "../hooks/use-products";
import { ProductViewModel } from "../../core/view-models/product.view-model";

export function ProductListView() {
  const { findAll, deleteProduct, isLoading, error } = useProducts();
  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    const result = await findAll(page, 10);
    if (result) {
      setProducts(result.items);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteProduct(id);
    if (success) {
      await loadProducts(); // Recharger la liste
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <span>{product.formattedPrice}</span>
            <button onClick={() => handleDelete(product.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Précédent
      </button>
      <button onClick={() => setPage(page + 1)}>Suivant</button>
    </div>
  );
}
```

**Points clés** :

- ✅ Hook feature isolé (`useProducts`)
- ✅ Gestion automatique des états (`isLoading`, `error`)
- ✅ Pas de logique métier dans le composant
- ✅ ViewModels pour l'affichage (`formattedPrice`)
- ✅ Réutilisable dans d'autres composants

## 🔗 Relations

```
domain          ←  presentation (utilise les entités)
application     ←  presentation (utilise les ports)
infrastructure  ←  presentation (via DI uniquement)
presentation    →  (fournit l'UI)
apps/\*         →  presentation (consomme features/shared)
```
