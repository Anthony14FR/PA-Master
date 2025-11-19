"use client";

import {useTranslation} from "@kennelo/presentation/shared/hooks/use-translation";
import {Button} from "@kennelo/presentation/shared/components/ui/button";
import {useAuth} from "@kennelo/presentation/features/auth/react/contexts/auth.context";

export default function Page() {
    const { user, logout, isAuthenticated } = useAuth()
    const { t } = useTranslation();

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl">{t('site.name')}</h1>
                <h1 className="text-blue-500">{t('site.description')}</h1>
            </div>
            {isAuthenticated && (
                <>
                    <div className="px-6">
                        <div className="flex gap-4">
                            <p>uuid:</p>
                            <p>{user.id}</p>
                        </div>
                        <div className="flex gap-4">
                            <p>Fullname:</p>
                            <p>{user.fullName}</p>
                        </div>
                        <div className="flex gap-4">
                            <p>Email:</p>
                            <p>{user.email}</p>
                        </div>
                        <div className="flex gap-4">
                            <p>Lang:</p>
                            <p>{user.locale}</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <Button onClick={logout} variant="destructive" className="my-4">
                            Se déconnecter
                        </Button>
                    </div>
                </>
            )}
        </>
    );
}