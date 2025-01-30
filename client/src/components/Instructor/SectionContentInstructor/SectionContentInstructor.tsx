import {
  Content,
  deleteContent,
  editContent,
  getContentsDetailed,
} from "@/services/content.services";
import {
  MonitorPlay,
  Image,
  Pencil,
  Trash2,
  X,
  Minus,
  Plus,
  FileIcon,
} from "lucide-react";
import DeleteDialog from "../../DeleteDialog";
import { Menubar, MenubarMenu, MenubarTrigger } from "../../ui/menubar";
import { useState } from "react";
import { Input } from "../../ui/input";
import { toast } from "@/hooks/use-toast";

type Props = {
  courseId: string | number;
  sectionId: string | number;
  content: Content;
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;
};

const SectionContentInstructor = ({
  courseId,
  sectionId,
  content,
  setContents,
}: Props) => {
  const [showEditContent, setShowEditContent] = useState<boolean>(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [contentState, setContentState] = useState<Content>(content);
  const toggleEditContent = () => {
    setShowEditContent((prevShowEditContent) => !prevShowEditContent);
  };
  const handleDelete = async () => {
    try {
      await deleteContent(courseId, sectionId, content.id);
      setContents(await getContentsDetailed(courseId, sectionId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleContentTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContentState((prevContentState: Content) => {
      return {
        ...prevContentState,
        content: e.target.value,
      };
    });
  };

  const changeInputType = (newInput: string) => {
    if (contentState.contentType === newInput) {
      setContentState((prevContentState: Content) => {
        return {
          ...prevContentState,
          contentType: "",
        };
      });
    } else {
      setContentState((prevContentState: Content) => {
        return {
          ...prevContentState,
          contentType: newInput,
          media: null,
          content: "",
        };
      });
    }
    setMediaPreview(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentState((prevContentState: Content) => {
      return {
        ...prevContentState,
        title: e.target.value,
      };
    });
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
      setContentState((prevContentState: Content) => {
        return {
          ...prevContentState,
          media: file,
        };
      });
    }
  };

  const handleFormSubmit = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!contentState) return;

    try {
      const formData = new FormData();
      Object.entries(contentState).forEach(([key, value]) => {
        if (key === "media" && value instanceof File) {
          formData.append(key, value); // Add file if present
        }
      });
      formData.append("title", contentState.title);
      formData.append("contentType", contentState.contentType);
      formData.append("content", contentState?.content);

      await editContent(courseId, sectionId, content.id, formData);
      setContents(await getContentsDetailed(courseId, sectionId));
      toggleEditContent();
      toast({
        title: "Status",
        description: "Successfully edited course details!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Status",
        description: "Failed to update course details",
        variant: "destructive",
      });
    }
  };

  const isFormEmpty =
    content.title == "" || (content.content == "" && content.media == null);

  return (
    <>
      {!showEditContent ? (
        <div className="bg-white border border-black flex items-center gap-4 py-3 px-2">
          <div className="flex items-center gap-2">
            {content.contentType == "text" && <FileIcon size={18} />}
            {content.contentType == "video" && <MonitorPlay size={18} />}
            {content.contentType == "image" && <Image size={18} />}

            <p className="font-bold">{content.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Pencil
              size={14}
              strokeWidth={3}
              onClick={toggleEditContent}
              cursor={"pointer"}
            />
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="px-0">
                  <Trash2 size={16} cursor={"pointer"} />
                </MenubarTrigger>

                <DeleteDialog
                  handleDelete={handleDelete}
                  deleteButtonMessage="Delete"
                  deleteMessage="Are you sure you want to delete this section content?"
                />
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <div>
            <X strokeWidth={1} cursor={"pointer"} onClick={toggleEditContent} />
          </div>
          <form
            className="border border-black px-4 lg:px-2 py-4 flex flex-col gap-4 w-full bg-white"
            onSubmit={handleFormSubmit}
          >
            <div className="flex w-full gap-2 lg:gap-4 items-start lg:items-center flex-col lg:flex-row">
              <label className="font-bold text-nowrap">
                Edit Section Content:
              </label>
              <input
                placeholder="Enter a title"
                className="border border-black w-full lg:w-full py-1 px-3"
                value={contentState.title}
                onChange={handleTitleChange}
              ></input>
            </div>
            <div className="flex justify-around border-dashed border border-black py-2">
              <div
                className="flex items-center gap-1 font-bold text-green-500 cursor-pointer"
                onClick={() => changeInputType("video")}
              >
                {contentState.contentType === "video" ? (
                  <Minus size={20} strokeWidth={2} />
                ) : (
                  <Plus size={20} strokeWidth={2} />
                )}
                <p>Video</p>
              </div>
              <div
                className="flex items-center gap-1 font-bold text-green-500 cursor-pointer"
                onClick={() => changeInputType("image")}
              >
                {contentState.contentType === "image" ? (
                  <Minus size={20} strokeWidth={2} />
                ) : (
                  <Plus size={20} strokeWidth={2} />
                )}
                <p>Image</p>
              </div>
              <div
                className="flex items-center gap-1 font-bold text-green-500 cursor-pointer"
                onClick={() => changeInputType("text")}
              >
                {contentState.contentType === "text" ? (
                  <Minus size={20} strokeWidth={2} />
                ) : (
                  <Plus size={20} strokeWidth={2} />
                )}
                <p>Text/Note</p>
              </div>
            </div>
            {contentState.contentType == "image" && (
              <div>
                {mediaPreview ? (
                  <img
                    src={mediaPreview}
                    className="border shadow-md min-w-84 lg:min-w-96 min-h-48 lg:min-h-56 max-h-56"
                  ></img>
                ) : (
                  typeof content.media == "string" && (
                    <img
                      src={content.media}
                      className="border shadow-md  sm:min-w-72 md:min-w-84 lg:min-w-96 min-h-48 lg:min-h-56 max-h-56"
                    ></img>
                  )
                )}
              </div>
            )}
            {contentState.contentType == "video" && (
              <div>
                {mediaPreview ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="border shadow-md min-w-84 lg:min-w-96 min-h-48 lg:min-h-56 max-h-56"
                  />
                ) : (
                  typeof content.media == "string" && (
                    <video
                      src={content.media}
                      controls
                      className="border shadow-md sm:min-w-72 md:min-w-84 lg:min-w-96 min-h-48 lg:min-h-56 max-h-56"
                    />
                  )
                )}
              </div>
            )}
            <div className="flex w-full">
              {contentState.contentType == "text" && (
                <textarea
                  className="border border-black w-full px-2 py-1"
                  onChange={handleContentTextChange}
                  value={contentState.content}
                ></textarea>
              )}
              {contentState.contentType == "video" && (
                <Input
                  className="border border-black w-full"
                  type="file"
                  accept="video/*"
                  onChange={handleMediaChange}
                ></Input>
              )}
              {contentState.contentType == "image" && (
                <Input
                  className="border border-black w-full"
                  accept="image/*"
                  onChange={handleMediaChange}
                  type="file"
                ></Input>
              )}
            </div>
            <div className="flex justify-end items-center gap-4">
              <button
                className=" font-bold px-2 py-1 text-sm"
                onClick={toggleEditContent}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white font-bold px-2 py-1 text-sm hover:opacity-70 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isFormEmpty}
              >
                Edit Content
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SectionContentInstructor;
