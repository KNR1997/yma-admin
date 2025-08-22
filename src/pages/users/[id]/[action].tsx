import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import CreateOrUpdateUserForm from '@/components/user/user-form';
import { useUserQuery } from '@/data/user';

export default function UpdateUserPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { user, loading, error } = useUserQuery({
    id: query.id as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Edit User</h1>
      </div>
      <CreateOrUpdateUserForm initialValues={user} />
    </>
  );
}
UpdateUserPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
