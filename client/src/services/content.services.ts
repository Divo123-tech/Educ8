import axios from "axios";
import { fetchWithAuth } from "./users.service";

export interface Content {
  id: number;
  title: string;
  contentType: string;
  media?: File | null;
  content: string;
  section?: number;
}
type ContentResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Content[];
};
export const getContentsDetailed = async (
  courseId: number | string,
  sectionId: number | string
) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}/contents/detailed`;
    const response = await fetchWithAuth<ContentResponse>({
      url,
      method: "GET",
    });
    console.log(response);
    return response.results;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getContentsGeneral = async (
  courseId: number | string,
  sectionId: number | string
): Promise<Content[]> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}/contents`;
    const response = await axios.get<Content[]>(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getSingleContent = async (
  courseId: number | string,
  sectionId: number | string,
  contentId: string | number
): Promise<Content> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}/contents/${contentId}`;
    const response = await fetchWithAuth<Content>({
      url,
      method: "GET",
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const postContent = async (
  courseId: number | string,
  sectionId: number | string,
  title: string
) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}/contents`;
    const sectionContent = await fetchWithAuth<Content>({
      url,
      method: "POST",
      data: { title },
    });
    console.log(sectionContent);
    return sectionContent;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteContent = async (
  courseId: string | number,
  sectionId: string | number,
  contentId: string | number
) => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}/contents/${contentId}`;
    const content = await fetchWithAuth({
      url,
      method: "DELETE",
    });
    return content;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editContent = async (
  courseId: string | number,
  sectionId: string | number,
  contentId: string | number,
  content: FormData
): Promise<Content> => {
  try {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/courses/${courseId}/sections/${sectionId}/contents/${contentId}`;
    const editedContent = await fetchWithAuth<Content>({
      url,
      method: "PATCH",
      data: content,
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    console.log(editedContent);
    return editedContent;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
