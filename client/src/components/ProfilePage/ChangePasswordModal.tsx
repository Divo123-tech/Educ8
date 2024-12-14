import { CircleAlert, Settings } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeEvent, useEffect, useState } from "react";
import { changePassword } from "@/services/users.service";
import { CircleCheckBig } from "lucide-react";

const ChangePasswordModal = () => {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [passwordSuccess, setPasswordSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (passwordSuccess) {
      const timeout = setTimeout(() => {
        setPasswordSuccess(null);
      }, 3000); // Adjust the timeout duration as needed (e.g., 3000ms = 3 seconds)

      return () => clearTimeout(timeout); // Cleanup the timeout when `courseSuccess` changes
    }
  }, [passwordSuccess]);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prevPasswordForm) => {
      return {
        ...prevPasswordForm,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(passwordForm);
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordSuccess(true);
    } catch (e: unknown) {
      console.error(e);
      setPasswordSuccess(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Settings className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-lg">
            Change Password
          </DialogTitle>
          <DialogDescription>
            {passwordSuccess && (
              <div className="flex items-center gap-4 bg-green-300 px-3 py-3">
                <CircleCheckBig className="text-black" />
                <p className="text-black font-medium">
                  Successfully changed password!
                </p>
              </div>
            )}
            {passwordSuccess == false && (
              <div className="flex items-center gap-4 bg-red-300 px-3 py-3">
                <CircleAlert className="flex-shrink-0 text-black" />

                <p className="text-black font-medium">
                  Failed to change password!
                </p>
              </div>
            )}
            <form
              className="flex flex-col gap-4 mt-2"
              onSubmit={handleFormSubmit}
            >
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Current Password"
                  name="oldPassword"
                  className="border border-black px-2 py-2 text-sm"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black font-medium">New Password</label>
                <input
                  placeholder="Enter New Password"
                  type="password"
                  name="newPassword"
                  className="border border-black px-2 py-2 text-sm"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex justify-end">
                <DialogClose asChild>
                  <button className="bg-black text-white px-3 py-2 font-bold">
                    Change Password
                  </button>
                </DialogClose>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
