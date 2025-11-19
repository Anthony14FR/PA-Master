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

  I18nService: Symbol("I18nService"),

  LinkComponent: Symbol("LinkComponent"),
} as const;
