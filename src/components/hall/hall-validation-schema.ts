import * as yup from 'yup';

export const hallValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required!'),
  capacity: yup
    .number()
    .typeError('Capacity must be a number')
    .positive('Capacity must be positive')
    .required('Capacity is required!'),
});
