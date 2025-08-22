import Layout from '@/components/layouts/admin';
import CreateOrUpdateRoleForm from '@/components/roles/role-form';
import { useRoleQuery } from '@/data/role';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';

export default function UpdateRolePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { role, loading, error } = useRoleQuery({
    slug: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Edit Role</h1>
      </div>
      <CreateOrUpdateRoleForm initialValues={role} />
    </>
  );
}
UpdateRolePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
