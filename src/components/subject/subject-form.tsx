import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { subjectValidationSchema } from './subject-validation-schema';
import { ErrorResponse, Subject } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from '@/data/subject';
import { generateSubjectCode } from '@/utils/use-code-generate';
import { getErrorMessage } from '@/utils/form-error';

type FormValues = {
  name: string;
  code: string;
};

const defaultValues = {
  // name: '',
  // password: '',
};

type IProps = {
  initialValues?: Subject;
};

const CreateOrUpdateSubjectForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const { mutateAsync: createSubject, isLoading: creating } =
    useCreateSubjectMutation();
  const { mutateAsync: updateSubject, isLoading: updating } =
    useUpdateSubjectMutation();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(subjectValidationSchema),
  });

  const name = watch('name');
  const subjectCode = generateSubjectCode(name);

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      code: subjectCode,
    };

    try {
      if (!initialValues) {
        await createSubject(input);
      } else {
        await updateSubject({
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
          details={t('form:subject-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
            required
          />
          <Input
            label="Code"
            {...register('code')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.code?.message!)}
            disabled
            value={subjectCode}
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Subject' : 'Add Subject'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateSubjectForm;
