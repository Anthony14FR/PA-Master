const protectedPaths = [
  "/dashboard",
  "/profile",
  "/settings",
  "/s/app",
  "/s/my",
];

const roleConfigs = [
  { path: "/s/admin", roles: ["admin"] },
  { path: "/dashboard/analytics", roles: ["admin", "analyst"] },
];