import { Mail, Home, Activity, Upload, FileText } from 'react-feather';

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Activity size={20} />,
    navLink: '/dashbaord/default',
  },
  {
    id: 'secondPage',
    title: 'Second Page',
    icon: <Mail size={20} />,
    navLink: '/second-page',
  },
  {
    id: 'PrivacyPolicy',
    title: 'Privacy Policy',
    icon: <fileText size={20} />,
    navLink: '/privacy-policy',
  },
  {
    id: 'fileUpload',
    title: 'Editor',
    icon: <Upload size={20} />,
    navLink: '/file-upload',
  },
  {
    id: 'userList',
    title: 'User List',
    icon: <Mail size={20} />,
    navLink: '/apps/user/list',
  },
  {
    id: 'invoicePreview',
    title: 'Invoice Preview',
    icon: <Mail size={20} />,
    navLink: '/apps/invoice/preview/123',
  },
];
