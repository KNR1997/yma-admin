import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiValidationSchema } from './api-validation-schema';
import { Api, ApiMethodType } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { useCreateApiMutation, useUpdateApiMutation } from '@/data/api';

type FormValues = {
  path: string;
  summary: string;
  method: { name: string; value: string };
  tags: string;
};

const defaultValues = {
  // name: '',
  // password: '',
};

const apiMethods = [
  { name: ApiMethodType.GET, value: ApiMethodType.GET },
  { name: ApiMethodType.POST, value: ApiMethodType.POST },
  { name: ApiMethodType.PUT, value: ApiMethodType.PUT },
  { name: ApiMethodType.PATCH, value: ApiMethodType.PATCH },
  { name: ApiMethodType.DELETE, value: ApiMethodType.DELETE },
];

type IProps = {
  initialValues?: Api;
};

const CreateOrUpdateApiForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: createApi, isLoading: creating } = useCreateApiMutation();
  const { mutate: updateApi, isLoading: updating } = useUpdateApiMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
          method: apiMethods.find((apiMethod) => apiMethod.value == initialValues.method)
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(apiValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      path: values.path,
      summary: values.summary,
      method: values.method.value,
      tags: values.tags,
    };

    try {
      if (!initialValues) {
        createApi(input);
      } else {
        updateApi({
          ...input,
          id: initialValues.id,
        });
      }
    } catch (error) {}
  };

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
            label="Path"
            {...register('path')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.path?.message!)}
            required
          />
          {/* <Input
            label="Method"
            {...register('method')}
            type="desc"
            variant="outline"
            className="mb-4"
            error={t(errors.method?.message!)}
            required
          /> */}
          <div className="mb-5">
            <Label>Method</Label>
            <SelectInput
              name="method"
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.value}
              control={control}
              options={apiMethods}
            />
            <ValidationError
              //@ts-ignore
              message={t(errors.method?.message!)}
            />
          </div>
          <Input
            label="Tags"
            {...register('tags')}
            type="desc"
            variant="outline"
            className="mb-4"
            error={t(errors.tags?.message!)}
          />
          <Input
            label="Summary"
            {...register('summary')}
            type="desc"
            variant="outline"
            className="mb-4"
            error={t(errors.summary?.message!)}
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Api' : 'Add Api'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateApiForm;
