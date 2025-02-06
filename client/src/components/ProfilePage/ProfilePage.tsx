import React, { useContext, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { User, UserContext } from "@/context/UserContext";
import ChangePasswordModal from "./ChangePasswordModal";
import { editUser, getCurrentUser } from "@/services/users.service";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill themes
const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }
  const { user, setUser } = userContext;
  const [userData, setUserData] = useState<User | null>(user); // Initialize with `user`
  const [imagePreview, setImagePreview] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const maxChars = 150;
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        setUserData(await getCurrentUser());
      } catch (err: unknown) {
        setUser(null);
        console.error(err);
        navigate("/login");
      }
    };
    checkUserLoggedIn();
  }, [navigate, setUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
      setUserData((prevUserData) => {
        if (prevUserData) {
          return {
            ...prevUserData,
            profile_picture: file, // Store the File
          };
        }
        return prevUserData;
      });
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserData((prevUserData) => {
      if (prevUserData) {
        return {
          ...prevUserData,
          [event.target.name]: event.target.value,
        };
      }
      return prevUserData; // or return a default object if null
    });
    if (event.target.name === "status") {
      setStatus(event.target.value);
    }
  };
  const handleQuillChange = (value: string) => {
    setUserData((prevUserData) => {
      if (prevUserData) {
        return {
          ...prevUserData,
          bio: value, // Update the `description` field specifically
        };
      }
      return prevUserData; // or return a default object if null
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userData) return;

    try {
      const formData = new FormData();

      // Append all fields from userData
      Object.entries(userData).forEach(([key, value]) => {
        // Skip profile_picture if no file is selected
        if (key === "profile_picture" && value instanceof File) {
          formData.append(key, value); // Add file if present
        } else if (key !== "profile_picture") {
          formData.append(key, value as string); // Add other fields (excluding profile_picture)
        }
      });
      // throw new Error();
      console.log(formData);
      const editedUser = await editUser(formData); // Pass FormData to API call
      console.log(editedUser);
      setUser(editedUser);
      toast({
        title: "Status",
        description: "Successfully edited user profile!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Status",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  const formChanged = JSON.stringify(userData) !== JSON.stringify(user);

  return (
    <div className="flex flex-col px-8 md:px-32 lg:px-64 py-12 gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-semibold font-serif">
            Profile & settings
          </h1>
          <ChangePasswordModal />
        </div>

        <hr className="border"></hr>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
        <div className="flex items-end gap-8 md:gap-12 flex-wrap">
          <div className="flex flex-col w-full md:w-2/5 gap-4">
            {imagePreview ? (
              <img src={imagePreview} className="rounded-full w-24 h-24"></img>
            ) : (
              <>
                {user?.profile_picture &&
                typeof user.profile_picture == "string" ? (
                  <img
                    src={user.profile_picture}
                    alt="profile"
                    className="rounded-full w-24 h-24"
                  />
                ) : (
                  <div className="bg-black rounded-full w-24 h-24 flex items-center justify-center">
                    <p className="font-bold text-white text-4xl">
                      {user?.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </p>
                  </div>
                )}
              </>
            )}
            <Input
              className="border-black"
              id="picture"
              type="file"
              accept="image/*"
              name="profile_picture"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex flex-col w-full md:w-2/5 gap-2">
            <label className="font-bold">Current Status</label>
            <div className="relative w-full">
              <input
                type="text"
                value={userData?.status != "null" ? userData?.status : ""}
                name="status"
                onChange={handleInputChange}
                placeholder="Max 150 Characters"
                className="border border-black px-2 py-1 w-full pr-12"
              />
              <span
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm ${
                  status.length === maxChars ? "text-red-500" : "text-gray-500"
                }`}
              >
                {maxChars - status.length}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-8 md:gap-12 flex-wrap">
          <div className="flex flex-col w-full md:w-2/5 gap-2">
            <label className="font-bold">Username</label>
            <input
              type="text"
              value={userData?.username}
              name="username"
              onChange={handleInputChange}
              className="border border-black px-2 py-1"
            ></input>
          </div>
          <div className="flex flex-col w-full md:w-2/5 gap-2">
            <label className="font-bold">Email</label>
            <input
              type="text"
              value={userData?.email}
              name="email"
              onChange={handleInputChange}
              className="border border-black px-2 py-1"
            ></input>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-5/6 gap-2">
          <label className="font-bold">Bio</label>
          <ReactQuill
            theme="snow"
            value={userData?.bio}
            onChange={handleQuillChange}
          />
        </div>
        <div>
          <button
            className={`bg-black text-white px-4 font-bold py-2 ${
              !formChanged && "opacity-60 cursor-not-allowed"
            }`}
            disabled={!formChanged}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
