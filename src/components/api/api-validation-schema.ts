import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const apiValidationSchema = yup.object().shape({
  path: yup.string().required('form:error-name-required'),
  method: yup.object().required('form:error-name-required'),
});
