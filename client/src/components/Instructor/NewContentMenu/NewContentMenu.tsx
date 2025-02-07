import { X } from "lucide-react";
import React, { useState } from "react";
import { Section } from "@/services/sections.services";
import {
  Content,
  getContentsDetailed,
  postContent,
} from "@/services/content.services";
type Props = {
  courseId: string | number;
  sectionId: number;
  setSectionState: React.Dispatch<React.SetStateAction<Section>>;
  setShowNewContent: React.Dispatch<React.SetStateAction<boolean>>;
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;
};

const NewContentMenu = ({
  courseId,
  sectionId,
  setShowNewContent,
  setContents,
}: Props) => {
  const [contentTitle, setContentTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggleContentSection = () => {
    setShowNewContent((prevShowNewContent) => !prevShowNewContent);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  const createNewContent = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postContent(courseId, sectionId, contentTitle);
      setContents(await getContentsDetailed(courseId, sectionId));
      toggleContentSection();
    } catch (err: unknown) {
      console.log(err);
    }
    setLoading(false);
  };

  const isFormEmpty = contentTitle == "";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div>
        <X strokeWidth={1} cursor={"pointer"} onClick={toggleContentSection} />
      </div>
      <form
        className="border border-black px-4 lg:px-2 py-4 flex flex-col gap-4 w-full bg-white"
        onSubmit={createNewContent}
      >
        <div className="flex w-full gap-2 lg:gap-4 items-start lg:items-center flex-col lg:flex-row">
          <label className="font-bold text-nowrap">New Section Content:</label>
          <input
            placeholder="Enter a title"
            className="border border-black w-full lg:w-full py-1 px-3"
            onChange={handleTitleChange}
          ></input>
        </div>

        <div className="flex justify-end items-center gap-4">
          <button
            className=" font-bold px-2 py-1 text-sm"
            onClick={toggleContentSection}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white font-bold px-2 py-1 text-sm hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isFormEmpty || loading}
          >
            {loading ? "Adding..." : "Add Content"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContentMenu;
