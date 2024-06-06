export default [
  { heading: 'Administrator' },
  {
    title: 'Customer',
    icon: { icon: 'tabler-user' },
    to: 'customer-list',
    action: 'read',
    subject: 'AclDemo',
    role: 'Customer'
  },
  {
    title: 'Sales',
    icon: { icon: 'tabler-brand-cashapp' },
    to: 'sales-list',
    action: 'read',
    subject: 'AclDemo',
    role: 'Sale'
  },
  {
    title: 'Laboratory',
    icon: { icon: 'tabler-flask' },
    to: 'labs-list',
    action: 'read',
    subject: 'AclDemo',
    role: 'Lab'
  },
  {
    title: 'Technicals',
    icon: { icon: 'tabler-device-laptop' },
    to: 'techs-list',
    action: 'read',
    subject: 'AclDemo',
    role: 'Tech'
  },
  // {
  //   title: 'Nav Levels',
  //   icon: { icon: 'tabler-menu-2' },
  //   children: [
  //     {
  //       title: 'Level 2.1',
  //       to: null,
  //     },
  //     {
  //       title: 'Level 2.2',
  //       children: [
  //         {
  //           title: 'Level 3.1',
  //           to: null,
  //         },
  //         {
  //           title: 'Level 3.2',
  //           to: null,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: 'Disabled Menu',
  //   to: null,
  //   icon: { icon: 'tabler-eye-off' },
  //   disable: true,
  // },
  // {
  //   title: 'Raise Support',
  //   href: 'https://pixinvent.ticksy.com/',
  //   icon: { icon: 'tabler-headphones' },
  //   target: '_blank',
  // },
  // {
  //   title: 'Documentation',
  //   href: 'https://demos.pixinvent.com/vuexy-vuejs-admin-template/documentation/',
  //   icon: { icon: 'tabler-file-text' },
  //   target: '_blank',
  // },
]
