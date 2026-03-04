import { useRouter } from "expo-router";

export const useEditEmployeeInfoMenu = () => {
  const router = useRouter();
  
  const goToPersonalInfo = () => {
    router.push("/employee/profile/edit-basic");
  };

  const goToExperience = () => {
    router.push("/employee/profile/edit-experience");
  };

  const goToEducation = () => {
    router.push("/employee/profile/edit-education");
  };

  const goToLanguages = () => {
    router.push("/employee/profile/edit-languages");
  };

  return {
    goToPersonalInfo,
    goToExperience,
    goToEducation,
    goToLanguages,
  };
};
