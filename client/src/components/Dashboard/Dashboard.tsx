import {
  getNumberOfPublishedCourses,
  PublishedAmount,
} from "@/services/analytics.service";
import { useEffect, useState } from "react";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import CoursesTable from "./CoursesTable";
import CoursesChart from "./CoursesChart";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const [coursePublishedAmount, setCoursePublishedAmount] =
    useState<PublishedAmount | null>(null);

  useEffect(() => {
    (async () => {
      setCoursePublishedAmount(await getNumberOfPublishedCourses());
    })();
  }, []);
  return (
    <div className="px-24 py-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-gray-500 flex gap-1 items-center text-sm">
          <ArrowLeft size={20} />
          <Link to="/instructor/courses">Back to Courses</Link>
        </div>
        <h1 className="font-bold text-2xl">Analytics Dashboard</h1>
      </div>
      <CoursesChart />
      <div className="flex items-center flex-wrap justify-between">
        <CoursesTable />

        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-xl">
            Published vs Unpublished Courses
          </h1>
          <p className="font-bold text-lg">
            Total Courses: {coursePublishedAmount?.total || 0}
          </p>
          <PieChart
            series={[
              {
                arcLabel: (item) =>
                  `${(
                    (item.value * 100) /
                    (coursePublishedAmount?.total || 1)
                  ).toFixed(1)}%`,
                arcLabelRadius: "60%",
                data: [
                  {
                    id: 0,
                    value: coursePublishedAmount?.published_count || 0,
                    label: "Published",
                  },
                  {
                    id: 1,
                    value: coursePublishedAmount?.unpublished_count || 0,
                    label: "Draft",
                  },
                ],
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: "bold",
              },
            }}
            width={400}
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
