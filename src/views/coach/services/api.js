import { get, imgPut, put } from "../../../urls/api";

export const updateProfileImage = async (formData) => {
  return await imgPut("users/updateProfile", formData);
};

export const updateProfile = async (postData) => {
  return await put("users/updateProfile", postData);
};


export const fetchCoachingAreas = async () => {
  return await get("coach-area/get-all");
};

export const updateCoachingAreas = async (selectedCoachingAreas) => {
  const postData = {
    coaching_area_ids: selectedCoachingAreas,
    role: "coach",
  };
  return await put("users/updateProfile", postData);
};


export const fetchLanguages = async () => {
  return await get("language/get-all/");
};

export const updateLanguages = async (selectedLanguages) => {
  const postData = {
    language_ids: selectedLanguages,
    role: "coach",
  };
  return await put("users/updateProfile", postData);
};
