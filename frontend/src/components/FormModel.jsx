import { XCircleIcon } from "lucide-react";
import "./css/FormModel.css";

const FormModel = ({ title, onClose, children, width = "max-w-md" }) => {
  const getWidthClass = (propWidth) => {
    switch (propWidth) {
      case "max-w-sm":
        return "modal-width-sm";
      case "max-w-xl":
        return "modal-width-xl";
      case "max-w-3xl":
        return "modal-width-3xl";
      default:
        return "modal-width-md";
    }
  };

  return (
    <div className="modal-backdrop">
      <div className={`modal-content ${getWidthClass(width)}`}>
        <button className="modal-close-button" onClick={onClose}>
          <XCircleIcon className="close-icon" />
        </button>

        {/* Tiêu đề (text-xl font-bold text-center) */}
        <h2 className="modal-title">{title}</h2>

        {/* Nội dung (space-y-2 overflow-y-auto max-h-[60vh]) */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default FormModel;
