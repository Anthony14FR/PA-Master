'use client';

import { useEffect, useState } from 'react';
import { getTestData } from '../../lib/api';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTestData();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des données:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test de Communication API
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Cette page teste la communication entre le frontend Next.js et l'API Laravel
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Données de l'API Laravel
            </h2>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>

          {loading && !data && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Chargement des données...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="text-red-800">
                  <h3 className="text-sm font-medium">Erreur de connexion</h3>
                  <p className="text-sm mt-1">{error}</p>
                  <p className="text-xs mt-2 text-red-600">
                    Vérifiez que votre API Laravel est démarrée sur http://localhost:8000
                  </p>
                </div>
              </div>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  ✅ Connexion réussie !
                </h3>
                <p className="text-sm text-green-700">
                  Les données ont été récupérées avec succès depuis l'API Laravel.
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Réponse de l'API :
                </h3>
                <div className="bg-white border rounded p-4 overflow-auto">
                  <pre className="text-sm text-gray-700">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800">Message</h4>
                  <p className="text-blue-700">{data.message}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Status</h4>
                  <p className="text-green-700">{data.status}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Timestamp</h4>
                  <p className="text-purple-700 text-sm">
                    {new Date(data.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
} 