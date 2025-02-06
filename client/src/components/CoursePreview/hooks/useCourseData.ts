import { User } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { Course, getSingleCourse } from "@/services/courses.service";
import { getSections, Section } from "@/services/sections.services";
import { getUserInfo } from "@/services/users.service";
import { useEffect, useState } from "react";
const useCourseData = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[] | null>(null);
  const [instructor, setInstructor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, sectionsData] = await Promise.all([
          getSingleCourse(courseId),
          getSections(courseId),
        ]);

        setCourse(courseData);
        setSections(sectionsData);

        if (courseData?.creator.id) {
          const instructorData = await getUserInfo(courseData.creator.id);
          setInstructor(instructorData);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  return { course, sections, instructor, loading };
};

export default useCourseData;
