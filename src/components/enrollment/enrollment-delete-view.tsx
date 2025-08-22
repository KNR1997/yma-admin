import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteHallMutation } from '@/data/hall';

const HallDeleteView = () => {
  const { mutate: deleteHall, isLoading: loading } =
    useDeleteHallMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteHall({
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

export default HallDeleteView;
