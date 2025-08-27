import Layout from '@/components/layouts/student';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useCourseQuery } from '@/data/course';
import CreateOrUpdateCourseForm from '@/components/course/course-form';
import { adminAndTeacherAndStudent } from '@/utils/auth-utils';
import Image from 'next/image';
import Dropdown from '@/components/ui/dropdown';

export default function CourseDetailPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { course, isLoading, error } = useCourseQuery({
    slug: query.id as string,
  });

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">{course?.name}</h1>
      </div>
      <div className="relative h-[20rem] bg-white lg:h-[37.5rem]">
        <Image
          src={'/course-fallback-cover-photo.png'}
          // fill
          height={600}
          width={1200}
          sizes="(max-width: 768px) 70vw"
          alt={Object(name)}
          className="h-full w-full object-cover"
        />

        <div className="mt-6 space-y-4">
          <Dropdown
            title="Week 05 - Basic Elements of Programming"
            subtitle="(1 September - 7 September)"
          >
            <h3 className="mb-2 text-base font-medium text-purple-600">
              Expressions and Operators – Week 5
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              After completing this lesson, you will be able to use expressions
              and operators in programming.
            </p>

            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                ✅ Compare statements and expressions
              </li>
              <li className="flex items-center gap-2">
                ✅ Apply different types of operators when you write Python
                programs
              </li>
              <li className="flex items-center gap-2">
                ✅ Define the importance of comments
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
      {/* <CreateOrUpdateCourseForm initialValues={course} /> */}
    </>
  );
}
CourseDetailPage.authenticate = {
  permissions: adminAndTeacherAndStudent,
};
CourseDetailPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
