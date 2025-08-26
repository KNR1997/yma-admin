import { SUPER_ADMIN, STUDENT, TEACHER } from '@/utils/constants';
import dynamic from 'next/dynamic';
import StudentLayout from './student';
import TeacherLayout from './teacher';

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
  } else if (userPermissions?.includes(TEACHER)) {
    return <TeacherLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}
