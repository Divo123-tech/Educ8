import { User, UserContext } from "@/context/UserContext";
import { getMessages, Message } from "@/services/chat.services";
import { getCurrentUser, getUserInfo } from "@/services/users.service";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";

interface MessageEvent {
  data: string; // The WebSocket message payload
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [otherUser, setOtherUser] = useState<User>(null);
  const { roomName } = useParams();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user, setUser } = userContext;
  useEffect(() => {
    if (Number(roomName?.split("-")?.length) < 2) {
      navigate("/");
    } else {
      (async () => {
        try {
          const user = await getCurrentUser();
          const id1 = Number(roomName?.split("-")[0]);
          const id2 = Number(roomName?.split("-")[1]);
          if (user.id != id1 && user.id != id2) {
            console.log("Not the user");
            navigate("/");
          }
          if (user.id == id1) {
            setOtherUser(await getUserInfo(id2));
          } else {
            setOtherUser(await getUserInfo(id1));
          }
        } catch (err: unknown) {
          setUser(null);
          console.error(err);
        }
      })();
    }
  }, [navigate, roomName, setUser]);
  useEffect(() => {
    (async () => {
      const response = await getMessages(roomName || "");
      console.log(response);
      setMessages(response);
    })();
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    console.log(ws);
    setSocket(ws);

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        console.log(data);
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, [roomName]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ message, user: user?.id }));
      setMessage("");
    }
  };
  return (
    <div className="flex flex-col px-48 py-4">
      <div className="">
        <div
          id="chat-header"
          className="flex py-2 items-center gap-3 border border-black px-6 "
        >
          <>
            {otherUser?.profile_picture &&
            typeof otherUser.profile_picture == "string" ? (
              <img
                src={otherUser.profile_picture}
                alt="profile"
                className="rounded-full w-14 h-14"
              />
            ) : (
              <div className="bg-black rounded-full w-24 h-24 flex items-center justify-center">
                <p className="font-bold text-white text-4xl">
                  {otherUser?.username
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </p>
              </div>
            )}
          </>
          <p className="font-bold">{otherUser?.username}</p>
        </div>
        <div className="border px-6 pb-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-green-500">
              {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
