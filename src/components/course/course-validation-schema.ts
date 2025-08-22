import * as yup from 'yup';

export const courseValidationSchema = yup.object().shape({
  subject: yup.object().required('Subject is required!'),
  teacher: yup.object().required('Teacher is required!'),
  grade: yup.object().required('Grade is required!'),
  batch: yup.string().required('Batch is required!'),
});
