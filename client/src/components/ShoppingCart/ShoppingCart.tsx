import {
  CartItem,
  checkoutCartItems,
  getCartItems,
} from "@/services/cart.service";

import { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCartView from "./CourseCartView";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/users.service";
const ShoppingCart = () => {
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }
  const { setUser } = userContext;

  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    (async () => {
      const response = await getCartItems(currentPage);
      console.log(response.results);
      setCartItems(response.results);
      setPreviousPage(response.previous);
      setNextPage(response.next);
      setTotal(response.count);
    })();
    const checkUserLoggedIn = async () => {
      try {
        setUser(await getCurrentUser());
      } catch (err: unknown) {
        setUser(null);
        console.error(err);
      }
    };
    checkUserLoggedIn();
  }, [currentPage, navigate, setUser]);
  const totalPrice = cartItems?.reduce((total, item) => {
    // Add the price of the course in the current item to the total
    return total + Number(item.course.price);
  }, 0);
  const handleCheckout = async () => {
    console.log(cartItems);
    await checkoutCartItems(cartItems || []);
    setCartItems([]);
    navigate("/my-learning");
    setPreviousPage(null);
    setNextPage(null);
    setTotal(0);
    setCurrentPage(1);
  };
  return (
    <div className="px-4 md:px-16 lg:px-48 py-6 flex flex-col">
      <div>
        <h1 className="font-bold text-4xl">Shopping Cart</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex  justify-end gap-2">
          <p>
            <ChevronLeft
              cursor={previousPage ? "pointer" : "not-allowed"}
              opacity={previousPage ? "100%" : "50%"}
              onClick={() =>
                setCurrentPage((prevCurrentPage) =>
                  previousPage ? (prevCurrentPage -= 1) : prevCurrentPage
                )
              }
            />
          </p>
          <p>
            Page {total == 0 ? 0 : currentPage} of {Math.ceil(total / 10)}
          </p>
          <p>
            <ChevronRight
              cursor={nextPage ? "pointer" : "not-allowed"}
              opacity={nextPage ? "100%" : "50%"}
              onClick={() =>
                setCurrentPage((prevCurrentPage) =>
                  nextPage ? (prevCurrentPage += 1) : prevCurrentPage
                )
              }
            />
          </p>
        </div>
      </div>
      <div className="flex justify-between flex-col md:flex-row">
        <div className="flex flex-col gap-2 w-full md:w-3/4">
          <p className="font-bold text-md">{total} Courses in Cart</p>
          <hr></hr>
          <div>
            {cartItems?.map((cartItem: CartItem) => {
              return (
                <CourseCartView
                  id={cartItem.id}
                  key={cartItem.id}
                  course={cartItem.course}
                  currentPage={currentPage}
                  setCartItems={setCartItems}
                  setPreviousPage={setPreviousPage}
                  setNextPage={setNextPage}
                  setTotal={setTotal}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col py-2 gap-4">
          <p className="font-bold text-gray-400">Total:</p>
          <h1 className="font-bold text-3xl">${totalPrice}</h1>
          <button
            className="bg-green-600 text-white px-16 text-md py-2 font-bold w-full hover:opacity-80"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
