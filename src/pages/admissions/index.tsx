import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import { useHallsQuery } from '@/data/hall';
import HallList from '@/components/hall/hall-list';
import { useAdmissionPaymentsQuery } from '@/data/payment';
import AdmissionPaymentList from '@/components/admission/admission-payment-list';

export default function AdmissionPayments() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { payments, paginatorInfo, loading, error } = useAdmissionPaymentsQuery({
    limit: 20,
    page,
    // name: searchTerm,
    orderBy,
    sortedBy,
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

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title="Admission Payments" />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-2/4">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          <LinkButton
            href={`${Routes.admission.create}`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span>+ Add Payment</span>
          </LinkButton>
        </div>
      </Card>
      <AdmissionPaymentList
        payments={payments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

AdmissionPayments.authenticate = {
  permissions: adminOnly,
};
AdmissionPayments.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
