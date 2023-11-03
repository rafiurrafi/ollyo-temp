import { fakeImages } from "./service/fakeImageService";
import "./app.scss";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
function SortableItem({ image }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={image.src} />
    </div>
  );
}

const App = () => {
  const [images, setImages] = useState(fakeImages);

  function handleDragEnd(e) {
    // const { active, over } = e;
    // if (active.id !== over.id) {
    //   console.log("MEet");
    //   setImages((items) => {
    //     const activeIndex = items.findIndex((item) => item.id === active.id);
    //     const overIndex = items.findIndex((item) => item.id === over.id);
    //     console.log(activeIndex, overIndex);
    //     return arrayMove(items, activeIndex, overIndex);
    //   });
    // }
    const { active, over } = e;
    if (active.id === over.id) {
      return;
    }
    const activeIndex = images.findIndex((image) => image.id === active.id);
    const overIndex = images.findIndex((image) => image.id === over.id);
    const newItems = [...images];
    const [removed] = newItems.splice(activeIndex, 1);
    newItems.splice(overIndex, 0, removed);

    setImages(newItems);
  }
  console.log(images);
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={horizontalListSortingStrategy}>
        <div className="image-container">
          {images.map((img) => (
            <SortableItem key={img.id} image={img} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default App;
