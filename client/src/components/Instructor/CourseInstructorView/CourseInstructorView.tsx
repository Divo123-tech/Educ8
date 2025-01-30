import { useContext } from "react";
import { Course, deleteCourse } from "@/services/courses.service";
import NoThumbnail from "@/assets/NoThumbnail.png";
import { Settings } from "lucide-react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { UserContext } from "@/context/UserContext";
import { getCurrentUser } from "@/services/users.service";
import { useNavigate } from "react-router";
import DeleteDialog from "../../DeleteDialog";
type Props = {
  course: Course;
};

const CourseInstructorView = ({ course }: Props) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { setUser } = userContext;

  const handleDelete = async () => {
    try {
      await deleteCourse(course.id);
      setUser(await getCurrentUser());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col border border-black justify-center items-center sm:justify-start ">
      <img
        src={
          typeof course.thumbnail == "string" ? course.thumbnail : NoThumbnail
        }
        className="w-40 h-28 sm:w-28 sm:h-24 object-cover object-center pt-2 sm:pt-0"
      />
      <div className="relative flex flex-col justify-between gap-3 sm:px-4 group w-full items-center sm:items-start">
        <p className="font-bold text-sm sm:text-md">{course.title}</p>
        <p className="italic text-sm ">
          {course.published ? "Published" : "Draft"}
        </p>
        <p className="text-gray-500 text-sm">
          Date Created: {course.created_at}
        </p>
        <div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          onClick={() => navigate(`/instructor/courses/${course.id}`)}
        >
          <p className="text-green-600 text-lg  font-bold">Edit Course</p>
        </div>
      </div>
      <div className="">
        <button className="cursor:pointer">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <button className="cursor-pointer">
                  <Settings />
                </button>
              </MenubarTrigger>
              <DeleteDialog
                handleDelete={handleDelete}
                deleteButtonMessage="Delete"
                deleteMessage="Are you sure you want to delete this course?"
              />
            </MenubarMenu>
          </Menubar>
        </button>
      </div>
    </div>
  );
};

export default CourseInstructorView;
