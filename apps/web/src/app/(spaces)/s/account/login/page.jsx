import { Login } from '@kennelo/features/auth/views/account/login';

export const metadata = {
    title: 'Connexion',
    description: 'Connectez-vous à votre compte',
};

export default function Page() {
    return <Login />;
}