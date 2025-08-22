import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useGuardianQuery } from '@/data/guardian';
import CreateOrUpdateGuardianForm from '@/components/guardian/guardian-form';

export default function UpdateGuardianPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { guardian, isLoading, error } = useGuardianQuery({
    slug: query.id as string,
  });

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Edit Guardian</h1>
      </div>
      <CreateOrUpdateGuardianForm initialValues={guardian} />
    </>
  );
}
UpdateGuardianPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
