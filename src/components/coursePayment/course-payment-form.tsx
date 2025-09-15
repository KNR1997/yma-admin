import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Course, ErrorResponse, Hall, Student } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { admissionValidationSchema } from './course-payment-validation-schema';
import { useUpdateHallMutation } from '@/data/hall';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateCoursePaymentMutation,
} from '@/data/payment';
import { useStudentsQuery } from '@/data/student';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { useStudentEnrolledCoursesQuery } from '@/data/student';
import { monthOptions } from '@/constants';

type FormValues = {
  student: Student;
  courses: Course[];
  amount: number;
  month: { label: string; value: number };
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

function SelectCourse({
  control,
  errors,
  disabled,
  selectedStudent,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  disabled?: boolean;
  selectedStudent?: Student;
}) {
  const { t } = useTranslation();
  const { courses, loading } = useStudentEnrolledCoursesQuery({
    student_id: selectedStudent?.id,
  });

  return (
    <div className="mb-5">
      <SelectInput
        label="Course"
        name="courses"
        control={control}
        getOptionLabel={(option: any) => `${option.name} - Rs. ${option.fee}`}
        getOptionValue={(option: any) => option.id}
        options={courses!}
        isLoading={loading}
        required
        disabled={disabled}
        isMulti
      />
      <ValidationError message={t(errors.courses?.message)} />
    </div>
  );
}

type IProps = {
  initialValues?: Hall;
};

const CreateOrUpdateCoursePaymentForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createCoursePayment, isLoading: creating } =
    useCreateCoursePaymentMutation();
  const { mutateAsync: updateHall, isLoading: updating } =
    useUpdateHallMutation();

  const {
    control,
    watch,
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

  const selectedStudent = watch('student');
  const selectedCourses = watch('courses');

  const totalPayment = selectedCourses?.reduce(
    (sum, course) => sum + (course.fee || 0),
    0,
  );

  const onSubmit = async (values: FormValues) => {
    const currentYear = new Date().getFullYear();

    const input = {
      student_id: values.student.id,
      course_ids: selectedCourses.map((selectedCourse) => selectedCourse.id),
      month_number: values.month.value,
      amount: totalPayment,
      year_number: currentYear,
    };

    // console.log('input: ', input);

    try {
      if (!initialValues) {
        await createCoursePayment(input);
      } else {
        await updateHall({
          ...input,
          id: initialValues.id,
        });
      }
    } catch (error: any) {
      const err = error?.response?.data as ErrorResponse;
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
          <SelectCourse
            control={control}
            errors={errors}
            disabled={!!initialValues}
            selectedStudent={selectedStudent}
          />

          <div className="mb-5">
            <SelectInput
              label="Payment Month"
              name="month"
              control={control}
              options={monthOptions}
              // isLoading={loading}
              required
              // disabled={disabled}
            />
            <ValidationError message={t(errors.month?.message)} />
          </div>
          <Input
            label="Amount"
            type="number"
            {...register('amount')}
            variant="outline"
            className="mb-4"
            error={t(errors.amount?.message!)}
            value={totalPayment}
            disabled
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Payment' : 'Add Payment'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateCoursePaymentForm;
