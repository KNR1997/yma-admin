import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import {
  Course,
  Enrollment,
  EnrollmentStatusType,
  Hall,
  MappedPaginatorInfo,
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
import Badge from '@/components/ui/badge/badge';
import Avatar from '@/components/common/avatar';
import { getMonthName } from '@/utils/get-month-name';

type IProps = {
  enrollments: Enrollment[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const EnrollmentList = ({
  enrollments,
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
      dataIndex: 'first_name',
      key: 'first_name',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('first_name'),
      render: (first_name: string, record: Enrollment) => (
        <div className="flex items-center">
          <Avatar name={record?.student?.user?.username!} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {record?.student?.user?.first_name}{' '}
            {record?.student?.user?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.student?.student_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'capacity',
      align: 'center',
      render: (course: any, record: Enrollment) => (
        <span className="truncate whitespace-nowrap capitalize">
          {record.course?.name}
        </span>
      ),
    },
    {
      title: 'Last Payment Month',
      dataIndex: 'last_payment_month',
      key: 'last_payment_month',
      align: 'center',
      render: (last_payment_month: number) =>
        getMonthName(last_payment_month, router.locale),
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 200,
      render: (status: string, record: any) => (
        <div>
          <Badge
            text={status}
            color={
              status == EnrollmentStatusType.LOCKED
                ? 'bg-yellow-400/10 text-yellow-500'
                : 'bg-accent bg-opacity-10 !text-accent'
            }
            className="capitalize"
          />
        </div>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (slug: string, record: Enrollment) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_HALL"
          routes={Routes?.enrollment}
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
          data={enrollments}
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

export default EnrollmentList;
