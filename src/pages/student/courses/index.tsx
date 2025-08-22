import Card from '@/components/common/card';
import Layout from '@/components/layouts/student';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { GradeType, SortOrder } from '@/types';
import { studentOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import { useCoursesQuery } from '@/data/course';
import CourseList from '@/components/course/course-list';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import cn from 'classnames';
import CourseFilter from '@/components/filters/course-filter';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';

export default function Courses() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [grade, setGrade] = useState<GradeType | null>(null);

  const { courses, paginatorInfo, loading, error } = useCoursesQuery({
    limit: 20,
    page,
    orderBy,
    sortedBy,
    name: searchTerm,
    grade: grade,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title="Courses" />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-2/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
            <LinkButton
              href={`${Routes.course.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ Add Course</span>
            </LinkButton>
            <button
              className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
              onClick={toggleVisible}
            >
              {t('common:text-filter')}{' '}
              {visible ? (
                <ArrowUp className="ms-2" />
              ) : (
                <ArrowDown className="ms-2" />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CourseFilter
              className="w-full"
              onGradeFilter={(grade: { label: string; value: GradeType }) => {
                setGrade(grade?.value!);
                setPage(1);
              }}
              enableGrade
            />
          </div>
        </div>
      </Card>
      <CourseList
        courses={courses}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Courses.authenticate = {
  permissions: studentOnly,
};
Courses.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
