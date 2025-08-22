import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { roleValidationSchema } from './role-validation-schema';
import { Api, ApiMethodType, ErrorResponse, Permission, Role } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { useRouter } from 'next/router';
import {
  useCreateRoleMutation,
  useRoleAuthorizedQuery,
  useUpdateRoleAuthorizedMutation,
  useUpdateRoleMutation,
} from '@/data/role';
import { Table } from '@/components/ui/table';
import { NoDataFound } from '@/components/icons/no-data-found';
import Checkbox from '../ui/checkbox/checkbox';
import { useIsRTL } from '@/utils/locals';
import { useApisQuery } from '@/data/api';
import { useEffect, useState } from 'react';
import Badge from '../ui/badge/badge';
import ApiMethodColor from '../api/api-method-color';
import { getErrorMessage } from '@/utils/form-error';
import { formatRoleNameToKey, formatSlug } from '@/utils/use-slug';

type FormValues = {
  name: string;
  desc: string;
  key: string;
  key_list: string[];
};

const defaultValues = {
  // name: '',
  // password: '',
};

type IProps = {
  initialValues?: Role;
};

const CreateOrUpdateRoleForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft } = useIsRTL();
  const [selectedRowKeys, setSelectedRowKeys] = useState<
    { id: string; method: ApiMethodType; path: string }[]
  >([]);

  const { mutate: createRole, isLoading: creating } = useCreateRoleMutation();
  const { mutate: updateRole, isLoading: updating } = useUpdateRoleMutation();
  const { apis } = useApisQuery({});
  const { data: roleAuthorizedData } = useRoleAuthorizedQuery({
    id: initialValues?.id,
  });

  const { mutate: updateRoleAuthorize } = useUpdateRoleAuthorizedMutation();

  useEffect(() => {
    if (roleAuthorizedData?.apis) {
      setSelectedRowKeys(
        roleAuthorizedData?.apis.map((p) => ({
          id: p.id,
          method: p.method,
          path: p.path,
        })),
      );
    }
  }, [roleAuthorizedData?.apis]);

  const {
    watch,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(roleValidationSchema),
  });

  // Handle checkbox change
  const onCheckboxChange = (record: Api) => {
    setSelectedRowKeys((prevSelectedRowKeys) => {
      const exists = prevSelectedRowKeys.some(
        (item: any) => item.id === record.id,
      );
      if (exists) {
        return prevSelectedRowKeys.filter((item: any) => item.id !== record.id);
      } else {
        return [
          ...prevSelectedRowKeys,
          { id: record.id, method: record.method, path: record.path },
        ];
      }
    });
  };

  const keyAutoSuggest = formatRoleNameToKey(watch('name'));

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      desc: values.desc,
      key: keyAutoSuggest,
      key_list: [keyAutoSuggest],
      // api_infos: selectedRowKeys,
    };

    console.log('input: ', input);

    try {
      if (!initialValues) {
        createRole(input);
      } else {
        updateRole({
          ...input,
          id: initialValues.id,
        });
        updateRoleAuthorize({
          roleId: initialValues.id,
          api_infos: selectedRowKeys.map((d) => ({
            method: d.method,
            path: d.path,
          })),
          // api_infos: [
          //   {
          //     method: 'GET',
          //     path: '/api/v1/apis',
          //   },
          // ],
          menu_ids: [],
        });
      }
    } catch (error: any) {
      const err = error.response?.data as ErrorResponse;
      if (err.validation) {
        const serverErrors = getErrorMessage(error?.response?.data);
        Object.keys(serverErrors?.validation).forEach((field: any) => {
          setError(field, {
            type: 'manual',
            message: serverErrors?.validation[field][0],
          });
        });
      }
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          name="selectAll"
          // onChange={(e) => {
          //   if (e.target.checked) {
          //     setSelectedRowKeys(
          //       permissions.map((permission) => ({
          //         id: permission.id,
          //       })),
          //     );
          //   } else {
          //     setSelectedRowKeys([]);
          //   }
          // }}
          // checked={selectedRowKeys.length === permissions.length}
          // indeterminate={
          //   selectedRowKeys.length > 0 &&
          //   selectedRowKeys.length < initialValues?.permissions.length
          // }
        />
      ),
      dataIndex: 'checkbox',
      key: 'checkbox',
      align: 'center',
      render: (_: any, record: any) => (
        <Checkbox
          name={`checkbox-${record.id}`}
          checked={selectedRowKeys.some((item: any) => item.id === record.id)}
          onChange={() => onCheckboxChange(record)}
        />
      ),
      width: 50,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      ellipsis: true,
      align: alignLeft,
      width: 150,
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
      align: alignLeft,
      width: 150,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      ellipsis: true,
      align: alignLeft,
      width: 150,
      render: (text: ApiMethodType) => (
        <Badge
          text={text}
          className="font-medium uppercase"
          color={ApiMethodColor(text)}
        />
      ),
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
      align: alignLeft,
      width: 150,
      render: (name: string) => {
        if (name) {
          return <span className="truncate whitespace-nowrap">{name}</span>;
        }
        return <span>_</span>;
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
            required
          />
          <Input
            label="Key"
            {...register('key')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.key?.message!)}
            disabled
            value={keyAutoSuggest}
          />
          {/* <Input
            label='Key List'
            {...register('key_list')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.key_list?.message!)}
            required
          /> */}
          <Input
            label="Description"
            {...register('desc')}
            type="desc"
            variant="outline"
            className="mb-4"
            error={t(errors.desc?.message!)}
          />
          {/* <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-4"
            required
          /> */}
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:api-permissions-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            name="search"
            label="Search"
            // value={searchText}
            // onChange={(e) => setSearchText(e.target.value)}
            variant="outline"
            className="mb-5"
            placeholder="Search Api"
          />
          <div className="max-h-96 overflow-y-auto">
            <Table
              // @ts-ignore
              columns={columns}
              emptyText={() => (
                <div className="flex flex-col items-center py-7">
                  <NoDataFound className="w-52" />
                  <div className="mb-1 pt-6 text-base font-semibold text-heading">
                    {t('table:empty-table-data')}
                  </div>
                  <p className="text-[13px]">
                    {t('table:empty-table-sorry-text')}
                  </p>
                </div>
              )}
              data={apis}
              rowKey="id"
              scroll={{ x: 1000 }}
            />
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Role' : 'Add Role'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateRoleForm;
