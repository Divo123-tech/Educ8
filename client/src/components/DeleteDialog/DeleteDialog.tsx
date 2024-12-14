import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Trash2 } from "lucide-react";
type Props = {
  handleDelete: () => void;
};

const DeleteDialog = ({ handleDelete }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <MenubarContent>
          <MenubarItem>
            <div className="flex justify-between items-center w-full py-1 cursor-pointer">
              <p className="text-md text-red-400 font-semibold">Delete</p>
              <Trash2 size={20} color="red" />
            </div>
          </MenubarItem>
        </MenubarContent>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            Confirm Delete
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-8">
              <p className="text-lg">
                Are you sure you want to delete this course?
              </p>
              <div className="flex gap-8 justify-center sm:justify-start">
                <DialogClose asChild>
                  <button
                    className="bg-red-500 text-white font-bold px-3 py-1 text-lg"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </DialogClose>

                <DialogClose asChild>
                  <button
                    type="button"
                    className="bg-black text-white font-bold px-3 py-1 text-lg"
                  >
                    Close
                  </button>
                </DialogClose>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
