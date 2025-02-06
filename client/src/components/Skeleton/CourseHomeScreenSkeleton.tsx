import { Skeleton } from "@/components/ui/skeleton";

const CourseHomeScreenSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-48" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
};

export default CourseHomeScreenSkeleton;
