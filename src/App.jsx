import { fakeImages } from "./service/fakeImageService";
import "./app.scss";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import imgPlaceholder from "./img/image.png";
import SortableItem from "./sortable-item/sortable-item.component";

const App = () => {
  const [images, setImages] = useState(fakeImages);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(
      KeyboardSensor,
      {
        coordinateGetter: sortableKeyboardCoordinates,
      },
      useSensor(TouchSensor)
    )
  );
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
