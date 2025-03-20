import { Photo } from "@shared/schema";
import { formatDate } from "@/lib/utils";

interface PhotoModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const PhotoModal = ({ photo, isOpen, onClose, onDelete }: PhotoModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button className="absolute top-6 right-6 text-white text-3xl hover:text-opacity-80">
        <i className="fas fa-times"></i>
      </button>
      <div className="max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-auto max-h-[80vh] object-contain"
        />
        <div className="mt-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-medium">{photo.title}</h3>
              <p className="text-sm opacity-80">{photo.date}</p>
              {photo.caption && <p className="mt-2 text-sm opacity-90">{photo.caption}</p>}
            </div>
            <button
              onClick={onDelete}
              className="text-white opacity-70 hover:opacity-100 transition-opacity"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
