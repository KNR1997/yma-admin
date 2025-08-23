import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useApiQuery } from '@/data/api';
import CreateOrUpdateApiForm from '@/components/api/api-form';
import { adminOnly } from '@/utils/auth-utils';

export default function UpdateApiPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { api, loading, error } = useApiQuery({
    slug: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Edit Api</h1>
      </div>
      <CreateOrUpdateApiForm initialValues={api} />
    </>
  );
}
UpdateApiPage.authenticate = {
  permissions: adminOnly,
};
UpdateApiPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
