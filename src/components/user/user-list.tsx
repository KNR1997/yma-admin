import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { siteSettings } from '@/settings/site.settings';
import {
  Category,
  MappedPaginatorInfo,
  SortOrder,
  User,
  UserPaginator,
} from '@/types';
import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import Avatar from '@/components/common/avatar';
import Badge from '@/components/ui/badge/badge';
import { formatDate } from '@/utils/format-date';
import { Routes } from '@/config/routes';

type IProps = {
  customers: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const UserList = ({
  customers,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
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
      dataIndex: 'first_name',
      key: 'first_name',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('first_name'),
      render: (first_name: string, record: User) => (
        <div className="flex items-center">
          <Avatar name={record?.username!} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {first_name} {record?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {record?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: alignLeft,
      width: 150,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      width: 300,
      render: (role: any) => {
        return (
          <div className="flex flex-wrap gap-1.5 whitespace-nowrap">
            <span className="rounded bg-gray-200/50 px-2.5 py-1">
              {role?.name}
            </span>
          </div>
        );
      },
    },
    // {
    //   title: 'Department',
    //   dataIndex: 'email',
    //   key: 'email',
    //   align: 'center',
    // },
    {
      title: 'SuperUser',
      dataIndex: 'is_superuser',
      key: 'is_superuser',
      align: 'center',
      render: (is_superuser: boolean) => (
        <Badge
          textKey={is_superuser ? 'common:text-yes' : 'common:text-no'}
          color={
            is_superuser
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },
    {
      title: 'Last-login',
      dataIndex: 'last_login',
      key: 'last_login',
      align: 'center',
      render: (last_login: any) => formatDate(last_login),
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-title')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
    //       }
    //       isActive={sortingObj.column === 'id'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'username',
    //   key: 'username',
    //   align: alignLeft,
    //   width: 250,
    //   ellipsis: true,
    //   onHeaderCell: () => onHeaderClick('username'),
    //   render: (
    //     username: string,
    //     { profile, email }: { profile: any; email: string }
    //   ) => (
    //     <div className="flex items-center">
    //       <Avatar name={username} src={profile?.avatar?.thumbnail} />
    //       <div className="flex flex-col whitespace-nowrap font-medium ms-2">
    //         {username}
    //         <span className="text-[13px] font-normal text-gray-500/80">
    //           {email}
    //         </span>
    //       </div>
    //     </div>
    //   ),
    // },
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
    //           ),
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: t('table:table-item-available_wallet_points'),
    //   dataIndex: ['wallet', 'available_points'],
    //   key: 'available_wallet_points',
    //   align: 'center',
    //   width: 150,
    // },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      width: 150,
      className: 'cursor-pointer',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => (
        <Badge
          textKey={is_active ? 'common:text-active' : 'common:text-inactive'}
          color={
            is_active
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 120,
      render: function Render(id: string, { is_active }: any) {
        // const { data } = useMeQuery();
        return (
          <>
            {/* {data?.id != id && ( */}
            <ActionButtons
              id={id}
              editUrl={Routes.user.editWithoutLang(id)}
              userStatus={true}
              isUserActive={is_active}
              resetUserPassword={true}
              // showAddWalletPoints={true}
              // showMakeAdminButton={true}
            />
            {/* )} */}
          </>
        );
      },
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
          data={customers}
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

export default UserList;
