import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteStudentMutation } from '@/data/student';

const StudentDeleteView = () => {
  const { mutate: deleteStudent, isLoading: loading } =
    useDeleteStudentMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteStudent({
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

export default StudentDeleteView;
