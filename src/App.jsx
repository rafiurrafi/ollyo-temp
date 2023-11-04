import { fakeImages } from "./service/fakeImageService";
import "./app.scss";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import imgPlaceholder from "./img/image.png";
const CheckboxButton = ({ handleCheckboxClicked, id }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
    handleCheckboxClicked(id);
  };

  return (
    <button
      className={`custom-checkbox ${isChecked ? "checked" : ""}`}
      onMouseDown={() => {
        handleCheckboxClick();
      }}
    ></button>
  );
};

function SortableItem({ image, handleCheckboxClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`gallery-img ${
        image.isFeature ? "gallery-img-featured" : ""
      } `}
    >
      <div
        style={{ position: "relative", display: "inline-block" }}
        onClick={() => console.log("Clicked")}
      >
        <img
          src={image.src}
          alt={`Image ${image.id}`}
          className={`${image.selected ? "gallery-img-selected" : ""}`}
        />
        <CheckboxButton
          handleCheckboxClicked={handleCheckboxClick}
          id={image.id}
        />
        <div className="gallery-img-overlay"></div>
      </div>
    </div>
  );
}

const App = () => {
  const [images, setImages] = useState(fakeImages);
  function handleDragEnd(e) {
    const { active, over } = e;
    if (active.id === over.id) {
      return;
    }
    const activeIndex = images.findIndex((image) => image.id === active.id);
    const overIndex = images.findIndex((image) => image.id === over.id);
    let newItems = [...images];
    const [removed] = newItems.splice(activeIndex, 1);
    newItems.splice(overIndex, 0, removed);

    newItems = newItems.map((img, index) =>
      index === 0 ? { ...img, isFeature: true } : { ...img, isFeature: false }
    );

    setImages(newItems);
  }

  const handleCheckboxClick = (id) => {
    console.log("checked");
    const updatedImages = images.map((image) =>
      image.id === id ? { ...image, selected: !image.selected } : image
    );
    setImages(updatedImages);
  };

  const handleDeleteSelected = () => {
    const remainingImages = images
      .filter((image) => !image.selected)
      .map((img, index) =>
        index === 0 ? { ...img, isFeature: true } : { ...img, isFeature: false }
      );
    setImages(remainingImages);
  };
  const selectedItemsNumber = images.filter((image) => image.selected).length;
  return (
    <div className="container">
      <div className="header">
        <div>
          {selectedItemsNumber ? (
            <h3 className="header-title">
              <button className={`custom-checkbox checked`}></button>
              {selectedItemsNumber} files selected
            </h3>
          ) : (
            <h3>Gallery</h3>
          )}
        </div>
        <div>
          {selectedItemsNumber ? (
            <button
              onClick={handleDeleteSelected}
              className="header-delete-btn"
            >
              Delete Selected
            </button>
          ) : null}
        </div>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={rectSwappingStrategy}>
          <div className="image-container">
            {images.map((img) => (
              <SortableItem
                key={img.id}
                image={img}
                handleCheckboxClick={handleCheckboxClick}
              />
            ))}
            <div className="image-last-item">
              <img src={imgPlaceholder} alt="" />
              <a href="#">Add Image</a>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default App;
