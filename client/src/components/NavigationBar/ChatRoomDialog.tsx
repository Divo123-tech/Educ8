import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User, UserContext } from "@/context/UserContext";
import { getAllUsers } from "@/services/users.service";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  UserSearch,
} from "lucide-react";
import { useState, ChangeEvent, useContext } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
const ChatRoomDialog = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const searchUsers = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) {
      const response = await getAllUsers(e.target.value);
      setUsers(response.results);
      setPreviousPage(response.previous);
      setNextPage(response.next);
      setTotal(response.count);
    } else {
      setTotal(0);
      setUsers([]);
    }
  };
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user } = userContext;
  const formatIds = (id1: number, id2: number) => {
    if (id1 > id2) {
      return `${id1}-${id2}`;
    }
    return `${id2}-${id1}`;
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-gray-600  py-2 rounded-md text-sm  font-normal hover:text-green-500 cursor-pointer">
          <UserSearch size={24} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find user to chat with</DialogTitle>
          <DialogDescription>
            Search for a user by their username to begin your chat with them!
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            className="border border-black"
            placeholder="Search users..."
            onChange={searchUsers}
          ></Input>
        </div>
        <div className="flex flex-col gap-4">
          {users?.map((userAccount: User) => {
            return (
              <div className="border border-gray-500 py-2 px-2 rounded-lg flex w-full gap-2 cursor-pointer items-center">
                {userAccount.profile_picture &&
                typeof userAccount.profile_picture == "string" ? (
                  <img
                    src={userAccount.profile_picture}
                    alt="profile"
                    className="rounded-full w-8 h-8 xl:w-12 xl:h-12"
                  />
                ) : (
                  <div className="bg-black rounded-full w-8 h-8 xl:w-12 xl:h-12 flex items-center justify-center">
                    <p className="font-bold text-white text-md xl:text-lg">
                      {userAccount.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </p>
                  </div>
                )}
                <Link to={`/user/${userAccount.id}`} className="text-left">
                  <p className="text-md font-bold">{userAccount.username}</p>
                  <p className="text-xs">{userAccount.email}</p>
                </Link>
                <p className="ml-auto hover:text-green-500">
                  {user && (
                    <MessageSquareText
                      onClick={() => {
                        setUsers([]);
                        navigate(
                          `/chat/${formatIds(user?.id || 0, userAccount.id)}`
                        );
                      }}
                    />
                  )}
                </p>
              </div>
            );
          })}
          {users != null && users.length != 0 && (
            <div className="flex justify-end gap-2">
              <p>
                <ChevronLeft
                  cursor={previousPage ? "pointer" : "not-allowed"}
                  opacity={previousPage ? "100%" : "50%"}
                  onClick={() =>
                    setCurrentPage((prevCurrentPage) =>
                      previousPage ? (prevCurrentPage -= 1) : prevCurrentPage
                    )
                  }
                  size={20}
                />
              </p>
              <p className="text-sm">
                Page {total == 0 ? 0 : currentPage} of {Math.ceil(total / 10)}
              </p>
              <p>
                <ChevronRight
                  cursor={nextPage ? "pointer" : "not-allowed"}
                  opacity={nextPage ? "100%" : "50%"}
                  onClick={() =>
                    setCurrentPage((prevCurrentPage) =>
                      nextPage ? (prevCurrentPage += 1) : prevCurrentPage
                    )
                  }
                  size={20}
                />
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatRoomDialog;
