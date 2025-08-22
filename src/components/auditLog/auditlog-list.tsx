import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import {
  ApiMethodType,
  AuditLog,
  MappedPaginatorInfo,
  Role,
  SortOrder,
} from '@/types';
import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import Avatar from '@/components/common/avatar';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { formatDate } from '@/utils/format-date';
import Badge from '../ui/badge/badge';
import ApiMethodColor from '../api/api-method-color';

type IProps = {
  auditLogs: AuditLog[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const AudtiLogList = ({
  auditLogs,
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
      title: 'Username',
      className: 'cursor-pointer',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      width: 250,
    },
    {
      title: 'API Summary',
      dataIndex: 'summary',
      key: 'summary',
      align: 'center',
    },
    {
      title: 'Function Module',
      dataIndex: 'module',
      key: 'module',
      align: 'center',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      render: (text: ApiMethodType) => (
        <Badge
          text={text}
          className="font-medium uppercase"
          color={ApiMethodColor(text)}
        />
      ),
    },
    {
      title: 'Request Path',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
    },
    {
      title: 'Status Code',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    // {
    //   title: 'Request Body',
    //   dataIndex: 'desc',
    //   key: 'desc',
    //   align: 'center',
    // },
    {
      title: 'Response Time (s)',
      dataIndex: 'response_time',
      key: 'response_time',
      align: 'center',
    },
    {
      title: 'Operation Time',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (created_at: any) => formatDate(created_at),
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
          data={auditLogs}
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

export default AudtiLogList;
