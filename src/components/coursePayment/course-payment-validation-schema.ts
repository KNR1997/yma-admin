import * as yup from 'yup';

export const admissionValidationSchema = yup.object().shape({
  student: yup.object().required('Student is required!'),
  // admission: yup
  //   .number()
  //   .typeError('Admission fee must be a number')
  //   .positive('Admission fee must be positive')
  //   .required('Admission fee is required!'),
});
