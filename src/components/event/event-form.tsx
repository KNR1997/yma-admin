import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Course,
  ErrorResponse,
  Event,
  EventStatusType,
  EventType,
  Hall,
} from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { eventValidationSchema } from './event-validation-schema';
import SelectInput from '@/components/ui/select-input';
import { getErrorMessage } from '@/utils/form-error';
import { useCreateEventMutation, useUpdateEventMutation } from '@/data/event';
import { useRouter } from 'next/router';
import { useCoursesQuery } from '@/data/course';
import ValidationError from '@/components/ui/form-validation-error';
import { eventTypeOptions } from '@/constants';

type FormValues = {
  course: Course;
  event_type: { label: string; value: EventType };
  date: string;
  start_time: string;
  end_time: string;
};

const defaultValues = {};

type IProps = {
  initialValues?: Event;
};

function SelectCourse({
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
  const { courses, loading } = useCoursesQuery({ language: locale });
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

const CreateOrUpdateEventForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createEvent, isLoading: creating } =
    useCreateEventMutation();
  const { mutateAsync: updateEvent, isLoading: updating } =
    useUpdateEventMutation();

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
          event_type: eventTypeOptions.find(
            (event) => event.value == initialValues.event_type,
          ),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(eventValidationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      event_type: values.event_type.value,
      course_id: values.course.id,
      date: values.date,
      start_time: values.start_time,
      end_time: values.end_time,
      status: EventStatusType.PENDING,
    };

    try {
      if (!initialValues) {
        await createEvent(input);
      } else {
        await updateEvent({
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
          <SelectCourse
            control={control}
            errors={errors}
            disabled={!!initialValues}
          />
          <div className="mb-5">
            <SelectInput
              label="Event Type"
              name="event_type"
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={eventTypeOptions!}
              required
              // disabled={disabled}
            />
            <ValidationError message={t(errors.event_type?.message)} />
          </div>
          <Input
            label="Date"
            type="date"
            {...register('date')}
            variant="outline"
            className="mb-4"
            error={t(errors.date?.message!)}
            required
          />
          <Input
            label="Start Time"
            type="time"
            {...register('start_time')}
            variant="outline"
            className="mb-4"
            error={t(errors.start_time?.message!)}
            required
          />
          <Input
            label="End Time"
            type="time"
            {...register('end_time')}
            variant="outline"
            className="mb-4"
            error={t(errors.end_time?.message!)}
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
            {initialValues ? 'Update Event' : 'Add Event'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateEventForm;
