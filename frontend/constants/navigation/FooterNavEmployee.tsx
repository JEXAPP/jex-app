import React, { memo } from 'react';
import { router } from 'expo-router';
import { iconos } from '../iconos';
import FooterNav, { FOOTER_HEIGHT, NavTab } from './FooterNav';

const EMPLOYEE_TABS: NavTab[] = [
  {
    label: 'Vacantes',
    icon: (active, size, color) => iconos.footer_home(active, size, color),
    isActive: (pathname, base) =>
      pathname === base || pathname.startsWith(`${base}/vacancy`),
    navigate: (base) => router.replace(base as any),
  },
  {
    label: 'Ofertas',
    icon: (active, size, color) => iconos.footer_inbox(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/offers`),
    navigate: (base) => router.push(`${base}/offers` as any),
  },
  {
    label: 'Trabajos',
    icon: (active, size, color) => iconos.footer_briefcase(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/jobs`),
    navigate: (base) => router.push(`${base}/jobs` as any),
  },
  {
    label: 'Chats',
    icon: (active, size, color) => iconos.footer_chat(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/chats`),
    navigate: (base) => router.push(`${base}/chats` as any),
  },
  {
    label: 'Perfil',
    icon: (active, size, color) => iconos.footer_person(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/profile`),
    navigate: (base) => router.push(`${base}/profile` as any),
  },
];

type Props = { basePath: '/employee' };

const FooterNavEmployee: React.FC<Props> = ({ basePath }) => (
  <FooterNav basePath={basePath} tabs={EMPLOYEE_TABS} />
);

export default memo(FooterNavEmployee);
export { FOOTER_HEIGHT };
