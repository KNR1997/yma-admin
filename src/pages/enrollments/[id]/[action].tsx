import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import CreateOrUpdateEnrollmentForm from '@/components/enrollment/enrollment-form';
import { useEnrollmentQuery } from '@/data/enrollment';

export default function UpdateHallPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { enrollment, isLoading, error } = useEnrollmentQuery({
    slug: query.id as string,
  });

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Edit Enrollment</h1>
      </div>
      <CreateOrUpdateEnrollmentForm initialValues={enrollment} />
    </>
  );
}
UpdateHallPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
