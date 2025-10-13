'use client';

import { useAuth } from '@/shared/hooks/useAuth';
import { useCommonTranslation } from '@/hooks/useTranslation';

export default function Page() {
  const { user, logout, loading } = useAuth();
  const { t } = useCommonTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              {t("dashboard.logout")}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">{t("dashboard.loading")}</p>
              </div>
            </div>
          ) : user ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                ✅ {t("dashboard.authSuccess")}
              </h2>
              <div className="space-y-2 text-green-700">
                <p><strong>{t("dashboard.userInfo.name")} :</strong> {user.name}</p>
                <p><strong>{t("dashboard.userInfo.email")} :</strong> {user.email}</p>
                <p><strong>{t("dashboard.userInfo.id")} :</strong> {user.id}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600">{t("dashboard.redirecting")}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-gray-600">
              {t("dashboard.welcome")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}