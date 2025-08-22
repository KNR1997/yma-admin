import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse, Hall, Student } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { admissionValidationSchema } from './admission-payment-validation-schema';
import { useCreateHallMutation, useUpdateHallMutation } from '@/data/hall';
import { getErrorMessage } from '@/utils/form-error';
import { useCreateAdmissionPaymentMutation } from '@/data/payment';
import { useStudentsQuery } from '@/data/student';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

type FormValues = {
  student: Student;
  admission: number;
};

const defaultValues = {};

function SelectStudent({
  control,
  errors,
  disabled,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { students, loading } = useStudentsQuery({});
  return (
    <div className="mb-5">
      <SelectInput
        label="Student"
        name="student"
        control={control}
        getOptionLabel={(option: any) =>
          `${option?.student_number} - ${option?.grade}`
        }
        getOptionValue={(option: any) => option.id}
        options={students!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.student?.message)} />
    </div>
  );
}

type IProps = {
  initialValues?: Hall;
};

const CreateOrUpdateAdmissionPaymentForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createAdmissionPayment, isLoading: creating } =
    useCreateAdmissionPaymentMutation();
  const { mutateAsync: updateHall, isLoading: updating } =
    useUpdateHallMutation();

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
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(admissionValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      student_id: values.student.id,
      admission: values.admission,
    };

    try {
      if (!initialValues) {
        await createAdmissionPayment(input);
      } else {
        await updateHall({
          ...input,
          id: initialValues.id,
        });
      }
    } catch (error: any) {
      const err = error.response?.data as ErrorResponse;
      if (err?.validation) {
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
          <SelectStudent
            control={control}
            errors={errors}
            disabled={!!initialValues}
          />
          <Input
            label="Admission"
            type="number"
            {...register('admission')}
            variant="outline"
            className="mb-4"
            error={t(errors.admission?.message!)}
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

export default CreateOrUpdateAdmissionPaymentForm;
