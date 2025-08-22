import Button from '@/components/ui/button';
import { useForm, Control, FieldErrors } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Course, Enrollment, ErrorResponse, Student } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { enrollmentValidationSchema } from './enrollment-validation-schema';
import SelectInput from '@/components/ui/select-input';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from '@/data/enrollment';
import ValidationError from '@/components/ui/form-validation-error';
import { useRouter } from 'next/router';
import {
  useCoursesAvailableForStudentQuery,
} from '@/data/course';
import { useStudentsQuery } from '@/data/student';

type FormValues = {
  student: Student;
  course: Course;
  capacity: number;
};

const defaultValues = {};

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
  const { courses, loading } = useCoursesAvailableForStudentQuery({
    student_id: selectedStudent?.id,
  });

  return (
    <div className="mb-5">
      <SelectInput
        label="Course"
        name="course"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={courses!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.course?.message)} />
    </div>
  );
}

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
  initialValues?: Enrollment;
};

const CreateOrUpdateEnrollmentForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createEnrollment, isLoading: creating } =
    useCreateEnrollmentMutation();
  const { mutateAsync: updateEnrollment, isLoading: updating } =
    useUpdateEnrollmentMutation();

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
    resolver: yupResolver(enrollmentValidationSchema),
  });

  const selectedStudent = watch('student');

  const onSubmit = async (values: FormValues) => {
    const input = {
      course_id: values.course.id,
      student_id: values.student.id,
    };

    console.log('input: ', input)

    try {
      if (!initialValues) {
        await createEnrollment(input);
      } else {
        await updateEnrollment({
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
          <SelectCourse
            control={control}
            errors={errors}
            disabled={!!initialValues}
            selectedStudent={selectedStudent}
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Enrollment' : 'Add Enrollment'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateEnrollmentForm;
