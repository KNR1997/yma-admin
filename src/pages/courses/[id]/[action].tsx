import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useCourseQuery } from '@/data/course';
import CreateOrUpdateCourseForm from '@/components/course/course-form';
import { adminOnly } from '@/utils/auth-utils';
import CoursePageHeader from '@/components/course/course-page-header';

export default function UpdateCoursePage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { course, isLoading, error } = useCourseQuery({
    slug: query.id as string,
  });

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      {/* <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Edit Course</h1>
      </div> */}
      <CoursePageHeader pageTitle="Edit Course" courseId={query.id as string} />
      <CreateOrUpdateCourseForm initialValues={course} />
    </>
  );
}
UpdateCoursePage.authenticate = {
  permissions: adminOnly,
};
UpdateCoursePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
