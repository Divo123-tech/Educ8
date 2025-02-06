import { getCourseInUserCourse } from "@/services/courses.service";
import { useEffect } from "react";
import { useNavigate } from "react-router";

// Custom hook for course access validation
const useCourseAccess = (courseId: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const hasAccess = await getCourseInUserCourse(courseId);
        if (!hasAccess) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error validating course access:", error);
        navigate("/");
      }
    };

    if (courseId) {
      validateAccess();
    }
  }, [courseId, navigate]);
};

export default useCourseAccess;
