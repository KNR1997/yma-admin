import StoreNoticeDeleteView from '@/components/store-notice/store-notice-delete-view';
import Modal from '@/components/ui/modal/modal';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';

const GuardianDeleteView = dynamic(
  () => import('@/components/guardian/guardian-delete-view'),
);
const CourseEnableDisableView = dynamic(
  () => import('@/components/course/course-enable-disable-view'),
);
const HallDeleteView = dynamic(
  () => import('@/components/hall/hall-delete-view'),
);
const StudentDeleteView = dynamic(
  () => import('@/components/student/student-delete-view'),
);
const SubjectDeleteView = dynamic(
  () => import('@/components/subject/subject-delete-view'),
);
const CourseDeleteView = dynamic(
  () => import('@/components/course/course-delete-view'),
);
const UserPasswordRestView = dynamic(
  () => import('@/components/user/user-password-reset-view'),
);
const RoleDeleteView = dynamic(
  () => import('@/components/roles/role-delete-view'),
);
const MakeAdminView = dynamic(
  () => import('@/components/user/make-admin-view'),
);
const ReviewImageModal = dynamic(
  () => import('@/components/reviews/review-image-modal'),
);
const ReviewDeleteView = dynamic(
  () => import('@/components/reviews/review-delete-view'),
);
const AcceptAbuseReportView = dynamic(
  () => import('@/components/reviews/acccpt-report-confirmation'),
);
const DeclineAbuseReportView = dynamic(
  () => import('@/components/reviews/decline-report-confirmation'),
);
const RefundReasonDeleteView = dynamic(
  () => import('@/components/refund-reason/refund-reason-delete-view'),
);
const AbuseReport = dynamic(() => import('@/components/reviews/abuse-report'));
const OpenAiModal = dynamic(() => import('@/components/openAI/openAI.modal'));
const ComposerMessage = dynamic(
  () => import('@/components/message/compose-message'),
);
const SearchModal = dynamic(
  () => import('@/components/layouts/topbar/search-modal'),
);
const DescriptionView = dynamic(
  () => import('@/components/shop-single/description-modal'),
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'DELETE_STORE_NOTICE':
      return <StoreNoticeDeleteView />;
    case 'MAKE_ADMIN':
      return <MakeAdminView />;
    case 'DELETE_REVIEW':
      return <ReviewDeleteView />;
    case 'ACCEPT_ABUSE_REPORT':
      return <AcceptAbuseReportView />;
    case 'DECLINE_ABUSE_REPORT':
      return <DeclineAbuseReportView />;
    case 'REVIEW_IMAGE_POPOVER':
      return <ReviewImageModal />;
    case 'ABUSE_REPORT':
      return <AbuseReport data={data} />;
    case 'GENERATE_DESCRIPTION':
      return <OpenAiModal />;
    case 'COMPOSE_MESSAGE':
      return <ComposerMessage />;
    case 'SEARCH_VIEW':
      return <SearchModal />;
    case 'DESCRIPTION_VIEW':
      return <DescriptionView />;
    case 'DELETE_REFUND_REASON':
      return <RefundReasonDeleteView />;
    case 'DELETE_ROLE':
      return <RoleDeleteView />;
    case 'REST_USER_PASSWORD_VIEW':
      return <UserPasswordRestView />;
    case 'DELETE_SUBJECT':
      return <SubjectDeleteView />;
    case 'DELETE_COURSE':
      return <CourseDeleteView />;
    case 'DELETE_STUDENT':
      return <StudentDeleteView />;
    case 'DELETE_HALL':
      return <HallDeleteView />;
    case 'COURSE_DISABLE_VIEW':
      return <CourseEnableDisableView />;
    case 'DELETE_GUARDIAN':
      return <GuardianDeleteView />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
