export const DI_TOKENS = {
  HttpClient: Symbol("HttpClient"),
  HttpInterceptors: Symbol("HttpInterceptors"),

  Router: Symbol("Router"),
  RouteGuards: Symbol("RouteGuards"),

  StorageService: Symbol("StorageService"),
  AuthService: Symbol("AuthService"),
  NotificationService: Symbol("NotificationService"),
  EmailService: Symbol("EmailService"),
  LoggerService: Symbol("LoggerService"),
} as const;
