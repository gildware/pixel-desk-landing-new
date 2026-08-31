type SessionLike = {
  data?: {
    isGlobalSuperAdmin?: boolean;
    user?: { isGlobalSuperAdmin?: boolean };
  };
  isGlobalSuperAdmin?: boolean;
  user?: { isGlobalSuperAdmin?: boolean };
};

export function isGlobalSuperAdminSession(session: unknown): boolean {
  if (!session || typeof session !== 'object') return false;
  const payload = session as SessionLike;
  return (
    payload.data?.isGlobalSuperAdmin === true ||
    payload.data?.user?.isGlobalSuperAdmin === true ||
    payload.isGlobalSuperAdmin === true ||
    payload.user?.isGlobalSuperAdmin === true
  );
}
