import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { GradeType, RoleType, Student, User } from '@/types';
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
import { toast } from 'react-toastify';

type FormValues = {
  user: User;
  student_number: string;
  grade: { label: string; value: GradeType };
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
          user: initialValues?.user,
          student_number: initialValues.student_number,
          grade: gradeOptions.find(
            (gradeOption) => gradeOption.value == initialValues.grade,
          ),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(studentValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      grade: values.grade.value,
      student_number: values.student_number,
      user: {
        full_name: values.user.full_name,
        first_name: values.user.first_name,
        last_name: values.user.last_name,
        name_with_initials: values.user.name_with_initials,
        username: values.user.username,
        email: values.user.email,
        password: values.password,
        role: RoleType.STUDENT,
      },
    };
    try {
      if (!initialValues) {
        await createStudent(input);
      } else {
        await updateStudent({ ...input, id: initialValues.id });
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
          details={t('form:student-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Full Name"
            {...register('user.full_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors?.user?.full_name?.message!)}
            required
          />
          <Input
            label="First Name"
            {...register('user.first_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors?.user?.full_name?.message!)}
            required
          />
          <Input
            label="Last Name"
            {...register('user.last_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors?.user?.last_name?.message!)}
            required
          />
          <Input
            label="Name with Initials"
            {...register('user.name_with_initials')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors?.user?.name_with_initials?.message!)}
            required
          />
          <Input
            label="Username"
            {...register('user.username')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors?.user?.username?.message!)}
            required
          />
          <Input
            label="Email"
            {...register('user.email')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors?.user?.email?.message!)}
            required
          />
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
