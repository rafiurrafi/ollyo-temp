import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CheckboxButton from "../checkbox/checkbox.component";
import "./sortable-item.style.scss";
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
export default SortableItem;
