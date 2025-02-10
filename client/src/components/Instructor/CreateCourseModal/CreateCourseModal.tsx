import { useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeEvent, useState } from "react";
import { CircleAlert, CircleCheckBig } from "lucide-react";
import { addCourse } from "@/services/courses.service";
import { UserContext } from "@/context/UserContext";
import { getCurrentUser } from "@/services/users.service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill theme
const CreateCourseModal = () => {
  const [courseForm, setCourseForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
  });

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { setUser } = userContext;

  const [courseCreateSuccess, setcourseCreateSuccess] = useState<
    boolean | null
  >(null);
  useEffect(() => {
    if (courseCreateSuccess) {
      const timeout = setTimeout(() => {
        setcourseCreateSuccess(null);
      }, 3000); // Adjust the timeout duration as needed (e.g., 3000ms = 3 seconds)

      return () => clearTimeout(timeout); // Cleanup the timeout when `courseSuccess` changes
    }
  }, [courseCreateSuccess]);
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCourseForm((prevCourseForm) => {
      return {
        ...prevCourseForm,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleQuillChange = (value: string) => {
    setCourseForm((prevCourseForm) => ({
      ...prevCourseForm,
      description: value, // Update the `description` field with the HTML value
    }));
  };

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addCourse(
        courseForm.title,
        courseForm.subtitle,
        courseForm.description,
        courseForm.category
      );
      setcourseCreateSuccess(true);
      setCourseForm({
        title: "",
        subtitle: "",
        description: "",
        category: "",
      });
      setUser(await getCurrentUser());
    } catch (e: unknown) {
      console.error(e);
      setcourseCreateSuccess(false);
    }
  };
  const isFormEmpty =
    courseForm?.title == "" ||
    courseForm?.subtitle == "" ||
    courseForm?.description == "" ||
    courseForm?.category == "";
  return (
    <Dialog>
      <DialogTrigger>
        <button className="w-fit bg-green-600 py-2 px-3 text-white font-bold">
          New Course
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-lg">New Course</DialogTitle>
          <DialogDescription>
            {courseCreateSuccess && (
              <div className="flex items-center gap-4 bg-green-300 px-3 py-3">
                <CircleCheckBig className="text-black" />
                <p className="text-black font-medium">
                  Successfully created course!
                </p>
              </div>
            )}
            {courseCreateSuccess == false && (
              <div className="flex items-center gap-4 bg-red-300 px-3 py-3">
                <CircleAlert className="flex-shrink-0 text-black" />

                <p className="text-black font-medium">
                  Failed to create course!
                </p>
              </div>
            )}
            <form
              className="flex flex-col gap-4 mt-2"
              onSubmit={handleFormSubmit}
            >
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">Course Title</label>
                <input
                  placeholder="Give your course a name!"
                  name="title"
                  className="border border-black px-2 py-2 text-sm"
                  value={courseForm.title}
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">
                  Course Subtitle
                </label>
                <input
                  placeholder="Give your course a subtitle!"
                  name="subtitle"
                  className="border border-black px-2 py-2 text-sm"
                  value={courseForm.subtitle}
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">
                  Course Description
                </label>

                <ReactQuill
                  theme="snow"
                  value={courseForm.description}
                  onChange={handleQuillChange}
                  className="w-full h-36"
                />
              </div>
              <div className="flex flex-col gap-2 mt-10">
                <label className="text-black font-medium">
                  Course Category
                </label>
                <select
                  name="category"
                  className="border border-black px-2 py-1 text-sm"
                  onChange={handleInputChange}
                >
                  <option value={""} selected>
                    Select Category
                  </option>
                  <option value={"Finance"}>Finance</option>
                  <option value={"Technology"}>Technology</option>
                  <option value={"Self-Development"}>Self-Development</option>
                  <option value={"Accounting"}>Accounting</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className={`bg-black text-white px-3 py-2 font-bold ${
                    isFormEmpty ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormEmpty}
                >
                  Create Course!
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
