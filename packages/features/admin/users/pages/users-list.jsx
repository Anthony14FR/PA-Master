"use client";

import { useState, useEffect } from 'react';
import { UsersTable } from '../components/users-table';
import { adminUserService } from '../services/user.service';
import { Button } from '@kennelo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kennelo/ui/card';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import KLink from "@kennelo/components/k-link";

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const router = useRouter();

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.getAllUsers(page);

      if (response.data) {
        setUsers(response.data.data || response.data);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0,
        });
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDelete = async (userId) => {
    try {
      await adminUserService.deleteUser(userId);
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleView = (userId) => {
    router.push(`/s/admin/users/${userId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription className="mt-2">
                {pagination ? (
                  `${pagination.total} utilisateur${pagination.total > 1 ? 's' : ''} au total`
                ) : (
                  'Liste de tous les utilisateurs de la plateforme'
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fetchUsers(currentPage)}
                  disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              <Button asChild>
                <KLink context="admin" href="/">
                  Retour
                </KLink>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Chargement des utilisateurs...</span>
              </div>
            </div>
          ) : (
            <>
              <UsersTable
                users={users}
                onDelete={handleDelete}
                onView={handleView}
              />

              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.current_page} sur {pagination.last_page}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === pagination.last_page || loading}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}