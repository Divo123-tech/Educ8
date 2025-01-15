import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  User,
  ShoppingCart,
  Compass,
  BookOpenText,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import DropdownCourse from "../DropdownCourse";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { CartItem, getCartItems } from "@/services/cart.service";
import { getCoursesTaken, UserCourseItem } from "@/services/courses.service";
import ChatRoomDialog from "./ChatRoomDialog";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [userCourses, setUserCourses] = useState<UserCourseItem[] | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [userCoursesLoading, setUserCoursesLoading] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user, setUser } = userContext;
  const fetchCartItems = async () => {
    if (!user || userCourses) return; // Prevent unnecessary calls
    setUserCoursesLoading(true);
    try {
      const response = await getCartItems(1); // Pass user ID if necessary
      setCartItems(response.results);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]); // Set to empty array if fetch fails
    } finally {
      setUserCoursesLoading(false);
    }
  };

  const fetchUserCourses = async () => {
    if (!user || cartLoading) return; // Prevent unnecessary calls
    setCartLoading(true);
    try {
      const response = await getCoursesTaken(1, ""); // Pass user ID if necessary
      setUserCourses(response.results);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setUserCourses([]); // Set to empty array if fetch fails
    } finally {
      setCartLoading(false);
    }
  };

  const [inputText, setInputText] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSearchClick = () => {
    console.log(inputText);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(inputText);
      if (inputText != "") {
        navigate(`/explore?search=${inputText}`);
      }
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background border-b shadow-md w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex items-center">
            <Link
              to=""
              className="text-2xl font-bold text-primary"
              onClick={() => console.log(user)}
            >
              Logo
            </Link>
          </div>

          <div className="relative w-2/3 lg:w-1/3 xl:w-1/2">
            <input
              className="w-full rounded-full border border-black px-3 py-2 pl-10 text-sm"
              placeholder="Search Courses By Title, Description, or Teacher!"
              onChange={handleInputChange}
              onKeyDown={handleSearchEnter}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              onClick={handleSearchClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
              />
            </svg>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-12">
              <Link to="/">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="hover:text-green-500  font-normal">
                        Explore
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="lg:w-[200px] py-2 flex flex-col gap-4 ">
                        <Link
                          to="/explore?category=Finance"
                          className="text-gray-600 hover:text-primary px-3 rounded-md text-sm   font-normal"
                        >
                          Finance
                        </Link>
                        <Link
                          to="/"
                          className="text-gray-600 hover:text-primary px-3 rounded-md text-sm  font-normal"
                        >
                          Technology
                        </Link>
                        <Link
                          to="/"
                          className="text-gray-600 hover:text-primary px-3 rounded-md text-sm  font-normal"
                        >
                          Self-development
                        </Link>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </Link>

              {user && (
                <Link
                  to="/my-learning"
                  className="text-gray-600 hover:text-primary py-2 rounded-md text-sm   font-normal"
                >
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          showIcon={false}
                          className="hover:text-green-500 font-normal"
                          onMouseEnter={fetchUserCourses} // Trigger fetch on hover
                        >
                          My Learning
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="lg:w-[250px] py-2 px-3 pb-4 flex flex-col">
                          {userCoursesLoading ? (
                            <p>Loading...</p> // Show loading state
                          ) : userCourses && userCourses.length > 0 ? (
                            userCourses?.map((item: UserCourseItem) => (
                              <DropdownCourse
                                key={item.course.id}
                                id={item.course.id}
                                title={item.course.title}
                                creator={item.course.creator.username}
                                image={item.course.thumbnail}
                              />
                            ))
                          ) : (
                            <p className="font-bold">No courses registered</p> // Handle empty cart state
                          )}
                          <div className="flex justify-center pt-4">
                            <button className="bg-black text-white w-full py-2 text-md font-bold">
                              My Learning
                            </button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </Link>
              )}

              {user && (
                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-primary rounded-md text-sm font-normal"
                >
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          showIcon={false}
                          className="hover:text-green-500"
                          onMouseEnter={fetchCartItems} // Trigger fetch on hover
                        >
                          <ShoppingCart />
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="lg:w-[250px] py-2 px-3 flex flex-col ">
                          {cartLoading ? (
                            <p>Loading...</p> // Show loading state
                          ) : cartItems && cartItems.length > 0 ? (
                            cartItems.map((cartItem: CartItem) => (
                              <DropdownCourse
                                key={cartItem.course.id}
                                id={cartItem.course.id}
                                title={cartItem.course.title}
                                creator={cartItem.course.creator.username}
                                image={cartItem.course.thumbnail}
                              />
                            ))
                          ) : (
                            <p className="font-bold">No items in the cart.</p> // Handle empty cart state
                          )}
                          <div className="flex justify-center pt-4">
                            <button className="bg-black text-white w-full py-2 text-md font-bold">
                              Go to Cart
                            </button>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </Link>
              )}

              {user ? (
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-primary py-2 rounded-md text-sm  font-normal"
                >
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          showIcon={false}
                          className="hover:text-green-500"
                        >
                          <Link to="/profile">
                            <User onClick={() => console.log(user)} />
                          </Link>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="lg:w-[120px] py-2 flex flex-col gap-4">
                          <Link
                            to="/profile"
                            className="text-gray-600 hover:text-primary px-3 rounded-md text-sm font-normal"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/instructor/courses"
                            className="text-gray-600 hover:text-primary px-3 rounded-md text-sm font-normal"
                          >
                            Instructor View
                          </Link>
                          <Link
                            to="/"
                            className="text-gray-600 hover:text-primary px-3 rounded-md text-sm font-normal"
                            onClick={logout}
                          >
                            Log out
                          </Link>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="border border-black py-2 px-3 text-xs font-bold hover:opacity-80"
                >
                  Log In
                </Link>
              )}
              {!user && (
                <Link
                  to="/register"
                  className="border border-black py-2 px-3 bg-black text-white text-xs font-bold hover:opacity-80"
                >
                  Sign Up
                </Link>
              )}
              {user && <ChatRoomDialog />}
            </div>
          </div>
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold">Explore</h1>
                    <Compass />
                  </div>
                  <Link to="/courses">All Courses</Link>
                  <Link to="/courses">Finance</Link>
                  <Link to="/courses">Technology</Link>
                  <Link to="/courses">Self-Development</Link>

                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold">Learn</h1>

                        <BookOpenText />
                      </div>
                      <Link to="/courses">My Learning</Link>
                      <Link to="/courses">Cart</Link>
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold">My Account</h1>
                        <User />
                      </div>
                      <Link to="/profile">Profile</Link>
                      <Link to="/instructor/courses">Instructor View</Link>
                      <Link to="/courses">Logout</Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold"> Account</h1>
                        <User />
                      </div>
                      <Link to="/login">Login</Link>
                      <Link to="/register">Sign Up</Link>
                    </div>
                  )}
                </div>
                {user && (
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold">Chat</h1>
                      <MessageSquareText />
                    </div>
                    <Link to="/courses">My Chats</Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
