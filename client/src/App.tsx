import "./App.css";
import NavigationBar from "./components/NavigationBar";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserProvider } from "./context/UserProvider";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import { Toaster } from "@/components/ui/toaster";
import InstructorCourse from "./components/Instructor/InstructorCourse";
import EditCourse from "./components/Instructor/EditCourse";
import HomePage from "./components/HomePage";
import SearchCourses from "./components/SearchCourses";
import ShoppingCart from "./components/ShoppingCart";
import CoursePreview from "./components/CoursePreview";
import UserProfile from "./components/UserProfile";
import MyLearning from "./components/MyLearning";
import CourseFull from "./components/CourseFull";
import Dashboard from "./components/Dashboard";

function App() {
  const location = useLocation();

  // Hide NavigationBar for specific routes
  const hideNavigationBar = ["/course/:courseId"].some((pattern) => {
    const regex = new RegExp(`^${pattern.replace(":courseId", "\\d+")}$`);
    return regex.test(location.pathname);
  });

  return (
    <>
      <UserProvider>
        {!hideNavigationBar && <NavigationBar />}
        <Routes location={location}>
          <Route path={"/"} element={<HomePage />}></Route>
          <Route path={"/login"} element={<Login />}></Route>
          <Route path={"/register"} element={<Register />}></Route>
          <Route path={"/profile"} element={<ProfilePage />}></Route>
          <Route path={"/explore"} element={<SearchCourses />}></Route>
          <Route path={"/cart"} element={<ShoppingCart />}></Route>
          <Route path={"/my-learning"} element={<MyLearning />}></Route>
          <Route path={"/user/:userId"} element={<UserProfile />}></Route>
          <Route path={"/course/:courseId"} element={<CourseFull />}></Route>
          <Route path={"/dashboard"} element={<Dashboard />}></Route>
          <Route
            path={"/preview-course/:courseId"}
            element={<CoursePreview />}
          ></Route>
          <Route
            path={"/instructor/courses"}
            element={<InstructorCourse />}
          ></Route>
          <Route
            path={"/instructor/courses/:courseId"}
            element={<EditCourse />}
          ></Route>
        </Routes>
        <Toaster />
      </UserProvider>
    </>
  );
}

export default App;
