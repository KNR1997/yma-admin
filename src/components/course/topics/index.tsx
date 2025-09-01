import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import Card from '@/components/common/card';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useFieldArray, useForm } from 'react-hook-form';
import { CourseTopic, ErrorResponse } from '@/types';
import Button from '@/components/ui/button';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { SaveIcon } from '@/components/icons/save';
import { useConfirmRedirectIfDirty } from '@/utils/confirmed-redirect-if-dirty';
import { useCreateOrUpdateCourseTopicsMutation } from '@/data/course';
import { getErrorMessage } from '@/utils/form-error';
import {
  CourseTopicsFormValues,
  getCourseTopicInputValues,
} from './form-utils';

type IProps = {
  courseId: string;
  courseTopics: CourseTopic[];
};

export default function CourseTopicsForm({ courseId, courseTopics }: IProps) {
  const { t } = useTranslation();

  const { mutateAsync: createUpdateCourseTopics, isLoading: loading } =
    useCreateOrUpdateCourseTopicsMutation();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<CourseTopicsFormValues>({
    shouldUnregister: true,
    defaultValues: {
      course_topics: courseTopics ? courseTopics : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'course_topics',
  });

  async function onSubmit(values: CourseTopicsFormValues) {
    // console.log('data: ', values?.course_topics);
    const inputValues = {
      course_id: courseId,
      ...getCourseTopicInputValues(values, courseTopics),
    };
    try {
      await createUpdateCourseTopics(inputValues);
      reset(values, { keepValues: true });
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
  }

  useConfirmRedirectIfDirty({ isDirty });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
        <Description
          title="Course Topics"
          details={t('form:course-topics-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            {fields.map((item: any & { id: string }, index: number) => (
              <div
                className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                key={item.id}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                  <div className="grid grid-cols-1 gap-5 sm:col-span-4">
                    <Input
                      label="Name"
                      toolTipText={t('form:input-tooltip-shop-title')}
                      variant="outline"
                      {...register(`course_topics.${index}.id` as const)}
                      error={t(errors?.course_topics?.[index]?.id?.message)}
                      className="hidden"
                    />
                    <Input
                      label="Name"
                      toolTipText={t('form:input-tooltip-shop-title')}
                      variant="outline"
                      {...register(`course_topics.${index}.name` as const)}
                      defaultValue={item?.title!} // make sure to set up defaultValue
                      error={t(errors?.course_topics?.[index]?.name?.message)}
                    />
                    <TextArea
                      label={t('form:input-delivery-time-description')}
                      toolTipText={t('form:input-tooltip-shop-description')}
                      variant="outline"
                      {...register(
                        `course_topics.${index}.description` as const,
                      )}
                      defaultValue={item.description!} // make sure to set up defaultValue
                    />
                  </div>

                  <button
                    onClick={() => {
                      remove(index);
                    }}
                    type="button"
                    className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                  >
                    {t('form:button-label-remove')}
                  </button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ id: null, name: '', description: '' })}
              className="w-full sm:w-auto"
            >
              Add Topic
            </Button>
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <Button
          loading={loading}
          disabled={loading || !Boolean(isDirty)}
          className="text-sm md:text-base"
        >
          <SaveIcon className="relative w-6 h-6 top-px shrink-0 ltr:mr-2 rtl:pl-2" />
          {t('form:button-label-save-settings')}
        </Button>
      </StickyFooterPanel>
    </form>
  );
}
