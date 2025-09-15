import AdminLayout from '@/components/layouts/admin';
import { adminOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'react-i18next';
import { useEnrollmentPaymentsQuery } from '@/data/enrollment';
import EnrollmentPageHeader from '@/components/enrollment/enrollment-page-header';
import EnrollmentPaymentList from '@/components/enrollment/enrollment-payment-list';
import { useState } from 'react';
import { SortOrder } from '@/types';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';

export default function EnrollmentPayments() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { enrollmentPayments, paginatorInfo, loading, error } =
    useEnrollmentPaymentsQuery(query.id as string);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <EnrollmentPageHeader
        pageTitle="Enrollment Details"
        enrollmentId={query.id as string}
      />
      <div className='flex justify-end mb-5'>
        <LinkButton
          href={`${Routes.coursePayment.create}`}
          // className="h-12 w-full md:w-auto md:ms-6"
        >
          <span>+ Add Payment</span>
        </LinkButton>
      </div>
      <EnrollmentPaymentList
        enrollmentPayments={enrollmentPayments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
EnrollmentPayments.authenticate = {
  permissions: adminOnly,
};
EnrollmentPayments.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'table', 'common'])),
  },
});
