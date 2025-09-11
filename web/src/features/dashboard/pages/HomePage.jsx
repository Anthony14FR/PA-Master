export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page d'accueil Dashboard
        </h1>
        <p className="text-gray-600">
          Contenu spécifique à la page Home avec sidebar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Statistiques Home</h3>
          <p className="text-gray-600">Données de la page Home</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Activité Home</h3>
          <p className="text-gray-600">Actions de la page Home</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Notifications Home</h3>
          <p className="text-gray-600">Messages de la page Home</p>
        </div>
      </div>
    </div>
  )
}