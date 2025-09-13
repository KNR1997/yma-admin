import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Course,
  CourseType,
  GradeType,
  Subject,
  User,
} from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '@/data/course';
import { courseValidationSchema } from './course-validation-schema';
import SelectInput from '@/components/ui/select-input';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useSubjectsQuery } from '@/data/subject';
import { useUsersQuery } from '@/data/user';
import {
  generateCourseCode,
  generateCourseName,
} from '@/utils/use-code-generate';
import { courseTypeOptions, gradeOptions } from '@/constants';
import { toast } from 'react-toastify';

type FormValues = {
  subject: Subject;
  teacher: User;
  grade: { label: string; value: GradeType };
  course_type: { label: string; value: CourseType };
  batch: number;
  code: string;
  name: string;
  fee: number | null;
};

const defaultValues = {
  fee: null,
};

type IProps = {
  initialValues?: Course;
};

function SelectSubject({
  control,
  errors,
  disabled,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { subjects, loading } = useSubjectsQuery({ language: locale });
  return (
    <div className="mb-5">
      <SelectInput
        label="Subject"
        name="subject"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={subjects!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.subject?.message)} />
    </div>
  );
}

function SelectTeacher({
  control,
  errors,
  disabled,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { users, loading } = useUsersQuery({
    role: 'Teacher',
  });
  return (
    <div className="mb-5">
      <SelectInput
        label="Teacher"
        name="teacher"
        control={control}
        getOptionLabel={(option: any) =>
          `${option?.first_name} ${option?.last_name}`
        }
        getOptionValue={(option: any) => option.id}
        options={users!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.teacher?.message)} />
    </div>
  );
}

const CreateOrUpdateCourseForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();

  const { mutateAsync: createCourse, isLoading: creating } =
    useCreateCourseMutation();
  const { mutateAsync: updateCourse, isLoading: updating } =
    useUpdateCourseMutation();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
          grade: gradeOptions.find(
            (gradeType) => gradeType.value === initialValues.grade,
          ),
          course_type: courseTypeOptions.find(
            (courseTypeOption) =>
              courseTypeOption.value == initialValues.course_type,
          ),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(courseValidationSchema),
  });

  const gradeType = watch('grade');
  const subject = watch('subject');
  const teacher = watch('teacher');
  const batch = watch('batch');

  const courseName = generateCourseName(
    gradeType?.value,
    subject?.name,
    teacher?.first_name,
    teacher?.last_name,
    batch,
  );
  const courseCode = generateCourseCode(
    gradeType?.value,
    subject?.code,
    teacher?.first_name,
    teacher?.last_name,
    batch,
  );

  const onSubmit = async (values: FormValues) => {
    // Payload data
    const input = {
      subject_id: values.subject.id,
      teacher_id: values.teacher.id,
      batch: values.batch,
      grade: values.grade.value,
      name: courseName,
      code: courseCode,
      course_type: values.course_type.value,
      fee: values.fee,
    };

    try {
      if (!initialValues) {
        await createCourse(input);
      } else {
        await updateCourse({
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
          <SelectSubject
            control={control}
            errors={errors}
            disabled={!!initialValues}
          />
          <SelectTeacher
            control={control}
            errors={errors}
            disabled={!!initialValues}
          />
          <div className="mb-5">
            <SelectInput
              label="Grade"
              name="grade"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={gradeOptions}
              required={true}
              disabled={!!initialValues}
            />
            <ValidationError message={t(errors.grade?.message)} />
          </div>
          <Input
            label="Batch"
            {...register('batch')}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.batch?.message!)}
            disabled={!!initialValues}
            required
          />
          <Input
            label="Course Fee"
            {...register('fee')}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.fee?.message!)}
            {...register('fee', {
              setValueAs: (v) => (v === '' ? null : Number(v)),
            })}
          />
          <div className="mb-5">
            <SelectInput
              label="Course Type"
              name="course_type"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={courseTypeOptions}
              required
            />
            <ValidationError message={t(errors.grade?.message)} />
          </div>
          <Input
            label="Course Name"
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
            disabled
            value={courseName}
          />
          <Input
            label="Course Code"
            {...register('code')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.code?.message!)}
            disabled
            value={courseCode}
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Course' : 'Add Course'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateCourseForm;
