import { User, UserContext } from "@/context/UserContext";
import { getMessages, Message } from "@/services/chat.services";
import { getCurrentUser, getUserInfo } from "@/services/users.service";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { PiPaperPlaneRight } from "react-icons/pi";
import { Link } from "react-router-dom";
interface MessageEvent {
  data: string; // The WebSocket message payload
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { roomName } = useParams();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user, setUser } = userContext;
  // Scroll to the bottom when messages are updated
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
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
      setMessages(response);
    })();
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => {
      ("WebSocket closed");
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ message, user: user?.id }));
      setMessage("");
    }
  };
  return (
    <div className="flex flex-col px-8 xl:px-48 md:py-4">
      <div
        id="chat-header"
        className="flex py-2 items-center gap-3 border border-black px-6 "
      >
        {otherUser?.profile_picture &&
        typeof otherUser.profile_picture == "string" ? (
          <img
            src={otherUser.profile_picture}
            alt="profile"
            className="rounded-full w-14 h-14"
          />
        ) : (
          <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center">
            <p className="font-bold text-white text-2xl">
              {otherUser?.username
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </p>
          </div>
        )}
        <Link to={`/user/${otherUser?.id}`}>
          <p className="font-bold">{otherUser?.username}</p>
          <p className="text-xs text-gray-400 font-medium">
            {otherUser?.email}
          </p>
        </Link>
      </div>
      <div className="border-2 px-6 pb-4 flex flex-col gap-1 h-[450px] overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sent_by === user?.id
                ? "bg-blue-500 text-white self-end"
                : "bg-green-400 text-black self-start"
            } w-fit rounded-lg max-w-[70%] px-3 py-2 flex items-end gap-4`}
          >
            <p className="break-all">{msg.message}</p>
            <span
              className={`${
                msg.sent_by === user?.id ? "text-gray-200" : "text-gray-500"
              }  text-xs text-nowrap`}
            >
              {new Date(msg.sent_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border border-black flex justify-end">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="w-11/12 pl-4 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-gray-200 py-1 px-1 xl:px-8 w-1/12 text-center hover:bg-gray-300"
        >
          <PiPaperPlaneRight size={28} className="text-center" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
