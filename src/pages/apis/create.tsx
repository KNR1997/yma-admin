import CreateOrUpdateApiForm from '@/components/api/api-form';
import Layout from '@/components/layouts/admin';
import CreateOrUpdateRoleForm from '@/components/roles/role-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateApiPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          Create New Api
        </h1>
      </div>
      <CreateOrUpdateApiForm />
    </>
  );
}
CreateApiPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
