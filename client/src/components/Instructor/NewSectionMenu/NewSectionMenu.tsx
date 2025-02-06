import { useState } from "react";
import { addSection, getSections, Section } from "@/services/sections.services";
import { X } from "lucide-react";

type Props = {
  courseId: string;
  setShowNewSection: React.Dispatch<React.SetStateAction<boolean>>;
  setSections: React.Dispatch<React.SetStateAction<Section[] | null>>;
};

const NewSectionMenu = ({
  courseId,
  setShowNewSection,
  setSections,
}: Props) => {
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSectionTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSectionTitle(event.target.value);
  };

  const createNewSection = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      await addSection(sectionTitle, courseId);
      setSections(await getSections(courseId));
    } catch (err) {
      console.log(err);
    }
    toggleNewSection();
    setLoading(false);
  };

  const toggleNewSection = () => {
    setShowNewSection((prevShowNewSection) => !prevShowNewSection);
    setSectionTitle("");
  };
  return (
    <div className="flex flex-col gap-2">
      <div>
        <X strokeWidth={1} onClick={toggleNewSection} cursor={"pointer"} />
      </div>
      <form
        className="border border-black px-4 lg:px-2 py-4 flex flex-col gap-2"
        onSubmit={createNewSection}
      >
        <div className="flex gap-1 lg:gap-4 items-start lg:items-center flex-col lg:flex-row">
          <label className="font-bold text-nowrap">New Section:</label>
          <input
            placeholder="Enter a title"
            className="border border-black w-full lg:w-full py-1 px-3"
            onChange={handleSectionTitleInputChange}
          ></input>
        </div>
        <div className="flex justify-end items-center gap-4">
          <button
            className=" font-bold px-2 py-1 text-sm"
            onClick={toggleNewSection}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white font-bold px-2 py-1 text-sm hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={sectionTitle == "" || loading}
          >
            {loading ? "Adding Section..." : "Add Section"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSectionMenu;
