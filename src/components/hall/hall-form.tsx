import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse, Hall } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { hallValidationSchema } from './hall-validation-schema';
import { useCreateHallMutation, useUpdateHallMutation } from '@/data/hall';
import { getErrorMessage } from '@/utils/form-error';

type FormValues = {
  name: string;
  capacity: number;
};

const defaultValues = {};

type IProps = {
  initialValues?: Hall;
};

const CreateOrUpdateHallForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createHall, isLoading: creating } =
    useCreateHallMutation();
  const { mutateAsync: updateHall, isLoading: updating } =
    useUpdateHallMutation();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(hallValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      capacity: values.capacity,
    };

    try {
      if (!initialValues) {
        await createHall(input);
      } else {
        await updateHall({
          ...input,
          id: initialValues.id,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:course-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Name"
            {...register('name')}
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
            required
          />
          <Input
            label="Capacity"
            type="number"
            {...register('capacity')}
            variant="outline"
            className="mb-4"
            error={t(errors.capacity?.message!)}
            required
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Hall' : 'Add Hall'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateHallForm;
