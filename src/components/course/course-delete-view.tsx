import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteCourseMutation } from '@/data/course';

const CourseDeleteView = () => {
  const { mutate: deleteCourse, isLoading: loading } =
    useDeleteCourseMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteCourse({
      id: modalData as string,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default CourseDeleteView;
