import { Section } from "@/services/sections.services";
import { useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Content, getContentsDetailed } from "@/services/content.services";
import { FileIcon, MonitorPlay, Image } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  courseId: string | number;
  section: Section;
  value: number;
  selectSectionContent: (contentId: Content) => void;
};
const SectionFull = ({
  courseId,
  section,
  value,
  selectSectionContent,
}: Props) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (isOpen) {
      (async () => {
        const contents = await getContentsDetailed(courseId, section.id);
        setContents(contents);
        setLoading(false);
      })();
    }
  }, [courseId, isOpen, section]);

  return (
    <AccordionItem value={`item-${value}`}>
      <AccordionTrigger
        className="px-4"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Section {section.position}: {section.title}
        <p className="ml-auto font-normal text-gray-700 text-xs">
          {section.contents.length} lectures
        </p>
      </AccordionTrigger>
      <AccordionContent className="bg-white flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-4 px-10 py-3 hover:bg-gray-200 cursor-pointer">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        ) : (
          <>
            {contents.map((content: Content) => {
              return (
                <div
                  key={content.id}
                  className="flex items-center gap-4 px-10 py-3 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectSectionContent(content)}
                >
                  {content.contentType == "text" && <FileIcon size={18} />}
                  {content.contentType == "video" && <MonitorPlay size={18} />}
                  {content.contentType == "image" && <Image size={18} />}

                  <p className="">{content.title}</p>
                </div>
              );
            })}
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default SectionFull;
