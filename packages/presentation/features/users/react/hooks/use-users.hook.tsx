import { useMemo } from "react";
import { useHttpClient } from "../../../../shared/hooks/use-services";
import { UserRepository } from "@kennelo/infrastructure/adapters/repositories/api-user.repository";
import { UserEntity } from "@kennelo/domain/entities/user.entity";
import { Email } from "@kennelo/domain/values/email.value";

export function useUserRepository() {
    const httpClient = useHttpClient();

    const repository = useMemo(() => {
        return new UserRepository(httpClient);
    }, [httpClient]);

    return repository;
}

export function useUsers() {
    const repository = useUserRepository();

    const findById = async (id: string): Promise<UserEntity | undefined> => {
        return await repository.findById(id);
    };

    const findByEmail = async (email: Email): Promise<UserEntity | undefined> => {
        return await repository.findByEmail(email);
    };

    const findAll = async (page?: number, pageSize?: number) => {
        return await repository.findAll(page, pageSize);
    };

    const save = async (entity: UserEntity): Promise<void> => {
        return await repository.save(entity);
    };

    const update = async (id: string, entity: Partial<UserEntity>): Promise<void> => {
        return await repository.update(id, entity);
    };

    const deleteUser = async (id: string): Promise<void> => {
        return await repository.delete(id);
    };

    const exists = async (id: string): Promise<boolean> => {
        return await repository.exists(id);
    };

    return {
        findById,
        findByEmail,
        findAll,
        save,
        update,
        delete: deleteUser,
        exists,
    };
}
