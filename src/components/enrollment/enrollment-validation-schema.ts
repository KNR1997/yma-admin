import * as yup from 'yup';

export const enrollmentValidationSchema = yup.object().shape({
  student: yup.object().required('Student is required!'),
  course: yup.object().required('Course is required!'),
});
