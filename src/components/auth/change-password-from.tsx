import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { toast } from 'react-toastify';
import PasswordInput from '@/components/ui/password-input';
import { useChangePasswordMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ErrorResponse } from '@/types';
import { getErrorMessage } from '@/utils/form-error';

interface FormValues {
  old_password: string;
  new_password: string;
  passwordConfirmation: string;
}

const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required('form:error-old-password-required'),
  new_password: yup.string().required('form:error-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('new_password')], 'form:error-match-passwords')
    .required('form:error-confirm-password'),
});

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { mutate: changePassword, isLoading: loading } =
    useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  async function onSubmit(values: FormValues) {
    changePassword(
      {
        old_password: values.old_password,
        new_password: values.new_password,
      },
      {
        onError: (error: any) => {
          const err = error.response?.data as ErrorResponse;
          if (err.validation) {
            const serverErrors = getErrorMessage(error?.response?.data);
            Object.keys(serverErrors?.validation).forEach((field: any) => {
              setError(field, {
                type: 'manual',
                message: serverErrors?.validation[field][0],
              });
            });
          } else {
            toast.error(error?.response?.data.error ?? 'Something went wrong!');
          }
        },
        onSuccess: (data) => {
          // if (!data?.success) {
          //   setError('old_password', {
          //     type: 'manual',
          //     message: data?.message ?? '',
          //   });
          // } else if (data?.success) {
          //   toast.success(t('common:password-changed-successfully'));
          //   reset();
          // }
          toast.success(t('common:password-changed-successfully'));
          reset();
        },
      },
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-password')}
          details={t('form:password-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />

        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <PasswordInput
            label={t('form:input-label-old-password')}
            {...register('old_password')}
            variant="outline"
            error={t(errors.old_password?.message!)}
            className="mb-5"
          />
          <PasswordInput
            label={t('form:input-label-new-password')}
            {...register('new_password')}
            variant="outline"
            error={t(errors.new_password?.message!)}
            className="mb-5"
          />
          <PasswordInput
            label={t('form:input-label-confirm-password')}
            {...register('passwordConfirmation')}
            variant="outline"
            error={t(errors.passwordConfirmation?.message!)}
          />
        </Card>

        <div className="text-end w-full">
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-change-password')}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default ChangePasswordForm;
