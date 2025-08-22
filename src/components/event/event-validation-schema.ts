import * as yup from 'yup';

export const eventValidationSchema = yup.object().shape({
  course: yup.object().required('Course is required!'),
  date: yup.string().required('Date is required!'),
  start_time: yup.string().required('Start Time is required!'),
  end_time: yup.string().required('End Time is required!'),
});
