import * as yup from 'yup';

export const guardianValidationSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required!'),
  last_name: yup.string().required('Last Name  is required!'),
  nic_number: yup
    .string()
    .required('NIC number is required')
    .matches(
      /^(\d{9}[vV]|\d{12})$/,
      'NIC number must be in the format 123456789V or 200012345678',
    ),
  phone_number: yup
    .string()
    .required('Phone Number is required')
    .matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),
  gender: yup.object().required('Gender is required!'),
});
