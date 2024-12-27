import { Section } from "@/services/sections.services";
import { useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Content, getContentsGeneral } from "@/services/content.services";
import { FileIcon, MonitorPlay, Image } from "lucide-react";

type Props = {
  courseId: string | number;
  section: Section;
  value: number;
};

const SectionPreview = ({ courseId, section, value }: Props) => {
  const [contents, setContents] = useState<Content[]>([]);
  useEffect(() => {
    (async () => {
      setContents(await getContentsGeneral(courseId, section.id));
    })();
  }, [courseId, section]);
  return (
    <AccordionItem value={`item-${value}`}>
      <AccordionTrigger className="px-4">
        {section.title}
        <p className="ml-auto font-normal text-gray-700 text-xs">
          {section.contents.length} lectures
        </p>
      </AccordionTrigger>
      <AccordionContent className="bg-white flex flex-col">
        {contents.map((content: Content) => {
          return (
            <div className="flex items-center gap-4 px-10 py-3 hover:bg-gray-200 cursor-pointer">
              {content.contentType == "text" && <FileIcon size={18} />}
              {content.contentType == "video" && <MonitorPlay size={18} />}
              {content.contentType == "image" && <Image size={18} />}

              <p className="">{content.title}</p>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default SectionPreview;
