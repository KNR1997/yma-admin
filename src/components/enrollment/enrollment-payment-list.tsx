import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import {
  EnrollmentPayment,
  MappedPaginatorInfo,
  SortOrder,
} from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useRouter } from 'next/router';
import { getMonthName } from '@/utils/get-month-name';
import { formatDate } from '@/utils/format-date';

type IProps = {
  enrollmentPayments: EnrollmentPayment[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const EnrollmentPaymentList = ({
  enrollmentPayments,
  paginatorInfo,
  onPagination,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const columns = [
    {
      title: 'Payment Year',
      dataIndex: 'payment_year',
      key: 'payment_year',
      align: alignLeft,
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Payment Month',
      dataIndex: 'payment_month',
      key: 'payment_month',
      align: 'center',
      render: (payment_month: number) =>
        getMonthName(payment_month, router.locale),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: function Render(value: number, record: EnrollmentPayment) {
        return (
          <span className="whitespace-nowrap">Rs. {value.toFixed(2)}</span>
        );
      },
    },
    {
      title: 'Payment Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      align: 'center',
      render: (payment_date: any) => formatDate(payment_date),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={enrollmentPayments}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.page}
            pageSize={paginatorInfo.pageSize}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default EnrollmentPaymentList;
