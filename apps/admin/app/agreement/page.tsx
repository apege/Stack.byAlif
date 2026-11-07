import ClientAgreementPortal from './ClientAgreementPortal';

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export default async function AgreementPortalPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return <ClientAgreementPortal initialRef={ref || ''} />;
}
