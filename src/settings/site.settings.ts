import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  ownerAndStaffOnly,
  studentOnly,
  teacherOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

export const siteSettings = {
  name: 'PickBazar',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'PickBazar',
    href: '/',
    width: 138,
    height: 34,
  },
  collapseLogo: {
    url: '/collapse-logo.svg',
    alt: 'P',
    href: '/',
    width: 32,
    height: 32,
  },
  defaultLanguage: 'en',
  author: {
    name: 'RedQ',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'authorized-nav-item-profile',
      icon: 'UserIcon',
      permission: adminOwnerAndStaffOnly,
    },
    {
      href: Routes.settings,
      labelTransKey: 'authorized-nav-item-settings',
      icon: 'SettingsIcon',
      permission: adminOnly,
    },
    {
      href: Routes.logout,
      labelTransKey: 'authorized-nav-item-logout',
      icon: 'LogOutIcon',
      permission: adminOwnerAndStaffOnly,
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: {
      root: {
        href: Routes.dashboard,
        label: 'Main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: Routes.dashboard,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },
        ],
      },

      system: {
        href: '',
        label: 'System Management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: '',
            label: 'System Management',
            icon: 'SettingsIcon',
            childMenu: [
              {
                href: Routes.user.list,
                label: 'User Management',
                icon: 'UsersIcon',
              },
              {
                href: Routes.role.list,
                label: 'Role Management',
                icon: 'AdminListIcon',
              },
              // {
              //   href: Routes.department.list,
              //   label: 'Department Management',
              //   icon: 'HomeIcon',
              // },
              // {
              //   href: Routes.system.menuManagement,
              //   label: 'Menu Management',
              //   icon: 'AdminListIcon',
              // },
              {
                href: Routes.api.list,
                label: 'API Management',
                icon: 'TransactionsIcon',
              },
              {
                href: Routes.audtiLog.list,
                label: 'Audit Log',
                icon: 'TransactionsIcon',
              },
            ],
          },
        ],
      },

      content: {
        href: '',
        label: 'Academic Management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.subject.list,
            label: 'Subjects',
            icon: 'DiaryIcon',
          },
          {
            href: Routes.course.list,
            label: 'Courses',
            icon: 'TypesIcon',
            childMenu: [
              {
                href: Routes.course.list,
                label: 'All courses',
                icon: 'TypesIcon',
              },
              {
                href: Routes.course.create,
                label: 'Add new course',
                icon: 'TypesIcon',
                childMenu: [
                  {
                    href: '',
                    label: 'General settings',
                    icon: 'SettingsIcon',
                  },
                  {
                    href: '',
                    label: 'Topics',
                    icon: 'SettingsIcon',
                  },
                ],
              },
            ],
          },
        ],
      },

      student: {
        href: '',
        label: 'Student Management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.student.list,
            label: 'Students',
            icon: 'UsersIcon',
          },
          {
            href: Routes.enrollment.list,
            label: 'Enrollments',
            icon: 'TransactionsIcon',
          },
        ],
      },

      user: {
        href: '',
        label: 'User Management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.user.list,
            label: 'Users',
            icon: 'UsersIcon',
          },
          {
            href: Routes.guardian.list,
            label: 'Guardians',
            icon: 'AdminListIcon',
          },
        ],
      },

      event: {
        href: '',
        label: 'Event Management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.hall.list,
            label: 'Halls',
            icon: 'ShopIcon',
          },
          {
            href: Routes.event.list,
            label: 'Events',
            icon: 'ShopIcon',
          },
        ],
      },

      payment: {
        href: '',
        label: 'Payment Management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.payment.list,
            label: 'Payments',
            icon: 'ShopIcon',
          },
          {
            href: '',
            label: 'Student',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: Routes.admission.list,
                label: 'Admission',
                icon: 'MyShopIcon',
              },
              {
                href: Routes.coursePayment.list,
                label: 'Course Payments',
                icon: 'ShopIcon',
              },
              // {
              //   href: Routes.newShops,
              //   label: 'text-inactive-shops',
              //   icon: 'MyShopIcon',
              // },
            ],
          },
        ],
      },

      feature: {
        href: '',
        label: 'text-feature-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.message.list,
            label: 'sidebar-nav-item-message',
            icon: 'ChatIcon',
          },
        ],
      }
    },

    shop: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      product: {
        href: '',
        label: 'text-product-management',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.product.list}`,
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.product.list}`,
                label: 'text-all-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.product.create}`,
                label: 'text-new-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.draftProducts}`,
                label: 'text-my-draft',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.outOfStockOrLowProducts}`,
                label: 'text-all-out-of-stock',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
          {
            href: (shop: string) => `/${shop}${Routes.productInventory}`,
            label: 'text-inventory',
            icon: 'InventoryIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.attribute.list}`,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
            label: 'sidebar-nav-item-manufacturers',
            icon: 'DiaryIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.author.list}`,
            label: 'sidebar-nav-item-authors',
            icon: 'FountainPenIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      financial: {
        href: '',
        label: 'text-financial-management',
        icon: 'WithdrawIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.withdraw.list}`,
            label: 'sidebar-nav-item-withdraws',
            icon: 'AttributeIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.refund.list}`,
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      order: {
        href: '',
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.order.list}`,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.transaction}`,
            label: 'text-transactions',
            icon: 'CalendarScheduleIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      feature: {
        href: '',
        label: 'text-feature-management',
        icon: 'ProductsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.storeNotice.list}`,
            label: 'sidebar-nav-item-store-notice',
            icon: 'StoreNoticeIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `${Routes.ownerDashboardMessage}`,
            label: 'sidebar-nav-item-message',
            icon: 'ChatIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      feedback: {
        href: '',
        label: 'text-feedback-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.reviews.list}`,
            label: 'sidebar-nav-item-reviews',
            icon: 'ReviewIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.question.list}`,
            label: 'sidebar-nav-item-questions',
            icon: 'QuestionIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.staff.list}`,
            label: 'sidebar-nav-item-staffs',
            icon: 'UsersIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      promotional: {
        href: '',
        label: 'text-promotional-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.coupon.list}`,
            label: 'Coupons',
            icon: 'CouponsIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
            label: 'text-flash-sale',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
                label: 'text-available-flash-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.myProductsInFlashSale}`,
                label: 'text-my-products-in-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.vendorRequestForFlashSale.list}`,
                label: 'Ask for enrollment',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.faqs.list}`,
            label: 'text-faqs',
            icon: 'TypesIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.termsAndCondition.list}`,
            label: 'Terms And Conditions',
            icon: 'TypesIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },
    },

    staff: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      product: {
        href: '',
        label: 'text-product-management',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.product.list}`,
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.product.list}`,
                label: 'text-all-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.product.create}`,
                label: 'text-new-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.draftProducts}`,
                label: 'text-my-draft',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.outOfStockOrLowProducts}`,
                label: 'text-low-out-of-stock',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
          {
            href: (shop: string) => `/${shop}${Routes.productInventory}`,
            label: 'text-inventory',
            icon: 'InventoryIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.attribute.list}`,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
            label: 'sidebar-nav-item-manufacturers',
            icon: 'DiaryIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.author.list}`,
            label: 'sidebar-nav-item-authors',
            icon: 'FountainPenIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      financial: {
        href: '',
        label: 'text-financial-management',
        icon: 'WithdrawIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.refund.list}`,
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      order: {
        href: '',
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.order.list}`,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      promotional: {
        href: '',
        label: 'text-promotional-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.coupon.list}`,
            label: 'Coupons',
            icon: 'CouponsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
            label: 'text-flash-sale',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
                label: 'text-available-flash-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.myProductsInFlashSale}`,
                label: 'text-my-products-in-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.vendorRequestForFlashSale.list}`,
                label: 'See all enrollment request',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.faqs.list}`,
            label: 'text-faqs',
            icon: 'TypesIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },
    },

    ownerDashboard: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: ownerAndStaffOnly,
      },
    ],

    studentDashboard: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: studentOnly,
      },
      {
        href: Routes.studentCourses.list,
        label: 'sidebar-nav-item-my-courses',
        icon: 'DiaryIcon',
        permissions: studentOnly,
      },
    ],

    teacherDashboard: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: teacherOnly,
      },
      {
        href: Routes.teacherCourses,
        label: 'sidebar-nav-item-my-courses',
        icon: 'DiaryIcon',
        permissions: teacherOnly,
      },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};

export const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];
