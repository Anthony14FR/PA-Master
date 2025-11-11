import { Register } from '@kennelo/features/auth/views/account/register';

export const metadata = {
    title: 'Inscription',
    description: 'Créez votre compte',
};

export default function Page() {
    return <Register />;
}