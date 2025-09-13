import * as yup from 'yup';

export const studentValidationSchema = yup.object().shape({
  user: yup.object().shape({
    full_name: yup.string().required('Full Name is required!'),
    first_name: yup.string().required('First Name is required!'),
    last_name: yup.string().required('Last Name is required!'),
    name_with_initials: yup
      .string()
      .required('Name with initials is required!'),
    username: yup.string().required('Username is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  }),
  student_number: yup.string().required('Student Number is required'),
  grade: yup.object().required('Grade is required'),
});
