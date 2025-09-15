import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse, GenderType, Guardian } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { guardianValidationSchema } from './guardian-validation-schema';
import {
  useCreateGuardianMutation,
  useUpdateGuardianMutation,
} from '@/data/guardian';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { genderTypeOptions } from '@/constants';
import { toast } from 'react-toastify';

type FormValues = {
  first_name: string;
  last_name: string;
  nic_number: string;
  phone_number: string;
  gender: { label: string; value: GenderType };
};

const defaultValues = {};

type IProps = {
  initialValues?: Guardian;
};

const CreateOrUpdateGuardianForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createGuardian, isLoading: creating } =
    useCreateGuardianMutation();
  const { mutateAsync: updateGuardian, isLoading: updating } =
    useUpdateGuardianMutation();

  const {
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
          gender: genderTypeOptions.find(
            (genderTypeOption) =>
              genderTypeOption.value == initialValues.gender,
          ),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(guardianValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    // Payload data
    const input = {
      first_name: values.first_name,
      last_name: values.last_name,
      nic_number: values.nic_number,
      phone_number: values.phone_number,
      gender: values.gender.value,
    };

    try {
      if (!initialValues) {
        await createGuardian(input);
      } else {
        await updateGuardian({
          ...input,
          id: initialValues.id,
        });
      }
    } catch (error: any) {
      const errData = error?.response?.data;

      if (errData?.field) {
        // Attach to field error in form
        setError(errData.field as keyof FormValues, {
          type: 'manual',
          message: errData.error,
        });
      } else {
        // Show global error toast
        toast.error(errData?.error ?? 'Something went wrong!');
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
            label="First Name"
            {...register('first_name')}
            type="text"
            variant="outline"
            className="mb-4"
            required
            error={t(errors.first_name?.message!)}
          />
          <Input
            label="Last Name"
            {...register('last_name')}
            type="text"
            variant="outline"
            className="mb-4"
            required
            error={t(errors.last_name?.message!)}
          />
          <Input
            label="Nic Number"
            {...register('nic_number')}
            type="text"
            variant="outline"
            className="mb-4"
            required
            error={t(errors.nic_number?.message!)}
          />
          <Input
            label="Phone Number"
            {...register('phone_number')}
            type="text"
            variant="outline"
            className="mb-4"
            required
            error={t(errors.phone_number?.message!)}
          />
          <div className="mb-5">
            <SelectInput
              label="Gender"
              name="gender"
              control={control}
              options={genderTypeOptions}
              required
            />
            <ValidationError message={t(errors.gender?.message)} />
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Guardian' : 'Add Guardian'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateGuardianForm;
