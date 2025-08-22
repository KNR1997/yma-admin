import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorResponse, GradeType, Student } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { studentValidationSchema } from './student-validation-schema';
import PasswordInput from '@/components/ui/password-input';
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from '@/data/student';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { gradeOptions } from '@/constants';
import { getErrorMessage } from '@/utils/form-error';

type FormValues = {
  grade: { label: string; value: GradeType };
  username: string;
  email: string;
  student_number: string;
  password: string;
};

const defaultValues = {
  // name: '',
  // password: '',
};

type IProps = {
  initialValues?: Student;
};

const CreateOrUpdateStudentForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();

  const { mutateAsync: createStudent, isLoading: creating } =
    useCreateStudentMutation();
  const { mutateAsync: updateStudent, isLoading: updating } =
    useUpdateStudentMutation();

  const {
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          grade: gradeOptions.find(
            (gradeOption) => gradeOption.value == initialValues.grade,
          ),
          student_number: initialValues.student_number,
          username: initialValues?.user?.username,
          email: initialValues?.user?.email,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(studentValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      grade: values.grade.value,
      student_number: values.student_number,
      user_create: {
        username: values.username,
        email: values.email,
        password: values.password,
      },
    };
    try {
      if (!initialValues) {
        await createStudent(input);
      } else {
        await updateStudent({ ...input, id: initialValues.id });
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
          details={t('form:student-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <SelectInput
              label="Grade"
              name="grade"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={gradeOptions}
              placeholder="Select Grade"
              required={true}
            />
            <ValidationError message={t(errors.grade?.message)} />
          </div>
          <Input
            label="Username"
            {...register('username')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.username?.message!)}
            required
          />
          <Input
            label="Email"
            {...register('email')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
            required
          />
          <Input
            label="Student No."
            {...register('student_number')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.student_number?.message!)}
            required
            disabled={initialValues != null}
          />
          {!initialValues && (
            <PasswordInput
              label={t('form:input-label-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-4"
              required
            />
          )}
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateStudentForm;
