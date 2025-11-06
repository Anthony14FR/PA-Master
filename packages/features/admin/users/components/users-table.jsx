"use client";

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kennelo/ui/table';
import { Button } from '@kennelo/ui/button';
import { Badge } from '@kennelo/ui/badge';
import { Trash2, Eye } from 'lucide-react';

export function UsersTable({ users, onDelete, onView }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setDeletingId(userId);
      try {
        await onDelete(userId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Rôles</TableHead>
          <TableHead>Email vérifié</TableHead>
          <TableHead>ID vérifié</TableHead>
          <TableHead>Date d'inscription</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
              Aucun utilisateur trouvé
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">Aucun rôle</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {user.email_verified_at ? (
                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="destructive">Non vérifié</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.is_id_verified ? (
                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="outline">Non vérifié</Badge>
                )}
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(user.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}