import { fakeImages } from "./service/fakeImageService";
import "./app.scss";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

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
        <img src={image.src} alt={`Image ${image.id}`} />

        <CheckboxButton
          handleCheckboxClicked={handleCheckboxClick}
          id={image.id}
        />
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
    // let newItems = arrayMove(images, activeIndex, overIndex);

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

  return (
    <div className="container">
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
          </div>
        </SortableContext>
      </DndContext>
      <button onClick={handleDeleteSelected} style={{ marginTop: 100 }}>
        Delete Selected
      </button>
    </div>
  );
};

export default App;
