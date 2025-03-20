import { useQuery } from "@tanstack/react-query";
import { Relationship } from "@shared/schema";

const Footer = () => {
  const { data: relationship } = useQuery<Relationship>({
    queryKey: ["/api/relationship"],
  });

  const partner1 = relationship?.partner1 || "Mehak";
  const partner2 = relationship?.partner2 || "Swapnil";

  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="font-['Dancing_Script'] text-3xl text-primary mb-2">{partner1} & {partner2}</h2>
          <p className="text-sm opacity-70">Our Love Nest</p>
        </div>
        <div className="text-center text-sm opacity-70">
          <p>Created with ❤️ | Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
