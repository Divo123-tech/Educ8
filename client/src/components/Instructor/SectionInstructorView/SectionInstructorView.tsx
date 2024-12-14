import {
  editSection,
  editSectionPosition,
  getSections,
  Section,
} from "@/services/sections.services";
import { Plus, Trash2, Pencil } from "lucide-react";
import { deleteSection } from "@/services/sections.services";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useEffect, useState } from "react";

import DeleteDialog from "../../DeleteDialog";
import NewContentMenu from "../NewContentMenu";
import { Content, getContentsDetailed } from "@/services/content.services";
import SectionContentInstructor from "../SectionContentInstructor";

type Props = {
  courseId: string;
  section: Section;
  setSections: React.Dispatch<React.SetStateAction<Section[] | null>>;
  maxPosition: number;
};

const SectionInstructorView = ({
  section,
  courseId,
  setSections,
  maxPosition,
}: Props) => {
  const [showEditSection, setShowEditSection] = useState<boolean>(false);
  const [sectionState, setSectionState] = useState<Section>(section);
  const [showNewContent, setShowNewContent] = useState<boolean>(false);
  const [contents, setContents] = useState<Content[]>([]);
  useEffect(() => {
    setSectionState(section);
    (async () => {
      console.log(await getContentsDetailed(courseId, section.id));
      setContents(await getContentsDetailed(courseId, section.id));
    })();
  }, [courseId, section]);
  const handleDelete = async () => {
    try {
      await deleteSection(courseId, section.id);
      setSections(await getSections(courseId));
    } catch (err: unknown) {
      console.error(err);
    }
  };
  const handleSectionTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSectionState((prevSectionState: Section) => {
      return {
        ...prevSectionState,
        title: event.target.value,
      };
    });
    console.log(sectionState);
  };

  const handlePositionInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSectionState((prevSectionState: Section) => {
      return {
        ...prevSectionState,
        position: Number(event.target.value),
      };
    });
  };

  const handleFormSubmit = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      console.log(sectionState);
      const editedSection = await editSection(
        courseId,
        section.id,
        sectionState
      );
      console.log(editedSection);
      setSections(await getSections(courseId));
      toggleEditSection();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePositionChange = async () => {
    try {
      await editSectionPosition(courseId, section.id, sectionState.position);
      setSections(await getSections(courseId));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEditSection = () => {
    setShowEditSection((prevShowEditSection) => !prevShowEditSection);
    setSectionState(section);
  };

  const toggleContentSection = () => {
    setShowNewContent((prevShowNewContent) => !prevShowNewContent);
  };
  return (
    <div className="border border-black bg-gray-100 px-4 py-2 flex flex-col sm:flex-row items-center gap-4 justify-between">
      <div className="flex flex-col gap-4 w-full">
        {showEditSection ? (
          <form
            className="border border-black px-4 lg:px-2 py-4 flex flex-col gap-2 bg-white"
            onSubmit={handleFormSubmit}
          >
            <div className="flex gap-1 lg:gap-4 items-start lg:items-center flex-col lg:flex-row">
              <label className="font-bold text-nowrap">New Section:</label>
              <input
                placeholder="Enter a title"
                className="border border-black w-full lg:w-full py-1 px-3"
                value={sectionState.title}
                onChange={handleSectionTitleInputChange}
              ></input>
            </div>
            <div className="flex justify-end items-center gap-4">
              <button
                className=" font-bold px-2 py-1 text-sm"
                onClick={toggleEditSection}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-black text-white font-bold px-2 py-1 text-sm hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={sectionState.title == ""}
              >
                Save Section
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-md">{section.title}</h1>
            <Pencil size={16} cursor={"pointer"} onClick={toggleEditSection} />
            <Menubar className="bg-gray-100">
              <MenubarMenu>
                <MenubarTrigger className="px-0">
                  <Trash2 size={16} cursor={"pointer"} />
                </MenubarTrigger>

                <DeleteDialog handleDelete={handleDelete} />
              </MenubarMenu>
            </Menubar>
          </div>
        )}
        <div className="px-2 lg:px-8 flex flex-col gap-4 ">
          {contents.map((content: Content) => {
            return (
              <SectionContentInstructor
                sectionId={section.id}
                courseId={courseId}
                content={content}
                setContents={setContents}
              />
            );
          })}
        </div>
        {showNewContent ? (
          <NewContentMenu
            courseId={courseId}
            setShowNewContent={setShowNewContent}
            setSectionState={setSectionState}
            sectionId={section.id}
            setContents={setContents}
          />
        ) : (
          <div className="px-2 lg:px-8">
            <button
              className="bg-white text-black border border-black px-3 py-1 hover:bg-gray-200"
              onClick={toggleContentSection}
            >
              <div className="flex items-center gap-1 ">
                <Plus size={16} />
                <p className="font-semibold text-xs">Content</p>
              </div>
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <p className="font-bold">Position:</p>
        <input
          type="number"
          className="w-8 h-8 px-1 border"
          value={sectionState.position}
          onChange={handlePositionInputChange}
          onBlur={handlePositionChange}
          min={1}
          max={maxPosition}
        ></input>
      </div>
    </div>
  );
};

export default SectionInstructorView;
