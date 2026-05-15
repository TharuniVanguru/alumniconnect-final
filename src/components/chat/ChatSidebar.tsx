import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface ChatItem {
  _id: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ChatSidebar = () => {

  const [chats, setChats] = useState<ChatItem[]>([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  );

  // FETCH CHAT LIST
  const fetchChats = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/messages/chat-list",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setChats(res.data);

    }

    catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    fetchChats();
  }, []);


  return (

    <div className="w-80 h-screen border-r bg-white overflow-y-auto">

      <h2 className="p-4 text-xl font-bold border-b">
        Chats
      </h2>


      {chats.map((chat) => (

        <div
          key={chat._id}
          onClick={() => navigate(`/chat/${chat._id}`)}
          className={`p-4 cursor-pointer border-b hover:bg-gray-100 flex justify-between items-center
            ${userId === chat._id ? "bg-gray-200" : ""}`}
        >

          <div>

            <p className="font-semibold">
              User {chat._id.slice(-4)}
            </p>

            <p className="text-sm text-gray-500 truncate w-40">
              {chat.lastMessage}
            </p>

          </div>


          {/* UNREAD BADGE */}
          {chat.unreadCount > 0 && (

            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {chat.unreadCount}
            </span>

          )}

        </div>

      ))}

    </div>

  );

};

export default ChatSidebar;