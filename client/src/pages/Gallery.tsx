import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PhotoModal from "@/components/PhotoModal";
import AddPhotoForm from "@/components/AddPhotoForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Gallery = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPhotoDialogOpen, setIsAddPhotoDialogOpen] = useState(false);

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/photos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed from your gallery",
      });
      setIsModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the photo",
        variant: "destructive",
      });
    },
  });

  const handleDeletePhoto = (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhotoMutation.mutate(id);
    }
  };

  const filteredPhotos = photos
    ? selectedCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory)
    : [];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-neutral-800 mb-4">Our Gallery</h2>
          <p className="text-lg max-w-2xl mx-auto text-neutral-800 opacity-80">
            Snapshots of our most cherished moments together.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-neutral-100 rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === "all" ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              All Photos
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === "dates" ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelectedCategory("dates")}
            >
              Dates
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === "trips" ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelectedCategory("trips")}
            >
              Trips
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === "special" ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelectedCategory("special")}
            >
              Special Days
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No photos in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-[1.03] hover:shadow-lg"
                onClick={() => {
                  setSelectedPhoto(photo);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative h-64">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-medium">{photo.title}</h3>
                    <p className="text-white text-sm opacity-80">{photo.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Dialog open={isAddPhotoDialogOpen} onOpenChange={setIsAddPhotoDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-full inline-flex items-center">
                <i className="fas fa-plus mr-2"></i> Add New Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <AddPhotoForm onSuccess={() => setIsAddPhotoDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={() => handleDeletePhoto(selectedPhoto.id)}
        />
      )}
    </section>
  );
};

export default Gallery;
