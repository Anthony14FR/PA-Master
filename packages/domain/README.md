# @kennelo/domain

Package contenant la **logique métier** de l'application, indépendante de toute technologie.

## 📦 Rôle

Le domaine représente le **cœur de l'application** : entités, règles métier, validations. Aucune dépendance externe.

## 🏗️ Structure

```
domain/
├── entities/              # Entités métier
│   ├── user.entity.ts
│   └── category.entity.ts
│
├── values/                # Value Objects
│   ├── email.value.ts
│   └── password.value.ts
│
└── errors/                # Erreurs métier
    ├── email-invalid.error.ts
    └── password-too-short.error.ts
```

## 🎯 Conventions

| Type | Suffix | Exemple |
|------|--------|---------|
| **Entité** | `.entity.ts` | `user.entity.ts` |
| **Value Object** | `.value.ts` | `email.value.ts` |
| **Erreur** | `.error.ts` | `email-invalid.error.ts` |

## 📝 Concepts

### **Entités**
Objets avec identité unique et cycle de vie.

```typescript
// domain/entities/user.entity.ts
export class UserEntity {
  private constructor(
    public uuid: string,
    public email: Email,
    public name: string,
    public roles: string[] = []
  ) {}

  static from(data: { uuid: string; email: Email; name: string }) {
    return new UserEntity(data.uuid, data.email, data.name);
  }
}
```

### **Value Objects**
Objets immuables définis par leurs valeurs avec validation.

```typescript
// domain/values/email.value.ts
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

### **Erreurs Métier**
Erreurs spécifiques au domaine.

```typescript
// domain/errors/email-invalid.error.ts
export class EmailInvalidError extends Error {
  constructor(public readonly email: string) {
    super();
    this.name = "EmailInvalidError";
  }
}
```

## ✅ Bonnes Pratiques

- ✅ Constructeurs privés, factory methods publics
- ✅ Value Objects immuables (`readonly`)
- ✅ Validation dans le domaine
- ✅ Pas de dépendances externes

## ❌ À Éviter

- ❌ Importer Axios, React, Next.js
- ❌ Logique d'accès aux données (repositories)
- ❌ Logique de présentation (UI)

## 🔗 Relations

```
domain          ──→ (pur, aucune dépendance)
application     ──→ domain (utilise les entités)
infrastructure  ──→ domain (manipule les entités)
```
