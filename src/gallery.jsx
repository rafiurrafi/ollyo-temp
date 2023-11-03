import React, { useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

const Gallery = () => {
  const [images, setImages] = useState([
    { id: 1, url: "image1.jpg", featured: true, selected: false },
    { id: 2, url: "image2.jpg", featured: false, selected: false },
    // Add more image objects here
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);

      const updatedImages = [...images];
      const [movedItem] = updatedImages.splice(oldIndex, 1);
      updatedImages.splice(newIndex, 0, movedItem);

      setImages(updatedImages);
    }
  };

  const handleImageClick = (id) => {
    const updatedImages = images.map((image) => {
      if (image.id === id) {
        return { ...image, featured: true };
      } else {
        return { ...image, featured: false };
      }
    });
    setImages(updatedImages);
  };

  const handleCheckboxChange = (id) => {
    const updatedImages = images.map((image) => {
      if (image.id === id) {
        return { ...image, selected: !image.selected };
      }
      return image;
    });
    setImages(updatedImages);
  };

  const handleDelete = () => {
    const updatedImages = images.filter((image) => !image.selected);
    setImages(updatedImages);
  };

  return (
    <SortableContext items={images} onDragEnd={handleDragEnd}>
      {images.map((image) => (
        <SortableImage
          key={image.id}
          image={image}
          onClick={() => handleImageClick(image.id)}
          onCheckboxChange={() => handleCheckboxChange(image.id)}
        />
      ))}
      <button onClick={handleDelete}>Delete Selected Images</button>
    </SortableContext>
  );
};

const SortableImage = ({ image, onClick, onCheckboxChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    // transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={image.url}
        alt={`Image ${image.id}`}
        onClick={onClick}
        style={image.featured ? { border: "2px solid red" } : null}
      />
      <input
        type="checkbox"
        checked={image.selected}
        onChange={onCheckboxChange}
      />
    </div>
  );
};

export default Gallery;
