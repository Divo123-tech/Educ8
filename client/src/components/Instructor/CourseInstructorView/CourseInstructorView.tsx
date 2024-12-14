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
    <div className="flex border border-black">
      <img
        src={
          typeof course.thumbnail == "string" ? course.thumbnail : NoThumbnail
        }
        className="w-24 h-24"
      />
      <div className="relative flex flex-col justify-between py-1 px-4 group w-full ">
        <p className="font-bold">{course.title}</p>
        <p className="italic">{course.published ? "Published" : "Draft"}</p>
        <p className="text-gray-500">Date Created: {course.created_at}</p>
        <div
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          onClick={() => navigate(`/instructor/courses/${course.id}`)}
        >
          <p className="text-green-600 text-lg  font-bold">Edit Course</p>
        </div>
      </div>
      <div className="px-4 py-3">
        <button className="cursor:pointer">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <button className="cursor-pointer">
                  <Settings />
                </button>
              </MenubarTrigger>
              <DeleteDialog handleDelete={handleDelete} />
            </MenubarMenu>
          </Menubar>
        </button>
      </div>
    </div>
  );
};

export default CourseInstructorView;
