import { PensionDetailPage } from '@/features/explore/pages/PensionDetailPage';

export const metadata = {
    title: 'Détail de la pension',
    description: 'Informations et réservation',
};

export default function Page({ params }) {
    return <PensionDetailPage pensionId={params.id} />;
}