import { fetchWithAuth } from "./users.service";

export const getMessages = async (roomname: string) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/messages/${roomname}/`;
    console.log("NIGGER");
    const response = await fetchWithAuth({
      url,
      method: "GET",
    });
    console.log(response);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
