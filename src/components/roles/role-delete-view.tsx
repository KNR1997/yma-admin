import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteRoleMutation } from '@/data/role';

const RoleDeleteView = () => {
  const { mutate: deleteRole, isLoading: loading } =
    useDeleteRoleMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteRole({
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

export default RoleDeleteView;
