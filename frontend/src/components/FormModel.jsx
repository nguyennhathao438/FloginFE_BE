import { XCircleIcon } from "lucide-react";
import "./FormModel.css"; // Import CSS

const FormModel = ({ title, onClose, children, width = "max-w-md" }) => {

  // Ánh xạ width prop sang class CSS thuần
  const getWidthClass = (propWidth) => {
      switch (propWidth) {
          case "max-w-sm":
              return "modal-width-sm";
          case "max-w-xl":
              return "modal-width-xl";
          case "max-w-3xl":
              return "modal-width-3xl";
          // Mặc định cho "max-w-md" và các giá trị khác
          default:
              return "modal-width-md"; 
      }
  };

  return (
    // Lớp nền mờ (fixed inset-0 z-50 flex items-center justify-center bg-black/50)
    <div className="modal-backdrop">
      {/* Lớp hộp thoại chính */}
      <div className={`modal-content ${getWidthClass(width)}`}>
        
        {/* Nút đóng (btn absolute top-2 right-1) */}
        <button
          className="modal-close-button"
          onClick={onClose}
        >
          <XCircleIcon className="close-icon"/>
        </button>
        
        {/* Tiêu đề (text-xl font-bold text-center) */}
        <h2 className="modal-title">{title}</h2>
        
        {/* Nội dung (space-y-2 overflow-y-auto max-h-[60vh]) */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormModel;
