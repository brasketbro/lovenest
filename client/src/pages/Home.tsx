import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Relationship } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { data: relationship, isLoading: relationshipLoading } = useQuery<Relationship>({
    queryKey: ["/api/relationship"],
  });

  const partner1 = relationship?.partner1 || "Mehak";
  const partner2 = relationship?.partner2 || "Swapnil";

  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero h-96 md:h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-vector/cute-couple-vector-illustration_156268-444.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl mb-4">Our Love Nest</h1>
          <p className="font-['Dancing_Script'] text-xl md:text-3xl mb-8">Every moment worth remembering</p>
          <div className="flex space-x-4">
            <Link href="/gallery">
              <Button className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-full">
                Browse Photos
              </Button>
            </Link>
            <Link href="/countdown">
              <Button variant="outline" className="bg-white hover:bg-opacity-90 text-primary px-6 py-3 rounded-full">
                Our Timeline
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-gradient-to-br from-[rgba(255,107,107,0.05)] to-[rgba(78,205,196,0.05)]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-neutral-800 mb-4">Welcome to Our Space</h2>
            <p className="text-lg max-w-2xl mx-auto text-neutral-800 opacity-80">
              A digital haven where we store our memories, dreams, and love for each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: "100ms" }}>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-camera text-primary text-xl"></i>
              </div>
              <h3 className="font-['Playfair_Display'] text-xl mb-2">Photo Gallery</h3>
              <p className="text-sm text-neutral-800 opacity-75 mb-4">
                Browse through our cherished moments and memories together.
              </p>
              <Link href="/gallery" className="text-primary hover:text-opacity-80 font-medium">
                View Gallery <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 bg-[#4ECDC4] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hourglass-half text-[#4ECDC4] text-xl"></i>
              </div>
              <h3 className="font-['Playfair_Display'] text-xl mb-2">Our Timeline</h3>
              <p className="text-sm text-neutral-800 opacity-75 mb-4">
                Track how long we've been blessed with each other's love.
              </p>
              <Link href="/countdown" className="text-[#4ECDC4] hover:text-opacity-80 font-medium">
                See Countdown <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: "300ms" }}>
              <div className="w-16 h-16 bg-[#FFD166] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-list-check text-[#FFD166] text-xl"></i>
              </div>
              <h3 className="font-['Playfair_Display'] text-xl mb-2">Bucket List</h3>
              <p className="text-sm text-neutral-800 opacity-75 mb-4">
                Adventures and dreams we want to experience together.
              </p>
              <Link href="/bucket-list" className="text-[#FFD166] hover:text-opacity-80 font-medium">
                Explore List <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/5 mb-6 md:mb-0">
                <img
                  src="https://images.unsplash.com/photo-1523585895729-a4bb980d5c14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  className="rounded-xl w-full h-64 md:h-80 object-cover"
                  alt="Love hearts"
                />
              </div>
              <div className="md:w-3/5 md:pl-10">
                <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl mb-4">Our Story</h3>
                {relationshipLoading ? (
                  <>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-11/12 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-10/12 mb-2" />
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-neutral-800 opacity-80">
                      Our journey began on March 10, 2024. What started as a simple conversation has blossomed into something beautiful. Every day we learn more about each other and grow closer.
                    </p>
                    <p className="mb-6 text-neutral-800 opacity-80">
                      This website is our digital love story - a place to create and capture all our special moments together.
                    </p>
                  </>
                )}
                <Link href="/countdown" className="inline-flex items-center text-primary font-medium">
                  <i className="fas fa-heart mr-2 animate-pulse"></i> See how long we've been together
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
