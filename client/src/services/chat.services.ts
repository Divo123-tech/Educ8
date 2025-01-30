import { fetchWithAuth } from "./users.service";

export interface Message {
  message: string;
  sent_by: number;
  sent_at: Date;
}
export const getMessages = async (roomname: string): Promise<Message[]> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/messages/${roomname}/`;
    const response = await fetchWithAuth<Message[]>({
      url,
      method: "GET",
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
