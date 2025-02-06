import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/context/UserContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, ChangeEvent, useContext, useEffect } from "react";
import { UserSearch } from "lucide-react";
import {
  getStudentsInCourse,
  removeStudentFromCourse,
  UserCourseItem,
} from "@/services/courses.service";
import { Link } from "react-router-dom";
import { MdBlock } from "react-icons/md";
import DeleteDialog from "@/components/DeleteDialog";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
type Props = {
  courseId: string | number;
};
const StudentsCourseDialog = ({ courseId }: Props) => {
  const [users, setUsers] = useState<UserCourseItem[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const response = await getStudentsInCourse(
            courseId,
            currentInput,
            currentPage
          );
          setUsers(response.results);
          setPreviousPage(response.previous);
          setNextPage(response.next);
          setTotal(response.count);
        } catch (err: unknown) {
          console.error(err);
          setTotal(0);
          setUsers([]);
        }
      })();
    }
  }, [courseId, currentInput, currentPage, isOpen]);
  const searchUsers = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) {
      setCurrentInput(e.target.value);
    } else {
      setTotal(0);
      setUsers([]);
    }
  };

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const handleDelete = async (userId: number) => {
    try {
      await removeStudentFromCourse(courseId, userId);
      const response = await getStudentsInCourse(courseId);
      setUsers(response.results);
      console.log(response.results);
      setPreviousPage(response.previous);
      setNextPage(response.next);
      setTotal(response.count);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      >
        <div className="py-2 rounded-md text-sm  font-normal hover:text-green-500 cursor-pointer">
          <UserSearch size={22} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Students Taking Your Course</DialogTitle>
          <DialogDescription>
            Search for a student by their username!
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
          {users?.map((userAccount: UserCourseItem) => {
            return (
              <div className="border border-gray-500 py-2 px-2 rounded-lg flex w-full gap-2 cursor-pointer items-center">
                {userAccount.student.profile_picture &&
                typeof userAccount.student.profile_picture == "string" ? (
                  <img
                    src={
                      import.meta.env.VITE_API_URL +
                      userAccount.student.profile_picture
                    }
                    alt="profile"
                    className="rounded-full w-8 h-8 xl:w-12 xl:h-12"
                  />
                ) : (
                  <div className="bg-black rounded-full w-8 h-8 xl:w-12 xl:h-12 flex items-center justify-center">
                    <p className="font-bold text-white text-md xl:text-lg">
                      {userAccount.student?.username
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </p>
                  </div>
                )}
                <Link
                  to={`/user/${userAccount.student.id}`}
                  className="text-left"
                >
                  <p className="text-md font-bold">
                    {userAccount.student.username}
                  </p>
                  <p className="text-xs">{userAccount.student.email}</p>
                </Link>
                <div className="ml-auto">
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger>
                        <button className="cursor-pointer">
                          <MdBlock size={22} color="red" />
                        </button>
                      </MenubarTrigger>
                      <DeleteDialog
                        deleteMessage={`Are you sure you want to remove ${userAccount.student.username} from the course?`}
                        handleDelete={() =>
                          handleDelete(userAccount.student.id)
                        }
                        deleteButtonMessage="Remove"
                        Icon={MdBlock}
                      />
                    </MenubarMenu>
                  </Menubar>
                </div>
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

export default StudentsCourseDialog;
