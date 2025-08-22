import { SUPER_ADMIN, STUDENT } from '@/utils/constants';
import dynamic from 'next/dynamic';
import StudentLayout from './student';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  } else if (userPermissions?.includes(STUDENT)) {
    return <StudentLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}
