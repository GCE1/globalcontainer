import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import iicl from '@assets/IICL.png';
import cargoWorthy from '@assets/Cargo-Worthy.png';
import windWaterTight from '@assets/Wind&Water-Tight.png';
import asIs from '@assets/Damaged-As-Is_1749156494264.png';

interface ContainerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  containerType: string;
}

export function ContainerDetailsModal({ isOpen, onClose, containerType }: ContainerDetailsModalProps) {
  const getContent = () => {
    switch (containerType) {
      case 'iicl':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading text-[#0054A6] mb-2">IICL Certified Containers</DialogTitle>
              <DialogDescription className="text-[#666666] text-base">
                The gold standard in shipping container quality and certification
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <img 
                src={iicl} 
                alt="IICL Certified Container" 
                className="w-full h-auto rounded-md mb-4" 
              />
            </div>
            
            <div className="space-y-4 text-[#333333]">
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#0054A6] mb-2">What is IICL Certification?</h3>
                <p className="mb-2">
                  IICL (Institute of International Container Lessors) certification represents the highest quality standard in the shipping container industry. Each IICL certified container undergoes a comprehensive inspection process conducted by authorized surveyors.
                </p>
                <p>
                  The certification ensures that containers meet exacting international standards for structural integrity, weatherproofing, and operational functionality, making them suitable for the most demanding shipping requirements.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#0054A6] mb-2">Detailed Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Physical Condition</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Premium condition with minimal wear</li>
                      <li>No structural damage or repairs</li>
                      <li>Pristine interior condition</li>
                      <li>Fully functional doors and sealing mechanisms</li>
                      <li>Exterior appearance of near-new quality</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Certification & Documentation</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Valid CSC plate (Convention for Safe Containers)</li>
                      <li>IICL-5 or IICL-6 inspection criteria met</li>
                      <li>Manufacturer's warranty documentation</li>
                      <li>Complete service and repair history</li>
                      <li>Detailed inspection reports available</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#0054A6] mb-2">Ideal Applications</h3>
                <p className="mb-2">IICL certified containers are ideal for:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>International ocean shipping of high-value cargo</li>
                  <li>Long-term leasing and investment opportunities</li>
                  <li>Sensitive or regulated cargo requiring pristine conditions</li>
                  <li>Premium storage solutions for valuable goods</li>
                  <li>Companies with corporate environmental and quality standards</li>
                </ul>
                <p className="font-semibold text-[#0054A6]">
                  Premium pricing reflects the superior quality, longer lifespan, and enhanced cargo protection.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button className="bg-[#0054A6]">Request Quote</Button>
            </DialogFooter>
          </>
        );
        
      case 'cargo-worthy':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading text-[#00A651] mb-2">Cargo Worthy (CWO) Containers</DialogTitle>
              <DialogDescription className="text-[#666666] text-base">
                Certified for international shipping at economical pricing
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <img 
                src={cargoWorthy} 
                alt="Cargo Worthy Container" 
                className="w-full h-auto rounded-md mb-4" 
              />
            </div>
            
            <div className="space-y-4 text-[#333333]">
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#00A651] mb-2">What is Cargo Worthy Certification?</h3>
                <p className="mb-2">
                  Cargo Worthy (CWO) certification indicates that a container has been inspected by authorized marine cargo surveyors and deemed suitable for international shipping. This certification confirms the container's structural integrity, weather resistance, and security features meet the requirements for ocean transport.
                </p>
                <p>
                  CWO containers represent an excellent balance between quality and affordability, making them a popular choice for general cargo shipping and various international trade applications.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#00A651] mb-2">Detailed Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Physical Condition</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Good overall condition with minor wear acceptable</li>
                      <li>No significant structural damage</li>
                      <li>Properly functioning doors and locking mechanisms</li>
                      <li>Effective weather sealing throughout</li>
                      <li>May show signs of previous use and cosmetic wear</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Certification & Documentation</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Valid CSC plate</li>
                      <li>CWO certification from authorized surveyor</li>
                      <li>Documented inspection reports</li>
                      <li>International shipping clearance</li>
                      <li>Limited warranty options available</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#00A651] mb-2">Ideal Applications</h3>
                <p className="mb-2">Cargo Worthy containers are ideal for:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>General cargo international shipping</li>
                  <li>Cost-effective transportation for non-sensitive goods</li>
                  <li>Regular import/export operations</li>
                  <li>Businesses seeking quality containers at mid-range pricing</li>
                  <li>Secure storage with international relocation potential</li>
                </ul>
                <p className="font-semibold text-[#00A651]">
                  CWO containers offer an excellent balance between quality and cost for companies requiring reliable international shipping capability.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button className="bg-[#00A651]">Request Quote</Button>
            </DialogFooter>
          </>
        );
        
      case 'wind-water-tight':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading text-[#F7941D] mb-2">Wind & Watertight (WWT) Containers</DialogTitle>
              <DialogDescription className="text-[#666666] text-base">
                Economic solutions for domestic transport and storage
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <img 
                src={windWaterTight} 
                alt="Wind and Water Tight Container" 
                className="w-full h-auto rounded-md mb-4" 
              />
            </div>
            
            <div className="space-y-4 text-[#333333]">
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#F7941D] mb-2">What is Wind & Watertight Classification?</h3>
                <p className="mb-2">
                  Wind & Watertight (WWT) containers are inspected to ensure they provide adequate protection against environmental elements. These containers maintain weatherproof capabilities that prevent water leakage and wind penetration, making them suitable for storage and domestic transportation needs.
                </p>
                <p>
                  While WWT containers may have more visible signs of wear than CWO containers, they maintain functional integrity and offer significant value for applications that don't require international shipping certification.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#F7941D] mb-2">Detailed Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Physical Condition</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Functional condition with cosmetic wear acceptable</li>
                      <li>No leaks when exposed to rain or water</li>
                      <li>Operational doors with functioning gaskets</li>
                      <li>May show dents, scratches, and paint wear</li>
                      <li>Previous repairs may be present if properly executed</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Usage & Limitations</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Not certified for international ocean shipping</li>
                      <li>Suitable for domestic transportation</li>
                      <li>Excellent for static storage applications</li>
                      <li>Appropriate for modification projects</li>
                      <li>May require additional preparation for sensitive goods</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#F7941D] mb-2">Ideal Applications</h3>
                <p className="mb-2">Wind & Watertight containers are ideal for:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Domestic transportation and regional logistics</li>
                  <li>On-site storage for construction projects</li>
                  <li>General storage for tools, equipment, and materials</li>
                  <li>Base structures for container modification projects</li>
                  <li>Budget-conscious storage solutions</li>
                </ul>
                <p className="font-semibold text-[#F7941D]">
                  WWT containers provide excellent value for those needing weather protection without the premium cost of international shipping certification.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button className="bg-[#F7941D]">Request Quote</Button>
            </DialogFooter>
          </>
        );
        
      case 'as-is':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading text-[#666666] mb-2">As-Is / Damaged Containers</DialogTitle>
              <DialogDescription className="text-[#666666] text-base">
                Budget containers for modification projects and creative applications
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <img 
                src={asIs} 
                alt="As-Is Container" 
                className="w-full h-auto rounded-md mb-4" 
              />
            </div>
            
            <div className="space-y-4 text-[#333333]">
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#666666] mb-2">What are As-Is Containers?</h3>
                <p className="mb-2">
                  As-Is containers are sold with documented existing damage and are priced accordingly. These containers may have structural issues, significant wear, or other conditions that make them unsuitable for traditional shipping or storage without repairs.
                </p>
                <p>
                  While not ideal for conventional cargo use, As-Is containers offer tremendous value for modification projects, parts harvesting, and creative repurposing opportunities at significantly reduced prices.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#666666] mb-2">Detailed Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Physical Condition</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Sold with documented damage or defects</li>
                      <li>May have structural issues requiring repair</li>
                      <li>Variable condition - ranging from minor to significant damage</li>
                      <li>Could include floor damage, wall punctures, or door issues</li>
                      <li>Condition thoroughly documented before purchase</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#F5F5F5] p-4 rounded-md">
                    <h4 className="font-semibold mb-2 text-[#333333]">Usage & Limitations</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Not suitable for shipping without repairs</li>
                      <li>May require significant modification for storage use</li>
                      <li>Potential weather-tightness issues</li>
                      <li>Sold without certification or warranty</li>
                      <li>Should be thoroughly inspected before purchase</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#666666] mb-2">Ideal Applications</h3>
                <p className="mb-2">As-Is containers are ideal for:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Container modification projects (tiny homes, offices, etc.)</li>
                  <li>Parts salvage for container repairs</li>
                  <li>Art installations and creative projects</li>
                  <li>Temporary structures with planned modifications</li>
                  <li>Budget scenarios where repairs can be handled in-house</li>
                </ul>
                <p className="font-semibold text-[#666666]">
                  As-Is containers offer the most economical entry point and are perfect for projects where extensive modifications are planned.
                </p>
              </div>
              
              <div className="bg-[#FFF4E5] p-4 rounded-md border-l-4 border-[#F7941D]">
                <h4 className="font-semibold mb-2 text-[#F7941D]">Buyer Advisory</h4>
                <p className="text-sm">
                  As-Is containers are sold without warranties and with full disclosure of existing damage. We strongly recommend personally inspecting these containers before purchase or requesting detailed condition reports with photographs. All sales are final, so understanding exactly what you're purchasing is essential.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button className="bg-[#666666]">Request Quote</Button>
            </DialogFooter>
          </>
        );
        
      default:
        return <p>Container details not found</p>;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {getContent()}
      </DialogContent>
    </Dialog>
  );
}