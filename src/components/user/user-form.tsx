import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { Control, FieldErrors, useForm, useWatch } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useCreateUserMutation, useUpdateUserMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Role, RoleType, User } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { useRouter } from 'next/router';
import { userValidationSchema } from './user-validation-schema';
import ValidationError from '@/components/ui/form-validation-error';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { toast } from 'react-toastify';
import { roleOptions } from '@/constants';

type FormValues = {
  full_name: string;
  first_name: string;
  last_name: string;
  name_with_initials: string;
  nic: string;
  username: string;
  email: string;
  password: string;
  // roles: Role[];
  role: {label: string, value: RoleType};
};

const defaultValues = {
  username: '',
  password: '',
};

type IProps = {
  initialValues?: User;
};

function SelectRoles({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  return (
    <div className="mb-5">
      <Label>Roles</Label>
      <SelectInput
        name="role"
        control={control}
        getOptionLabel={(option: any) => option.label}
        getOptionValue={(option: any) => option.value}
        options={roleOptions!}
        // isMulti
      />
      <ValidationError message={t(errors.roles?.message)} />
    </div>
  );
}

const CreateOrUpdateUserForm = ({ initialValues }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: createUser, isLoading: creating } = useCreateUserMutation();
  const { mutate: updateUser, isLoading: updating } = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          ...initialValues,
          role: roleOptions.find((roleOption) => roleOption.value == initialValues.role)
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(userValidationSchema),
  });

  async function onSubmit(values: FormValues) {
    const input = {
      full_name: values.full_name,
      first_name: values.first_name,
      last_name: values.last_name,
      name_with_initials: values.name_with_initials,
      nic: values.nic,
      username: values.username,
      email: values.email,
      password: values.password,
      is_active: true,
      is_superuser: false,
      role: values.role.value,
    };
    const handleFieldErrors = (error: any) => {
      try {
        const fieldErrors = error?.response?.data?.msg?.data;

        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof FormValues, {
              type: 'manual',
              message: (messages as string[])[0],
            });
          });
        } else {
          // Not a field validation error — show toast
          toast.error('Something went wrong!');
        }
      } catch (err) {
        // Fallback if error shape is unexpected
        toast.error('Something went wrong!');
      }
    };
    if (!initialValues) {
      createUser(input, {
        onError: handleFieldErrors,
      });
    } else {
      updateUser(
        {
          id: initialValues.id,
          input,
        },
        {
          onError: handleFieldErrors,
        },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Full Name"
            {...register('full_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.full_name?.message!)}
            required
          />
          <Input
            label="First Name"
            {...register('first_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.first_name?.message!)}
            required
          />
          <Input
            label="Last Name"
            {...register('last_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.username?.message!)}
            required
          />
          <Input
            label="Name with Initials"
            {...register('name_with_initials')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name_with_initials?.message!)}
            required
          />
          <Input
            label="Nic"
            {...register('nic')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.nic?.message!)}
            required
          />
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
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
            required
          />
          <SelectRoles control={control} errors={errors} />
          {!initialValues && (
            <PasswordInput
              label={t('form:input-label-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-4"
              // required
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
            {initialValues ? 'Update User' : 'Add User'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default CreateOrUpdateUserForm;
