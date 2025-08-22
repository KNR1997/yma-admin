import * as yup from 'yup';

export const studentValidationSchema = yup.object().shape({
  grade: yup.object().required('Grade is required'),
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('Email is required'),
  student_number: yup.string().required('Student Number is required'),
  // password: yup.string().required('form:error-password-required'),
});
