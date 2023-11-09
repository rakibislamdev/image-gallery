import React, { useRef, useState } from "react";
import { galleryItems } from "../../GalleryItems/galleryItems";
import { BsFillImageFill } from "react-icons/bs";

const ImageGalleryContainer = () => {
  // State for the count of selected items and the list of items in the cart.
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useState(galleryItems);
  // Function to handle checkbox changes in the cart items.
  const handleCheckboxChange = (itemId) => {
    // eslint-disable-next-line array-callback-return
    cartItems.map((countItem) => {
      if (countItem.id === itemId) {
        if (countItem.isChecked) {
          setCount(count - 1);
        } else {
          setCount(count + 1);
        }
      }
    });
    // Update the cart items with the new isChecked value.
    const newCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );

    setCartItems(newCartItems);
  };
  // Function to delete all checked items from the cart.
  const handleDeleteAllChecked = () => {
    const newCartItems = cartItems.filter((item) => !item.isChecked);
    setCartItems(newCartItems);
    setCount(0);
  };
  // Function to add a new image to the cart.
  const handleImageChange = (image) => {
    if (image) {
      const newItem = {
        id: cartItems.length + 1,
        imageUrl: URL.createObjectURL(image),
        isChecked: false,
      };
      setCartItems([...cartItems, newItem]);
    }
  };
  // References for drag-and-drop functionality.
  let imageItemDrag = useRef();
  let imageItemDragOver = useRef();
  // Function to handle the start of dragging an image.
  const D_Start = (e, index) => {
    imageItemDrag.current = index;
  };
  // Function to handle the drag enter event.
  const D_Enter = (e, index) => {
    imageItemDragOver.current = index;
    // Create a copy of cart items and mark the dragged item.
    const cpArr = [...cartItems];

    let finalArr = [];

    cpArr.forEach((item) => {
      finalArr.push({
        imageUrl: item.imageUrl,
        complete: item.complete,
        isDragging: false,
      });
    });

    finalArr[index].isDragging = true;

    setCartItems(finalArr);
  };
  // Function to handle the end of dragging an image.
  const D_End = (e, index) => {
    const arr1 = [...cartItems];
    // Move the dragged item to the new position.
    const image_item_main = arr1[imageItemDrag.current];
    arr1.splice(imageItemDrag.current, 1);
    arr1.splice(imageItemDragOver.current, 0, image_item_main);

    imageItemDrag.current = null;
    imageItemDragOver.current = null;
    // Create a final array with updated positions and no dragging state.
    let f_arr = [];

    arr1.forEach((item) => {
      f_arr.push({
        imageUrl: item.imageUrl,
        complete: item.complete,
        isDragging: false,
      });
    });

    setCartItems(f_arr);
  };

  return (
    <div className="lg:w-[80%] mx-2 pb-4 my-5 rounded-md drop-shadow-md bg-white lg:mx-auto relative border">
      {count > 0 ? (
        <div className="p-5 h-20 flex justify-between items-center rounded-md bg-white ">
          <div>
            <h3 className="rounded-none bg-white text-slate-800 font-bold">
              <label className="bg-white">
                <input type="checkbox" defaultChecked />
              </label>
              <span className=" bg-white pl-2">{count}</span> Filed Selection
            </h3>
          </div>
          <div>
            <button
              onClick={handleDeleteAllChecked}
              className="rounded-none bg-white text-red-800 font-semibold"
            >
              Delete files
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-md h-20 flex justify-between items-center  bg-white">
          <h3 className="bg-white text-xl  font-bold">Gallery</h3>
        </div>
      )}
      <hr />

      <div className="grid grid-cols-2 md:grid-cols-4 py-5 lg:grid-cols-5  absolute bg-white p-2 rounded-md gap-2">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className={`bg-white ${index === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            <div
              draggable
              droppable="true"
              onDragStart={(e) => D_Start(e, index)}
              onDragEnter={(e) => D_Enter(e, index)}
              onDragEnd={(e) => D_End(e, index)}
              style={{
                textDecoration: item.complete ? "line-through" : "none",
                background: item.complete ? "bg-[#6f6f6f]" : null,
              }}
              className="bg-white border rounded-md p-0.5"
            >
              <div className="relative cursor-pointer overflow-hidden bg-cover bg-no-repeat border rounded-md">
                <img src={item.imageUrl} alt="gallery images" />

                {item.isChecked ? (
                  <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[#6f6f6f]  transition duration-300 ease-in-out opacity-30">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.id)}
                      value=""
                      className="w-4 h-4 m-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[#6f6f6f] opacity-0 transition duration-300 ease-in-out hover:opacity-70">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.id)}
                      value=""
                      className="w-4 h-4 m-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div
          className="flex  justify-center items-center cursor-pointer
               text-white border  border-dashed w-full h-full border-gray-300 rounded font-semibold py-8 md:py-14 lg:py-16 px-3"
        >
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageChange(event.target.files[0])}
              className="text-sm w-full h-full cursor-pointer hidden"
              name="image"
              id="image"
              hidden
            />
            <div className="py-4 lg:py-0">
              <div className="flex justify-center items-center cursor-pointer">
                <BsFillImageFill className="text-5xl text-slate-700" />
              </div>
              <div className="text-black cursor-pointer">Add Images</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryContainer;
