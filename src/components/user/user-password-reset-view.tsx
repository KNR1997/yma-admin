import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import ConfirmationCard from '@/components/common/confirmation-card';
import { useResetPasswordMutation } from '@/data/user';
import { ReloadIcon } from '../icons/reload';

const UserPasswordRestView = () => {
  const { mutate: resetPassword, isLoading: loading } =
    useResetPasswordMutation();
  const { data } = useModalState();

  const { closeModal } = useModalAction();

  async function handleResetPassword() {
    resetPassword({ user_id: data });
    closeModal();
  }

  return (
    <ConfirmationCard
      icon={<ReloadIcon className="w-10 h-10 m-auto mt-4 text-accent" />}
      onCancel={closeModal}
      onDelete={handleResetPassword}
      deleteBtnText="text-yes"
      title="Reset User Password"
      description="Are you sure you want to reset password to 123456?"
      deleteBtnLoading={loading}
    />
  );
};

export default UserPasswordRestView;
