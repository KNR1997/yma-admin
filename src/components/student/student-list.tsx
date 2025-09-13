import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import {
  MappedPaginatorInfo,
  Role,
  SortOrder,
  Student,
  Subject,
  User,
} from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Avatar from '@/components/common/avatar';
import Badge from '@/components/ui/badge/badge';

type IProps = {
  students: Student[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const StudentList = ({
  students,
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
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'user.username',
      key: 'user.username',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('user.username'),
      render: (
        user: User,
        record: Student,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          <Avatar
            name={record?.user?.first_name!}
            src={profile?.avatar?.thumbnail}
          />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {record?.user?.first_name} {record?.user?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center',
    },
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
      dataIndex: 'student_number',
      key: 'student_number',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('student_number'),
    },
    {
      title: 'Username',
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: User, record: Student) => {
        return <h2>{record?.user?.username}</h2>;
      },
    },
    {
      title: 'Admission Payed',
      dataIndex: 'is_admission_payed',
      key: 'is_admission_payed',
      align: 'center',
      width: 200,
      render: (is_admission_payed: boolean, record: any) => (
        <div>
          <Badge
            text={is_admission_payed ? 'Yes' : 'No'}
            color={
              is_admission_payed
                ? 'bg-accent bg-opacity-10 !text-accent'
                : 'bg-yellow-400/10 text-yellow-500'
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
      render: (slug: string, record: Student) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_STUDENT"
          routes={Routes?.student}
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
          data={students}
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

export default StudentList;
