import ConfirmationCard from '@/components/common/confirmation-card';
import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import {
  useDisableCourseMutation,
  useEnableCourseMutation,
} from '@/data/course';

const CourseEnableDisableView = () => {
  const { mutate: disableCourse, isLoading: disabling } =
    useDisableCourseMutation();
  const { mutate: enableCourse, isLoading: enabling } =
    useEnableCourseMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  const isEnable = data?.type === 'enable';
  const mutation = isEnable ? enableCourse : disableCourse;

  async function handleEnableOrDisable() {
    mutation(
      { id: data?.id },
      {
        onSettled: closeModal,
      },
    );
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleEnableOrDisable}
      deleteBtnLoading={disabling || enabling}
      deleteBtnText={isEnable ? 'Enable' : 'Disable'}
      icon={<CheckMarkCircle className="m-auto mt-4 h-10 w-10 text-accent" />}
      deleteBtnClassName="!bg-accent focus:outline-none hover:!bg-accent-hover focus:!bg-accent-hover"
      cancelBtnClassName="!bg-red-600 focus:outline-none hover:!bg-red-700 focus:!bg-red-700"
      title="text-shop-approve-description"
      description={`Are you sure you want to ${
        isEnable ? 'enable' : 'disable'
      } this course?`}
    />
  );
};

export default CourseEnableDisableView;
