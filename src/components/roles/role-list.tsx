import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { MappedPaginatorInfo, Role, SortOrder } from '@/types';
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

type IProps = {
  roles: Role[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const RoleList = ({
  roles,
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
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-id')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
    //       }
    //       isActive={sortingObj.column === 'id'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft,
    //   width: 150,
    //   onHeaderCell: () => onHeaderClick('id'),
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
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
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (
        name: string,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          <Avatar name={name} src={profile?.avatar?.thumbnail} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {email}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   title: t('table:table-item-permissions'),
    //   dataIndex: 'permissions',
    //   key: 'permissions',
    //   align: alignLeft,
    //   width: 300,
    //   render: (permissions: any) => {
    //     return (
    //       <div className="flex flex-wrap gap-1.5 whitespace-nowrap">
    //         {permissions?.map(
    //           ({ name, index }: { name: string; index: number }) => (
    //             <span
    //               key={index}
    //               className="rounded bg-gray-200/50 px-2.5 py-1"
    //             >
    //               {name}
    //             </span>
    //           )
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
      align: 'center',
    },
    {
      title: 'Created/at',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (created_at: any) => formatDate(created_at),
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-status')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === 'is_active'
    //       }
    //       isActive={sortingObj.column === 'is_active'}
    //     />
    //   ),
    //   width: 150,
    //   className: 'cursor-pointer',
    //   dataIndex: 'is_active',
    //   key: 'is_active',
    //   align: 'center',
    //   onHeaderCell: () => onHeaderClick('is_active'),
    //   render: (is_active: boolean) => (
    //     <Badge
    //       textKey={is_active ? 'common:text-active' : 'common:text-inactive'}
    //       color={
    //         is_active
    //           ? 'bg-accent/10 !text-accent'
    //           : 'bg-status-failed/10 text-status-failed'
    //       }
    //     />
    //   ),
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (slug: string, record: Role) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_ROLE"
          routes={Routes?.role}
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
          data={roles}
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

export default RoleList;
