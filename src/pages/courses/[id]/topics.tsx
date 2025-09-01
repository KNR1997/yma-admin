import AdminLayout from '@/components/layouts/admin';
import { adminOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import CoursePageHeader from '@/components/course/course-page-header';
import CourseTopicsForm from '@/components/course/topics';
import { useCourseTopicsQuery } from '@/data/course';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'react-i18next';

export default function CourseTopics() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const { courseTopics, paginatorInfo, loading, error } = useCourseTopicsQuery(
    query.id as string,
  );

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <CoursePageHeader pageTitle="Edit Course" courseId={query.id as string} />
      <CourseTopicsForm
        courseId={query.id as string}
        courseTopics={courseTopics}
      />
    </>
  );
}
CourseTopics.authenticate = {
  permissions: adminOnly,
};
CourseTopics.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
