import React, { memo } from 'react';
import { router } from 'expo-router';
import { iconos } from '../iconos';
import FooterNav, { FOOTER_HEIGHT, NavTab } from './FooterNav';

const EMPLOYER_TABS: NavTab[] = [
  {
    label: 'Panel',
    icon: (active, size, color) => iconos.footer_home(active, size, color),
    isActive: (pathname, base) =>
      pathname === base || pathname.startsWith(`${base}/panel`),
    navigate: (base) => router.replace(base as any),
  },
  {
    label: 'Empleados',
    icon: (active, size, color) => iconos.footer_inbox(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/candidates`),
    navigate: (base) => router.replace(`${base}/candidates` as any),
  },
  {
    label: 'Chats',
    icon: (active, size, color) => iconos.footer_chat(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/chats`),
    navigate: (base) => router.replace(`${base}/chats` as any),
  },
  {
    label: 'Perfil',
    icon: (active, size, color) => iconos.footer_person(active, size, color),
    isActive: (pathname, base) => pathname.startsWith(`${base}/profile`),
    navigate: (base) => router.push(`${base}/profile` as any),
  },
];

type Props = { basePath: '/employer' };

const FooterNavEmployer: React.FC<Props> = ({ basePath }) => (
  <FooterNav basePath={basePath} tabs={EMPLOYER_TABS} />
);

export default memo(FooterNavEmployer);
export { FOOTER_HEIGHT };
