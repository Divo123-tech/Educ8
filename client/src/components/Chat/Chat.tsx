import { UserContext } from "@/context/UserContext";
import { getMessages } from "@/services/chat.services";
import { getCurrentUser } from "@/services/users.service";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";

interface MessageEvent {
  data: string; // The WebSocket message payload
}
interface Message {
  sent_by: string;
  message: string;
  sent_at: string;
}
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
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
          if (
            user.id != Number(roomName?.split("-")[0]) &&
            user.id != Number(roomName?.split("-")[1])
          ) {
            console.log("Not the user");
            navigate("/");
          }
        } catch (err: unknown) {
          setUser(null);
          //   navigate("/");
          console.error(err);
        }
      })();
    }
  }, [navigate, roomName, setUser]);
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getMessages(roomName || "");
      console.log(response);
      setMessages(response);
    };
    fetchMessages();
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    console.log(ws);
    setSocket(ws);

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
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
      socket.send(JSON.stringify({ message, user }));
      setMessage("");
    }
  };
  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
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
  );
};

export default Chat;
