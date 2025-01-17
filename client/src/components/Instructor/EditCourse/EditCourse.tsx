import {
  Course,
  getSingleCourse,
  editCourse,
  publishCourse,
} from "@/services/courses.service";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NoThumbnailLarge from "@/assets/NoThumbnailLarge.png";
import { Input } from "../../ui/input";
import { getCurrentUser } from "@/services/users.service";
import { toast } from "@/hooks/use-toast";
import { Plus, ArrowLeft } from "lucide-react";
import NewSectionMenu from "../NewSectionMenu";
import { getSections, Section } from "@/services/sections.services";
import { Link } from "react-router-dom";
import SectionInstructorView from "../SectionInstructorView";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill theme
const EditCourse = () => {
  const [showNewSection, setShowNewSection] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [view, setView] = useState<string>("landing");
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[] | null>(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const course = await getSingleCourse(courseId || "");
      const user = await getCurrentUser();
      const sections = await getSections(courseId || "");
      setSections(sections);
      if (user?.id !== course.creator.id) {
        navigate("/");
      }
      setCourse(course);
    })();
  }, [courseId, navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
      setCourse((prevCourse) => {
        if (prevCourse) {
          return {
            ...prevCourse,
            thumbnail: file, // Store the File
          };
        }
        return prevCourse;
      });
    }
  };

  const handlePublish = async () => {
    try {
      const editedCourse = await publishCourse(
        course?.id || 0,
        !course?.published
      );
      setCourse(editedCourse);
      toast({
        title: "Status",
        description: `Successfully ${
          !course?.published ? "published" : "unpublished"
        } course!`,
        variant: "success",
      });
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      toast({
        title: "Status",
        description: `Failed to ${
          !course?.published ? "publish" : "unpublish"
        } course!`,
        variant: "destructive",
      });
    }
  };

  const handleLandingFormSubmit = async () => {
    if (!course) return;

    try {
      const formData = new FormData();
      Object.entries(course).forEach(([key, value]) => {
        if (key === "thumbnail" && value instanceof File) {
          formData.append(key, value); // Add file if present
        }
      });
      formData.append("title", course.title);
      formData.append("subtitle", course.subtitle);
      formData.append("description", course.description);
      formData.append("category", course.category);
      formData.append("price", course.price.toString());

      await editCourse(courseId || "", formData);

      toast({
        title: "Status",
        description: "Successfully edited course details!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Status",
        description: "Failed to update course details",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setCourse((prevCourse) => {
      console.log(prevCourse);
      if (prevCourse) {
        return {
          ...prevCourse,
          [event.target.name]: event.target.value,
        };
      }
      return prevCourse; // or return a default object if null
    });
  };
  const handleQuillChange = (value: string) => {
    setCourse((prevCourse) => {
      console.log(prevCourse);
      if (prevCourse) {
        return {
          ...prevCourse,
          description: value, // Update the `description` field specifically
        };
      }
      return prevCourse; // or return a default object if null
    });
  };

  const isFormEmpty =
    course?.title == "" ||
    course?.description == "" ||
    course?.category == "" ||
    course?.subtitle == "";

  return (
    <div className="flex flex-col px-4 md:px-16 lg:px-48 py-6 gap-6">
      <Link
        to="/instructor/courses"
        className="text-gray-500 flex gap-1 items-center hover:border-b-2 w-fit"
      >
        <ArrowLeft size={20} />
        <p>Back to Courses</p>
      </Link>
      <div className="flex gap-8 text-lg">
        <p
          className={`cursor-pointer
            ${
              view == "landing"
                ? "opacity-100 underline underline-offset-4"
                : "opacity-50"
            }
          `}
          onClick={() => setView("landing")}
        >
          Landing page
        </p>
        <p
          className={`cursor-pointer
            ${
              view == "curicullum"
                ? "opacity-100 underline underline-offset-4"
                : "opacity-50"
            }
          `}
          onClick={() => setView("curicullum")}
        >
          Curriculum
        </p>
        <button
          className="ml-auto text-white font-bold bg-black px-4 py-1"
          onClick={handlePublish}
        >
          {course?.published ? "Unpublish" : "Publish"}
        </button>
      </div>
      <div className="border shadow-xl">
        {view == "landing" ? (
          <div>
            <div className="flex px-12 py-8 items-center justify-between">
              <h1 className="text-2xl font-bold">Course Landing Page</h1>
              <button
                className={`bg-green-500 text-white px-4 py-1 text-lg font-bold ${
                  isFormEmpty
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleLandingFormSubmit}
                disabled={isFormEmpty}
              >
                Save
              </button>
            </div>
            <hr></hr>
            <div className="px-12 py-6 flex flex-col gap-8 text-sm">
              <p>
                Your course landing page is crucial to your success on Udemy. If
                it's done right, it can also help you gain visibility in search
                engines like Google. As you complete this section, think about
                creating a compelling Course Landing Page that demonstrates why
                someone would want to enroll in your course. Learn more about
                creating your course landing page and course title standards.
                Course title
              </p>
              <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">Course Name</label>
                  <input
                    className="border border-black px-3 py-2"
                    value={course?.title}
                    name="title"
                    onChange={handleInputChange}
                  ></input>
                  <p className="text-xs text-gray-500">
                    Your title should be a mix of attention-grabbing,
                    informative, and optimized for search
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">Course Subtitle</label>
                  <input
                    className="border border-black px-3 py-2"
                    value={course?.subtitle}
                    name="subtitle"
                    onChange={handleInputChange}
                  ></input>
                  <p className="text-xs text-gray-500">
                    Use 1 or 2 related keywords, and mention 3-4 of the most
                    important areas that you've covered during your course.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">
                    Course Description
                  </label>
                  {/* <textarea
                    className="border border-black px-3 py-2"
                    value={course?.description}
                    name="description"
                    onChange={handleInputChange}
                    rows={5}
                  ></textarea> */}
                  <ReactQuill
                    theme="snow"
                    value={course?.description}
                    onChange={handleQuillChange}
                  />
                  <p className="text-xs text-gray-500">
                    Description should have minimum 200 words.
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-lg">Course Category</label>
                    <select
                      className="border border-black px-3 py-2"
                      name="category"
                      onChange={handleInputChange}
                      value={course?.category}
                    >
                      <option value={"Finance"}>Finance</option>
                      <option value={"Technology"}>Technology</option>
                      <option value={"Self-development"}>
                        Self-development
                      </option>
                    </select>
                    <p className="text-xs text-gray-500">
                      Your title should be a mix of attention-grabbing,
                      informative, and optimized for search
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-lg">
                      Course Price ($)
                    </label>
                    <input
                      className="border border-black px-3 py-2"
                      value={course?.price}
                      name="price"
                      type="number"
                      onChange={handleInputChange}
                    ></input>
                    <p className="text-xs text-gray-500">
                      Your title should be a mix of attention-grabbing,
                      informative, and optimized for search
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">Course Thumbnail</label>
                  <div className="flex flex-col md:flex-row md:items-end gap-8">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="border shadow-md min-w-84 lg:min-w-96 min-h-48 lg:min-h-56 max-h-56"
                      ></img>
                    ) : (
                      <img
                        src={
                          typeof course?.thumbnail === "string"
                            ? course?.thumbnail
                            : imagePreview || NoThumbnailLarge // Fallback to the preview or blank image
                        }
                        className="border shadow-md  sm:min-w-72 md:min-w-84 lg:min-w-96 min-h-48 lg:min-h-56 max-h-56"
                      ></img>
                    )}

                    <Input
                      className="border-black cursor-pointer"
                      id="picture"
                      type="file"
                      accept="image/*"
                      name="thumbnail"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex px-12 py-8 items-center justify-between">
              <h1 className="text-2xl font-bold">Course Curriculum</h1>
              <button
                className={`bg-green-500 text-white px-4 py-1 text-lg font-bold ${
                  isFormEmpty
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleLandingFormSubmit}
                disabled={isFormEmpty}
              >
                Save
              </button>
            </div>
            <hr></hr>
            <div className="px-12 py-6 flex flex-col gap-8 text-sm">
              <p>
                Start putting together your course by creating sections,
                lectures and practice (quizzes, coding exercises and
                assignments). Start putting together your course by creating
                sections, lectures and practice activities (quizzes, coding
                exercises and assignments). Use your course outline to structure
                your content and label your sections and lectures clearly. If
                you're intending to offer your course for free, the total length
                of video content must be less than 2 hours.
              </p>
              {sections?.map((section: Section) => {
                return (
                  <SectionInstructorView
                    section={section}
                    courseId={courseId || ""}
                    key={section.position}
                    setSections={setSections}
                    maxPosition={sections.length}
                  />
                );
              })}
              {!showNewSection ? (
                <div>
                  <button
                    className="border border-black px-3 py-1"
                    onClick={() =>
                      setShowNewSection(
                        (prevShowNewSection) => !prevShowNewSection
                      )
                    }
                  >
                    <div className="flex items-center gap-1 justify-between">
                      <Plus size={20} />
                      <p className="text-md font-bold">Section</p>
                    </div>
                  </button>
                </div>
              ) : (
                <NewSectionMenu
                  setCourse={setCourse}
                  courseId={courseId || ""}
                  setShowNewSection={setShowNewSection}
                  setSections={setSections}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
