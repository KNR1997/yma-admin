import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteGuardianMutation } from '@/data/guardian';

const GuardianDeleteView = () => {
  const { mutate: deleteGuardian, isLoading: loading } =
    useDeleteGuardianMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteGuardian({
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

export default GuardianDeleteView;
