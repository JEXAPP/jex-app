import { router } from "expo-router";
import { iconos } from '@/constants/iconos';
import { Colors } from "@/themes/colors";

export type SettingOption = {
  id: string;
  title: string;
  icon: any;
  onPress: () => void;
};

export const useProfileSettings = () => {
  const goToEditProfile = () => {
    router.push("/employee/profile/edit-profile-employee");
  };

  const goToEditInterests = () => {
    router.push("/employee/profile/settings/edit-interests");
  };

  const goToLinkMercadoPago = () => {
    router.push("/employee/profile/settings/associate-mp")
  };

  // const goToChangePassword = () => {
  //   router.push("/employee/profile/settings/change-password-one");
  // };

    const options: SettingOption[] = [
    {
      id: "edit-profile",
      title: "Editá tu perfil",
      icon: iconos.config_profile(30, Colors.gray3),
      onPress: goToEditProfile,
    },
    {
      id: "edit-interests",
      title: "Modificá tus intereses",
      icon: iconos.config_interests(30, Colors.gray3),
      onPress: goToEditInterests,
    },
    {
      id: "link-mercado-pago",
      title: "Asociá tu cuenta Mercado Pago",
      icon: iconos.config_mp(30, Colors.gray3),
      onPress: goToLinkMercadoPago,
    },
    // {
    //   id: "change-password",
    //   title: "Cambiá tu contraseña",
    //   icon: iconos.config_password(30, Colors.gray3),
    //   onPress: goToChangePassword,
    // },
  ];

  return {
    options,
  };
};
