import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { CourseRevenue, getCoursesRevenue } from "@/services/analytics.service";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Total",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomXAxisTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(" "); // Split words for wrapping
  const lines = [];
  let line = "";

  // Split text into lines with max 10 characters per line
  words.forEach((word: string) => {
    if ((line + word).length <= 28) {
      line = `${line} ${word}`.trim();
    } else {
      lines.push(line);
      line = word;
    }
  });
  lines.push(line);

  return (
    <g transform={`translate(${x},${y + 10})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 14} // Adjust line spacing
          textAnchor="middle"
          style={{ fontSize: "11px", fill: "#333" }}
        >
          {line}
        </text>
      ))}
    </g>
  );
};
const CoursesChart = () => {
  const [courses, setCourses] = useState<CourseRevenue[] | null>(null);
  useEffect(() => {
    (async () => {
      setCourses(await getCoursesRevenue());
    })();
  }, []);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("revenue");

  const total = React.useMemo(
    () => ({
      revenue:
        courses?.reduce((acc, curr) => acc + Number(curr.revenue), 0) || 0,
      students:
        courses?.reduce((acc, curr) => acc + Number(curr.total_students), 0) ||
        0,
    }),
    [courses]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Revenue and Students of Courses</CardTitle>
          <CardDescription>
            Showing total revenue and students of each course you've published!
          </CardDescription>
        </div>
        <div className="flex">
          {["revenue", "students"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {chartConfig[chart].label == "Revenue" && "$"}
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={courses || []}
            margin={{
              left: 12,
              right: 12,
              bottom: 25,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-5} // Rotate labels 45 degrees
              //   textAnchor="end" // Align rotated labels
              tick={<CustomXAxisTick />}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => value} // Display course title in tooltip
                />
              }
            />
            <Bar
              dataKey={
                activeChart === "students" ? "total_students" : "revenue"
              }
              fill={`var(--color-${activeChart})`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CoursesChart;
