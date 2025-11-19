export interface JwtPayload {
  uuid: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

export class JwtUtils {
  static decode(token: string): JwtPayload | undefined {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return undefined;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return undefined;
    }
  }

  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
  }

  static getUuid(token: string): string | undefined {
    const payload = this.decode(token);
    return payload?.uuid || undefined;
  }

  static getEmail(token: string): string | undefined {
    const payload = this.decode(token);
    return payload?.email || undefined;
  }

  static getRoles(token: string): string[] {
    const payload = this.decode(token);
    return payload?.roles || [];
  }
}
