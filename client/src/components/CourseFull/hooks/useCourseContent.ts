import { User } from "@/context/UserContext";
import { Content, getSingleContent } from "@/services/content.services";
import { Course, getSingleCourse } from "@/services/courses.service";
import { getSections, Section } from "@/services/sections.services";
import { getUserInfo } from "@/services/users.service";
import { useEffect, useState } from "react";

// Custom hook for course content
const useCourseContent = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[] | null>(null);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [instructor, setInstructor] = useState<User | null>(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const [courseData, sectionsData] = await Promise.all([
          getSingleCourse(courseId),
          getSections(courseId),
        ]);

        setCourse(courseData);
        setSections(sectionsData);

        if (sectionsData?.length > 0) {
          const firstContentId = sectionsData[0].contents[0];
          const content = await getSingleContent(
            courseId,
            sectionsData[0].id,
            firstContentId
          );
          setCurrentContent(content);
        }

        if (courseData?.creator.id) {
        console.log(courseData.creator.id);
        const instructorData = await getUserInfo(courseData.creator.id);
        console.log(instructorData);
        setInstructor(instructorData);
        }
      } catch (error) {
        console.error("Error fetching course content:", error);
      }
    };

    if (courseId) {
      fetchCourseContent();
    }
  }, [courseId]);

  const selectSectionContent = async (content: Content) => {
    setCurrentContent(content);
  };

  return {
    course,
    sections,
    currentContent,
    instructor,
    selectSectionContent,
    setCourse,
  };
};
export default useCourseContent;
