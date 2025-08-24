import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import {
  EnrollmentPayment,
  MappedPaginatorInfo,
  Payment,
  SortOrder,
} from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { formatDate } from '@/utils/format-date';
import { getMonthName } from '@/utils/get-month-name';

type IProps = {
  enrollmentPayments: EnrollmentPayment[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CoursePaymentList = ({
  enrollmentPayments,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );

      onOrder(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });
  const columns = [
    {
      title: (
        <TitleWithSort
          title="Student No."
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'enrollment',
      key: 'enrollment',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (enrollment: any, record: EnrollmentPayment) => {
        return <h2>{record?.enrollment?.student?.student_number}</h2>;
      },
    },
    {
      title: 'Course Name',
      dataIndex: 'course',
      key: 'course',
      align: 'center',
      render: (enrollment: any, record: EnrollmentPayment) => {
        return <h2>{record?.enrollment?.course?.name}</h2>;
      },
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
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (slug: string, record: Payment) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_HALL"
          routes={Routes?.hall}
        />
      ),
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

export default CoursePaymentList;
