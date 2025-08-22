import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const userValidationSchema = yup.object().shape({
  full_name: yup.string().required('Full Name is Required!'),
  first_name: yup.string().required('First Name is Required!'),
  last_name: yup.string().required('Last Name is Required!'),
  name_with_initials: yup.string().required('Name with initials is Required!'),
  nic: yup.string().required('Nic number is Required!'),
  username: yup.string().required('form:error-username-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  // password: yup
  //   .string()
  //   .required('form:error-password-required')
  //   .matches(passwordRules, {
  //     message:
  //       'Please create a stronger password. hint: Min 8 characters, 1 Upper case letter, 1 Lower case letter, 1 Numeric digit.',
  //   }),
});
