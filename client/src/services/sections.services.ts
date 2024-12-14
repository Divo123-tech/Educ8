import axios from "axios";
import { fetchWithAuth } from "./users.service";

export const addSection = async (title: string, courseId: number | string) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections`;
    const section = await fetchWithAuth({
      url,
      method: "POST",
      data: { title },
    });
    console.log(section);
    return section;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export type Section = {
  id: number;
  title: string;
  position: number;
  courseId: number | string;
  contents: number[];
};

export const getSections = async (
  courseId: number | string
): Promise<Section[]> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteSection = async (
  courseId: string,
  sectionId: number | string
) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}`;
    const section = await fetchWithAuth({
      url,
      method: "DELETE",
    });
    return section;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editSection = async (
  courseId: string,
  sectionId: number | string,
  section: Section
): Promise<Section> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}`;
    const editedSection = await fetchWithAuth<Section>({
      url,
      data: section,
      method: "PUT",
    });
    return editedSection;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editSectionPosition = async (
  courseId: string,
  sectionId: number | string,
  position: number
): Promise<Section> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}`;
    const editedSection = await fetchWithAuth<Section>({
      url,
      data: { position },
      method: "PATCH",
    });
    return editedSection;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
