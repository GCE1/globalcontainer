import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import 20GP CW container images
import cwImage1 from "@assets/20GP-Cw/20GP CW.png";
import cwImage2 from "@assets/20GP-Cw/20gp cw-2.png";
import cwImage3 from "@assets/20GP-Cw/20GP CW-3.png";
import cwImage4 from "@assets/20GP-Cw/20GP Cw-4.png";
import cwImage5 from "@assets/20GP-Cw/20gp Cw-5.png";

// Import 20GP DoubleDoor container images
import doubleDoor1 from "@assets/20GP-DoubleDoor/20GP-Doubledoor.png";
import doubleDoor2 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-2.png";
import doubleDoor3 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-3.png";
import doubleDoor4 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-4.png";
import doubleDoor5 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-5.png";
import doubleDoor6 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-6.png";
import doubleDoor7 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-7.png";
import doubleDoor8 from "@assets/20GP-DoubleDoor/20GP-Doubledoor-8.png";

// Import 20GP Full Open Sidedoor container images
import sideDoor1 from "@assets/20GP-Full-Open-Sidedoor/20GP-Full-Open-Sidedoor.png";
import sideDoor2 from "@assets/20GP-Full-Open-Sidedoor/20GP-Full-Open-Sidedoor-2.png";
import sideDoor3 from "@assets/20GP-Full-Open-Sidedoor/20GP-Full-open-Sidedoor-3.png";

// Import 20GP IICL container images
import iicl1 from "@assets/20GP-IICL/20GP-IICL.png";
import iicl2 from "@assets/20GP-IICL/20GP-IICL-2.png";
import iicl3 from "@assets/20GP-IICL/20GP-IICL-3.png";
import iicl4 from "@assets/20GP-IICL/20GP-IICL-4.png";
import iicl5 from "@assets/20GP-IICL/20GP-IICL-5.png";

// Import 20GP Multi-Side Door container images
import multiSide1 from "@assets/20GP-Multi-sidedoor/20GP-Multi-sidedoor.png";
import multiSide2 from "@assets/20GP-Multi-sidedoor/20GP-Multi-sidedoor-2.png";
import multiSide3 from "@assets/20GP-Multi-sidedoor/20Gp-Multi-sidedoor-3.png";
import multiSide4 from "@assets/20GP-Multi-sidedoor/20GP-Multi-sidedoor-4.png";

// Import 20GP New container images
import newContainer1 from "@assets/20GP-New/20GP-New.png";
import newContainer2 from "@assets/20GP-New/20GP-New-2.png";
import newContainer3 from "@assets/20GP-New/20GP-New-3.png";
import newContainer4 from "@assets/20GP-New/20GP-New-4.png";
import newContainer5 from "@assets/20GP-New/20GP-New-5.png";
import newContainer6 from "@assets/20GP-New/20GP-New-6.png";
import newContainer7 from "@assets/20GP-New/20GP-New-7.png";

// Import 20GP Open Top Cargo Worthy container images
import otcw1 from "@assets/20GP-OT-CW/20GP-OT-CW.png";
import otcw2 from "@assets/20GP-OT-CW/20GP-OT-CW-2.png";
import otcw3 from "@assets/20GP-OT-CW/20GP-OT-CW-3.png";
import otcw4 from "@assets/20GP-OT-CW/20GP-OT-CW-4.png";

// Import 20GP Open Top Wind and Water Tight container images
import otwwt1 from "@assets/20GP-OT-WWT/20GP-OT-WWT.png";
import otwwt2 from "@assets/20GP-OT-WWT/20GP-OT-WWT-2.png";
import otwwt3 from "@assets/20GP-OT-WWT/20GP-OT-WWT-3.png";
import otwwt4 from "@assets/20GP-OT-WWT/20GP-OT-WWT-4.png";

// Import 20GP Refrigerated container images
import rf1 from "@assets/20GP-RF/20GP-RF.png";
import rf2 from "@assets/20GP-RF/20GP-RF-2.png";
import rf3 from "@assets/20GP-RF/20GP-RF-3.png";
import rf4 from "@assets/20GP-RF/20GP-RF-4.png";

// Import 20GP Refrigerated Cargo Worthy container images
import rfcw1 from "@assets/20GP-RF-CW/20GP-RF-CW.png";

// Import 20GP Refrigerated Wind and Water Tight container images
import rfwwt1 from "@assets/20GP-RF-WWT/20GP-RF-WWT.png";

// Import 20GP Wind and Water Tight container images
import wwt1 from "@assets/20GP-WWT/20GP-WWT.png";
import wwt2 from "@assets/20GP-WWT/20GP-WWT-2.png";

// Import 20HC Brand New container images
import hcBrandNew1 from "@assets/20HC-New/20HC-Brandnew.png";
import hcBrandNew2 from "@assets/20HC-New/20HC-Brandnew-2.png";
import hcBrandNew3 from "@assets/20HC-New/20HC-Brandnew-3.png";




// Import 40GP Brand New container images
import gp40BrandNew1 from "@assets/40GP-BrandNew/40GP-Brandnew.png";
import gp40BrandNew2 from "@assets/40GP-BrandNew/40GP-Brandnew-2.png";

// Import 40GP CW container images
import gp40CW1 from "@assets/40GP-CW/40GP-CW.png.webp";
import gp40CW2 from "@assets/40GP-CW/40GP-CW-2.png";

// Import 40GP DoubleDoor container images
import gp40DoubleDoor1 from "@assets/40GP-DoubleDoor/40GP-Doubledoor.png";
import gp40DoubleDoor2 from "@assets/40GP-DoubleDoor/40GP-Doubledoor-2.png";
import gp40DoubleDoor3 from "@assets/40GP-DoubleDoor/40GP-Doubledoor-3.png";

// Import 40GP Open Top Brand New container images
import gp40OTBrandNew1 from "@assets/40GP-OT-BrandNew/40GP-OT-Brandnew.png";
import gp40OTBrandNew2 from "@assets/40GP-OT-BrandNew/40GP-OT-Brandnew-2.png";
import gp40OTBrandNew3 from "@assets/40GP-OT-BrandNew/40GP-OT-Brandnew-3.png";
import gp40OTBrandNew4 from "@assets/40GP-OT-BrandNew/40GP-OT-Brandnew-4.png";
import gp40OTBrandNew5 from "@assets/40GP-OT-BrandNew/40GP-OT-Brandnew-5.png";

// Import 40GP WWT container images
import gp40WWT1 from "@assets/40GP-WWT/40GP-WWT.png";
import gp40WWT2 from "@assets/40GP-WWT/40GP-WWT-2.png";
import gp40WWT3 from "@assets/40GP-WWT/40GP-WWT-3.png";

// Import 40HC Brand New container images
import hc40BrandNew1 from "@assets/40HC-Brandnew/40HC New.png";
import hc40BrandNew2 from "@assets/40HC-Brandnew/40HC New-2.png";
import hc40BrandNew3 from "@assets/40HC-Brandnew/40HC New-3.png";
import hc40BrandNew4 from "@assets/40HC-Brandnew/40HC New-4.png";

// Import 40HC Full Open Sidedoor container images
import hc40FullOpenSidedoor1 from "@assets/40HC-Full-open-Sidedoor/40HC-Full-Open-Sidedoor.png";
import hc40FullOpenSidedoor2 from "@assets/40HC-Full-open-Sidedoor/40HC-Full-Open-Sidedoor-2.png";
import hc40FullOpenSidedoor3 from "@assets/40HC-Full-open-Sidedoor/40HC-Full-Open-Sidedoor-3.png";
import hc40FullOpenSidedoor4 from "@assets/40HC-Full-open-Sidedoor/40HC-Full-Open-Sidedoor-4.png";

// Import 40HC Multi-sidedoor container images
import hc40MultiSidedoor1 from "@assets/40HC-Multi-sidedoor/40HC-Multi-sidedoor.png";
import hc40MultiSidedoor2 from "@assets/40HC-Multi-sidedoor/40HC-Multi-sidedoor-2.png";
import hc40MultiSidedoor3 from "@assets/40HC-Multi-sidedoor/40HC-Multi-sidedoor-3.png";
import hc40MultiSidedoor4 from "@assets/40HC-Multi-sidedoor/40HC-Multi-sidedoor-4.png";
import hc40MultiSidedoor5 from "@assets/40HC-Multi-sidedoor/40HC-Multi-sidedoor-5.png";

// 40HC Open Top Cargo Worthy images
import hc40OTCW1 from "@assets/40HC-OT-CW/40HC-OT-CW.png";
import hc40OTCW2 from "@assets/40HC-OT-CW/40HC-OT-CW-2.png";
import hc40OTCW3 from "@assets/40HC-OT-CW/40HC-OT-CW-3.png";
import hc40OTCW4 from "@assets/40HC-OT-CW/40HC-OT-CW-4.png";
import hc40OTCW5 from "@assets/40HC-OT-CW/40HC-OT-CW-5.png";

// 40HC Open Top IICL images
import hc40OTIICL1 from "@assets/40HC-OT-IICL/40HC-OT-IICL.png";
import hc40OTIICL2 from "@assets/40HC-OT-IICL/40HC-OT-IICL-2.png";
import hc40OTIICL3 from "@assets/40HC-OT-IICL/40HC-OT-IICL-3.png";

// 40HC Open Top WWT images
import hc40OTWWT1 from "@assets/40HC-OT-WWT/40HC-OT-WWT.png";
import hc40OTWWT2 from "@assets/40HC-OT-WWT/40HC-OT-WWT-2.png";
import hc40OTWWT3 from "@assets/40HC-OT-WWT/40HC-OT-WWT-3.png";
import hc40OTWWT4 from "@assets/40HC-OT-WWT/40HC-OT-WWT-4.png";
import hc40OTWWT5 from "@assets/40HC-OT-WWT/40HC-OT-WWT-5.png";

// 40HC Refrigerated (RF) images
import hc40RF1 from "@assets/40HC-RF/40HC-RF.png";
import hc40RF2 from "@assets/40HC-RF/40HC-RF-2.png";
import hc40RF3 from "@assets/40HC-RF/40HC-RF-3.png";

// 40HC Refrigerated Cargo Worthy (RF-CW) images
import hc40RFCW1 from "@assets/40HC-RF-CW/40HC-RF-CW.png";
import hc40RFCW2 from "@assets/40HC-RF-CW/40HC-RF-CW-2.png";
import hc40RFCW3 from "@assets/40HC-RF-CW/40HC-RF-CW-3.png";
import hc40RFCW4 from "@assets/40HC-RF-CW/40HC-RF-CW-4.png";
import hc40RFCW5 from "@assets/40HC-RF-CW/40HC-RF-CW-5.png";

// 40HC Refrigerated Wind and Water Tight (RF-WWT) images
import hc40RFWWT1 from "@assets/40HC-RF-WWT/40HC-RF-WWT.png";
import hc40RFWWT2 from "@assets/40HC-RF-WWT/40HC-RF-WWT-2.png";
import hc40RFWWT3 from "@assets/40HC-RF-WWT/40HC-RF-WWT-3.png";
import hc40RFWWT4 from "@assets/40HC-RF-WWT/40HC-RF-WWT-4.png";
import hc40RFWWT5 from "@assets/40HC-RF-WWT/40HC-RF-WWT-5.png";

// 40HC Wind and Water Tight (WWT) images
import hc40WWT1 from "@assets/40HC-WWT/40HC-WWT.png";
import hc40WWT2 from "@assets/40HC-WWT/40HC-WWT-2.png";
import hc40WWT3 from "@assets/40HC-WWT/40HC-WWT-3.png";

// 45HC container images
import hc45_1 from "@assets/45HC/45HC.png";
import hc45_2 from "@assets/45HC/45HC-2.png";
import hc45_3 from "@assets/45HC/45HC-3.png";
import hc45_4 from "@assets/45HC/45HC-4.png";

// 45HC-CW container images
import hc45CW from "@assets/45HC-CW/45HC-CW.png";

// 45HC-IICL container images
import hc45IICL1 from "@assets/45HC-IICL/45HC-IICL.png";
import hc45IICL2 from "@assets/45HC-IICL/45HC-IICL-2.png";
import hc45IICL3 from "@assets/45HC-IICL/45HC-IICL-3.png";
import hc45IICL4 from "@assets/45HC-IICL/45HC-IICL-4.png";
import hc45IICL5 from "@assets/45HC-IICL/45HC-IICL-5.png";

// 45HC-WWT container images
import hc45WWT1 from "@assets/45HC-WWT/45HC-WWT.png";
import hc45WWT2 from "@assets/45HC-WWT/45HC-WWT-2.png";
import hc45WWT3 from "@assets/45HC-WWT/45HC-WWT-3.png";

// 53HC-BrandNew container images
import hc53BrandNew1 from "@assets/53HC-BrandNew/53HC-Brandnew.png";
import hc53BrandNew2 from "@assets/53HC-BrandNew/53HC-Brandnew-2.png";
import hc53BrandNew3 from "@assets/53HC-BrandNew/53HC-Brandnew-3.png";
import hc53BrandNew4 from "@assets/53HC-BrandNew/53HC-Brandnew-4.png";

// 53HC-OT-BrandNew container images
import hc53OTBrandNew1 from "@assets/53HC-OT-BrandNew/53HC-BrandNew.png";
import hc53OTBrandNew2 from "@assets/53HC-OT-BrandNew/53HC-OT-Brandnew-2.png";

// Import 40GP AS IS container images
import gp40AsIs1 from "@assets/40GP-as-Is/40GPAS-IS.png";
import gp40AsIs2 from "@assets/40GP-as-Is/40GPAS-IS-1.png";
import gp40AsIs3 from "@assets/40GP-as-Is/40GPAS-IS-2.png";
import hc40AsIs1 from "@assets/40HC-as-is/40HCAS-IS.png";
import hc40AsIs2 from "@assets/40HC-as-is/40HCAS-IS-2.png";
import hc40AsIs3 from "@assets/40HC-as-is/40HCAS-IS-3.png";

// Import 40HC CW container images
import hc40CW1 from "@assets/40HC-CW/2d3571b5-2a7e-4de6-b6a1-0a5402004be6..jpeg";
import hc40CW2 from "@assets/40HC-CW/e1884a70-8b5a-44fb-bbb4-98a2a5ef1a7b.JPG.png";

// Import 40HC IICL container images
import hc40IICL1 from "@assets/40HC-IICL/40HC-IICL.png";
import hc40IICL2 from "@assets/40HC-IICL/40HC-IICL-2.png";

// Import default unavailable container image
import defaultUnavailableContainer from "@assets/trading-default-container.png_1749485282339.avif";



interface ContainerCarouselProps {
  containerType?: string;
  containerSku?: string;
  containerCondition?: string;
  searchedContainerType?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export default function ContainerCarousel({ 
  containerType, 
  containerSku,
  containerCondition,
  searchedContainerType,
  className = "",
  autoPlay = true,
  showControls = true 
}: ContainerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  




  // 20GP CW container images array
  const cwImages = [
    { src: cwImage1, alt: "20GP CW Container - Front View" },
    { src: cwImage2, alt: "20GP CW Container - Side View" },
    { src: cwImage3, alt: "20GP CW Container - Angle View" },
    { src: cwImage4, alt: "20GP CW Container - Open View" },
    { src: cwImage5, alt: "20GP CW Container - Detail View" }
  ];

  // 20GP DoubleDoor container images array
  const doubleDoorImages = [
    { src: doubleDoor1, alt: "20GP DoubleDoor Container - Main View" },
    { src: doubleDoor2, alt: "20GP DoubleDoor Container - Side View" },
    { src: doubleDoor3, alt: "20GP DoubleDoor Container - Front View" },
    { src: doubleDoor4, alt: "20GP DoubleDoor Container - Open View" },
    { src: doubleDoor5, alt: "20GP DoubleDoor Container - Interior View" },
    { src: doubleDoor6, alt: "20GP DoubleDoor Container - Angle View" },
    { src: doubleDoor7, alt: "20GP DoubleDoor Container - Detail View" },
    { src: doubleDoor8, alt: "20GP DoubleDoor Container - Full View" }
  ];

  // 20GP Full Open Sidedoor container images array
  const sideDoorImages = [
    { src: sideDoor1, alt: "20GP Full Open Sidedoor Container - Main View" },
    { src: sideDoor2, alt: "20GP Full Open Sidedoor Container - Side View" },
    { src: sideDoor3, alt: "20GP Full Open Sidedoor Container - Open View" }
  ];

  // 20GP IICL container images array
  const iiclImages = [
    { src: iicl1, alt: "20GP IICL Container - Main View" },
    { src: iicl2, alt: "20GP IICL Container - Side View" },
    { src: iicl3, alt: "20GP IICL Container - Front View" },
    { src: iicl4, alt: "20GP IICL Container - Detail View" },
    { src: iicl5, alt: "20GP IICL Container - Full View" }
  ];

  // 20GP Multi-Side Door container images array
  const multiSideImages = [
    { src: multiSide1, alt: "20GP Multi-Side Door Container - Main View" },
    { src: multiSide2, alt: "20GP Multi-Side Door Container - Side View" },
    { src: multiSide3, alt: "20GP Multi-Side Door Container - Open View" },
    { src: multiSide4, alt: "20GP Multi-Side Door Container - Detail View" }
  ];

  // 20GP New container images array
  const newContainerImages = [
    { src: newContainer1, alt: "20GP New Container - Main View" },
    { src: newContainer2, alt: "20GP New Container - Side View" },
    { src: newContainer3, alt: "20GP New Container - Front View" },
    { src: newContainer4, alt: "20GP New Container - Angle View" },
    { src: newContainer5, alt: "20GP New Container - Interior View" },
    { src: newContainer6, alt: "20GP New Container - Detail View" },
    { src: newContainer7, alt: "20GP New Container - Complete View" }
  ];

  // 20GP Open Top Cargo Worthy container images array
  const otcwImages = [
    { src: otcw1, alt: "20GP Open Top Cargo Worthy Container - Main View" },
    { src: otcw2, alt: "20GP Open Top Cargo Worthy Container - Side View" },
    { src: otcw3, alt: "20GP Open Top Cargo Worthy Container - Open Top View" },
    { src: otcw4, alt: "20GP Open Top Cargo Worthy Container - Detail View" }
  ];

  // 20GP Open Top Wind and Water Tight container images array
  const otwwtImages = [
    { src: otwwt1, alt: "20GP Open Top Wind and Water Tight Container - Main View" },
    { src: otwwt2, alt: "20GP Open Top Wind and Water Tight Container - Side View" },
    { src: otwwt3, alt: "20GP Open Top Wind and Water Tight Container - Open Top View" },
    { src: otwwt4, alt: "20GP Open Top Wind and Water Tight Container - Detail View" }
  ];

  // 20GP Refrigerated container images array
  const rfImages = [
    { src: rf1, alt: "20GP Refrigerated Container - Main View" },
    { src: rf2, alt: "20GP Refrigerated Container - Side View" },
    { src: rf3, alt: "20GP Refrigerated Container - Internal View" },
    { src: rf4, alt: "20GP Refrigerated Container - Detail View" }
  ];

  // 20GP Refrigerated Cargo Worthy container images array
  const rfcwImages = [
    { src: rfcw1, alt: "20GP Refrigerated Cargo Worthy Container - Main View" }
  ];

  // 20GP Refrigerated Wind and Water Tight container images array
  const rfwwtImages = [
    { src: rfwwt1, alt: "20GP Refrigerated Wind and Water Tight Container - Main View" }
  ];

  // 20GP Wind and Water Tight container images array
  const wwtImages = [
    { src: wwt1, alt: "20GP Wind and Water Tight Container - Main View" },
    { src: wwt2, alt: "20GP Wind and Water Tight Container - Side View" }
  ];

  // 20HC Brand New container images array
  const hcBrandNewImages = [
    { src: hcBrandNew1, alt: "20HC Brand New High Cube Container - Main View" },
    { src: hcBrandNew2, alt: "20HC Brand New High Cube Container - Side View" },
    { src: hcBrandNew3, alt: "20HC Brand New High Cube Container - Detail View" }
  ];




  // 40GP Brand New container images array
  const gp40BrandNewImages = [
    { src: gp40BrandNew1, alt: "40GP Brand New General Purpose Container - Main View" },
    { src: gp40BrandNew2, alt: "40GP Brand New General Purpose Container - Side View" }
  ];

  // 40GP CW container images array
  const gp40CWImages = [
    { src: gp40CW1, alt: "40GP Cargo Worthy General Purpose Container - Main View" },
    { src: gp40CW2, alt: "40GP Cargo Worthy General Purpose Container - Side View" }
  ];

  // 40GP DoubleDoor container images array
  const gp40DoubleDoorImages = [
    { src: gp40DoubleDoor1, alt: "40GP DoubleDoor General Purpose Container - Main View" },
    { src: gp40DoubleDoor2, alt: "40GP DoubleDoor General Purpose Container - Side View" },
    { src: gp40DoubleDoor3, alt: "40GP DoubleDoor General Purpose Container - Detail View" }
  ];

  // 40GP Open Top Brand New container images array
  const gp40OTBrandNewImages = [
    { src: gp40OTBrandNew1, alt: "40GP Open Top Brand New Container - Main View" },
    { src: gp40OTBrandNew2, alt: "40GP Open Top Brand New Container - Side View" },
    { src: gp40OTBrandNew3, alt: "40GP Open Top Brand New Container - Detail View" },
    { src: gp40OTBrandNew4, alt: "40GP Open Top Brand New Container - Interior View" },
    { src: gp40OTBrandNew5, alt: "40GP Open Top Brand New Container - Complete View" }
  ];

  // 40GP WWT container images array
  const gp40WWTImages = [
    { src: gp40WWT1, alt: "40GP Wind and Water Tight Container - Main View" },
    { src: gp40WWT2, alt: "40GP Wind and Water Tight Container - Side View" },
    { src: gp40WWT3, alt: "40GP Wind and Water Tight Container - Detail View" }
  ];

  // 40HC Brand New container images array
  const hc40BrandNewImages = [
    { src: hc40BrandNew1, alt: "40HC Brand New High Cube Container - Main View" },
    { src: hc40BrandNew2, alt: "40HC Brand New High Cube Container - Side View" },
    { src: hc40BrandNew3, alt: "40HC Brand New High Cube Container - Detail View" },
    { src: hc40BrandNew4, alt: "40HC Brand New High Cube Container - Complete View" }
  ];

  // 40HC Full Open Sidedoor container images array
  const hc40FullOpenSidedoorImages = [
    { src: hc40FullOpenSidedoor1, alt: "40HC Full Open Sidedoor High Cube Container - Main View" },
    { src: hc40FullOpenSidedoor2, alt: "40HC Full Open Sidedoor High Cube Container - Side View" },
    { src: hc40FullOpenSidedoor3, alt: "40HC Full Open Sidedoor High Cube Container - Open Side View" },
    { src: hc40FullOpenSidedoor4, alt: "40HC Full Open Sidedoor High Cube Container - Detail View" }
  ];

  // 40HC Multi-sidedoor container images array
  const hc40MultiSidedoorImages = [
    { src: hc40MultiSidedoor1, alt: "40HC Multi-sidedoor High Cube Container - Main View" },
    { src: hc40MultiSidedoor2, alt: "40HC Multi-sidedoor High Cube Container - Side View" },
    { src: hc40MultiSidedoor3, alt: "40HC Multi-sidedoor High Cube Container - Multi-door View" },
    { src: hc40MultiSidedoor4, alt: "40HC Multi-sidedoor High Cube Container - Open Doors View" },
    { src: hc40MultiSidedoor5, alt: "40HC Multi-sidedoor High Cube Container - Complete View" }
  ];

  // 40HC Open Top Cargo Worthy container images array
  const hc40OTCWImages = [
    { src: hc40OTCW1, alt: "40HC Open Top Cargo Worthy Container - Main View" },
    { src: hc40OTCW2, alt: "40HC Open Top Cargo Worthy Container - Top View" },
    { src: hc40OTCW3, alt: "40HC Open Top Cargo Worthy Container - Side View" },
    { src: hc40OTCW4, alt: "40HC Open Top Cargo Worthy Container - Open Top Detail" },
    { src: hc40OTCW5, alt: "40HC Open Top Cargo Worthy Container - Loading View" }
  ];

  // 40HC Open Top IICL container images array
  const hc40OTIICLImages = [
    { src: hc40OTIICL1, alt: "40HC Open Top IICL Container - Main View" },
    { src: hc40OTIICL2, alt: "40HC Open Top IICL Container - Side View" },
    { src: hc40OTIICL3, alt: "40HC Open Top IICL Container - Open Top Detail" }
  ];

  // 40HC Open Top WWT container images array
  const hc40OTWWTImages = [
    { src: hc40OTWWT1, alt: "40HC Open Top WWT Container - Main View" },
    { src: hc40OTWWT2, alt: "40HC Open Top WWT Container - Side View" },
    { src: hc40OTWWT3, alt: "40HC Open Top WWT Container - Rear View" },
    { src: hc40OTWWT4, alt: "40HC Open Top WWT Container - Interior View" },
    { src: hc40OTWWT5, alt: "40HC Open Top WWT Container - Detail View" }
  ];

  // 40HC Refrigerated container images array
  const hc40RFImages = [
    { src: hc40RF1, alt: "40HC Refrigerated Container - Main View" },
    { src: hc40RF2, alt: "40HC Refrigerated Container - Side View" },
    { src: hc40RF3, alt: "40HC Refrigerated Container - Detail View" }
  ];

  // 40HC Refrigerated Cargo Worthy container images array
  const hc40RFCWImages = [
    { src: hc40RFCW1, alt: "40HC Refrigerated Cargo Worthy Container - Main View" },
    { src: hc40RFCW2, alt: "40HC Refrigerated Cargo Worthy Container - Side View" },
    { src: hc40RFCW3, alt: "40HC Refrigerated Cargo Worthy Container - Front View" },
    { src: hc40RFCW4, alt: "40HC Refrigerated Cargo Worthy Container - Detail View" },
    { src: hc40RFCW5, alt: "40HC Refrigerated Cargo Worthy Container - Interior View" }
  ];

  // 40HC Refrigerated Wind and Water Tight container images array
  const hc40RFWWTImages = [
    { src: hc40RFWWT1, alt: "40HC Refrigerated Wind and Water Tight Container - Main View" },
    { src: hc40RFWWT2, alt: "40HC Refrigerated Wind and Water Tight Container - Side View" },
    { src: hc40RFWWT3, alt: "40HC Refrigerated Wind and Water Tight Container - Front View" },
    { src: hc40RFWWT4, alt: "40HC Refrigerated Wind and Water Tight Container - Detail View" },
    { src: hc40RFWWT5, alt: "40HC Refrigerated Wind and Water Tight Container - Interior View" }
  ];

  // 40HC Wind and Water Tight container images array
  const hc40WWTImages = [
    { src: hc40WWT1, alt: "40HC Wind and Water Tight Container - Main View" },
    { src: hc40WWT2, alt: "40HC Wind and Water Tight Container - Side View" },
    { src: hc40WWT3, alt: "40HC Wind and Water Tight Container - Detail View" }
  ];

  // 45HC container images array
  const hc45Images = [
    { src: hc45_1, alt: "45HC High Cube Container - Main View" },
    { src: hc45_2, alt: "45HC High Cube Container - Side View" },
    { src: hc45_3, alt: "45HC High Cube Container - Detail View" },
    { src: hc45_4, alt: "45HC High Cube Container - End View" }
  ];

  // 45HC-CW container images array
  const hc45CWImages = [
    { src: hc45CW, alt: "45HC Cargo Worthy Container - Main View" }
  ];

  // 45HC-IICL container images array
  const hc45IICLImages = [
    { src: hc45IICL1, alt: "45HC IICL Container - Main View" },
    { src: hc45IICL2, alt: "45HC IICL Container - Side View" },
    { src: hc45IICL3, alt: "45HC IICL Container - Detail View" },
    { src: hc45IICL4, alt: "45HC IICL Container - Angle View" },
    { src: hc45IICL5, alt: "45HC IICL Container - End View" }
  ];

  // 45HC-WWT container images array
  const hc45WWTImages = [
    { src: hc45WWT1, alt: "45HC Wind and Water Tight Container - Main View" },
    { src: hc45WWT2, alt: "45HC Wind and Water Tight Container - Side View" },
    { src: hc45WWT3, alt: "45HC Wind and Water Tight Container - Detail View" }
  ];

  // 53HC-BrandNew container images array
  const hc53BrandNewImages = [
    { src: hc53BrandNew1, alt: "53HC Brand New Container - Main View" },
    { src: hc53BrandNew2, alt: "53HC Brand New Container - Side View" },
    { src: hc53BrandNew3, alt: "53HC Brand New Container - Detail View" },
    { src: hc53BrandNew4, alt: "53HC Brand New Container - Angle View" }
  ];

  // 53HC-OT-BrandNew container images array
  const hc53OTBrandNewImages = [
    { src: hc53OTBrandNew1, alt: "53HC Open Top Brand New Container - Main View" },
    { src: hc53OTBrandNew2, alt: "53HC Open Top Brand New Container - Side View" }
  ];

  // 40GP AS IS container images array
  const gp40AsIsImages = [
    { src: gp40AsIs1, alt: "40GP AS IS Container - Main View" },
    { src: gp40AsIs2, alt: "40GP AS IS Container - Side View" },
    { src: gp40AsIs3, alt: "40GP AS IS Container - Detail View" }
  ];

  // 40HC AS IS container images array
  const hc40AsIsImages = [
    { src: hc40AsIs1, alt: "40HC AS IS High Cube Container - Main View" },
    { src: hc40AsIs2, alt: "40HC AS IS High Cube Container - Side View" },
    { src: hc40AsIs3, alt: "40HC AS IS High Cube Container - Detail View" }
  ];

  // 40HC CW container images array
  const hc40CWImages = [
    { src: hc40CW1, alt: "40HC Cargo Worthy High Cube Container - Main View" },
    { src: hc40CW2, alt: "40HC Cargo Worthy High Cube Container - Side View" }
  ];

  // 40HC IICL container images array
  const hc40IICLImages = [
    { src: hc40IICL1, alt: "40HC IICL High Cube Container - Main View" },
    { src: hc40IICL2, alt: "40HC IICL High Cube Container - Side View" }
  ];





  // Check for 40GP Brand New containers (highest priority for 40-foot Brand New)
  const gp40BrandNewTypeCheck = (containerType?.toLowerCase().includes('40gp') ||
                                containerType?.toLowerCase().includes('40 gp') ||
                                containerType?.toLowerCase().includes('40dc') ||
                                containerType?.toLowerCase().includes('40-foot') ||
                                containerType?.toLowerCase().includes('40 foot')) &&
                               (containerType?.toLowerCase().includes('brand new'));
  const gp40BrandNewSkuCheck = (containerSku?.toLowerCase().includes('40gp') ||
                               containerSku?.toLowerCase().includes('40-gp') ||
                               containerSku?.toLowerCase().includes('40 gp') ||
                               containerSku?.toLowerCase().includes('40dc')) &&
                              (containerSku?.toLowerCase().includes('brand new') ||
                               containerSku?.toLowerCase().includes('brandnew'));
  const is40GPBrandNewContainer = gp40BrandNewTypeCheck || gp40BrandNewSkuCheck;

  // Check for 40GP CW containers (second priority for 40-foot Cargo Worthy)
  const gp40CWTypeCheck = (containerType?.toLowerCase().includes('40gp') ||
                          containerType?.toLowerCase().includes('40 gp') ||
                          containerType?.toLowerCase().includes('40dc') ||
                          containerType?.toLowerCase().includes('40-foot') ||
                          containerType?.toLowerCase().includes('40 foot')) &&
                         (containerType?.toLowerCase().includes('cargo worthy') ||
                          containerType?.toLowerCase().includes('cargoworthy') ||
                          containerType?.toLowerCase().includes('cw'));
  const gp40CWSkuCheck = (containerSku?.toLowerCase().includes('40gp') ||
                         containerSku?.toLowerCase().includes('40-gp') ||
                         containerSku?.toLowerCase().includes('40 gp') ||
                         containerSku?.toLowerCase().includes('40dc')) &&
                        (containerSku?.toLowerCase().includes('cargo worthy') ||
                         containerSku?.toLowerCase().includes('cargoworthy') ||
                         containerSku?.toLowerCase().includes('cw'));
  const is40GPCWContainer = gp40CWTypeCheck || gp40CWSkuCheck;

  // Check for 40GP DoubleDoor containers (third priority for 40-foot DoubleDoor)
  const gp40DoubleDoorTypeCheck = (containerType?.toLowerCase().includes('40gp') ||
                                  containerType?.toLowerCase().includes('40 gp') ||
                                  containerType?.toLowerCase().includes('40dc') ||
                                  containerType?.toLowerCase().includes('40hc') ||
                                  containerType?.toLowerCase().includes('40-foot') ||
                                  containerType?.toLowerCase().includes('40 foot')) &&
                                 (containerType?.toLowerCase().includes('double door') ||
                                  containerType?.toLowerCase().includes('doubledoor') ||
                                  containerType?.toLowerCase().includes('double-door'));
  const gp40DoubleDoorSkuCheck = (containerSku?.toLowerCase().includes('40gp') ||
                                 containerSku?.toLowerCase().includes('40-gp') ||
                                 containerSku?.toLowerCase().includes('40 gp') ||
                                 containerSku?.toLowerCase().includes('40dc') ||
                                 containerSku?.toLowerCase().includes('40hc')) &&
                                (containerSku?.toLowerCase().includes('double door') ||
                                 containerSku?.toLowerCase().includes('doubledoor') ||
                                 containerSku?.toLowerCase().includes('double-door'));
  const is40GPDoubleDoorContainer = gp40DoubleDoorTypeCheck || gp40DoubleDoorSkuCheck;

  // Check for 40GP AS IS containers
  const gp40AsIsTypeCheck = (containerType?.toLowerCase().includes('40gp') ||
                            containerType?.toLowerCase().includes('40 gp') ||
                            containerType?.toLowerCase().includes('40dc') ||
                            containerType?.toLowerCase().includes('40-foot') ||
                            containerType?.toLowerCase().includes('40 foot') ||
                            containerType?.toLowerCase().includes('40\'')) &&
                           !containerType?.toLowerCase().includes('40hc') &&
                           !containerType?.toLowerCase().includes('high cube') &&
                           (containerType?.toLowerCase().includes('as is') ||
                            containerType?.toLowerCase().includes('asis') ||
                            containerCondition?.toLowerCase().includes('as is') ||
                            containerCondition?.toLowerCase().includes('asis'));
  const gp40AsIsSkuCheck = (containerSku?.toLowerCase().includes('40gp') ||
                           containerSku?.toLowerCase().includes('40-gp') ||
                           containerSku?.toLowerCase().includes('40 gp') ||
                           containerSku?.toLowerCase().includes('40dc')) &&
                          !containerSku?.toLowerCase().includes('40hc') &&
                          !containerSku?.toLowerCase().includes('40-hc') &&
                          !containerSku?.toLowerCase().includes('40 hc') &&
                          (containerSku?.toLowerCase().includes('as is') ||
                           containerSku?.toLowerCase().includes('asis') ||
                           containerCondition?.toLowerCase().includes('as is') ||
                           containerCondition?.toLowerCase().includes('asis'));
  const is40GPAsIsContainer = gp40AsIsTypeCheck || gp40AsIsSkuCheck;


  // Check for 40HC AS IS containers
  const hc40AsIsTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                            containerType?.toLowerCase().includes('40 hc') ||
                            containerType?.toLowerCase().includes('high cube')) &&
                           (containerType?.toLowerCase().includes('as is') ||
                            containerType?.toLowerCase().includes('asis') ||
                            containerCondition?.toLowerCase().includes('as is') ||
                            containerCondition?.toLowerCase().includes('asis'));
  const hc40AsIsSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                           containerSku?.toLowerCase().includes('40-hc') ||
                           containerSku?.toLowerCase().includes('40 hc')) &&
                          (containerSku?.toLowerCase().includes('as is') ||
                           containerSku?.toLowerCase().includes('asis') ||
                           containerCondition?.toLowerCase().includes('as is') ||
                           containerCondition?.toLowerCase().includes('asis'));
  const is40HCAsIsContainer = hc40AsIsTypeCheck || hc40AsIsSkuCheck;

  // Check for 40HC IICL containers
  const hc40IICLTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                            containerType?.toLowerCase().includes('40 hc') ||
                            containerType?.toLowerCase().includes('high cube')) &&
                           (containerType?.toLowerCase().includes('iicl') ||
                            containerCondition?.toLowerCase().includes('iicl'));
  const hc40IICLSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                           containerSku?.toLowerCase().includes('40-hc') ||
                           containerSku?.toLowerCase().includes('40 hc')) &&
                          (containerSku?.toLowerCase().includes('iicl') ||
                           containerCondition?.toLowerCase().includes('iicl'));
  const is40HCIICLContainer = hc40IICLTypeCheck || hc40IICLSkuCheck;

  // Check for 53HC unavailable containers (CW, IICL, WWT)
  const is53HCUnavailableContainer = (containerType?.toLowerCase().includes('53hc') || 
                                     containerType?.toLowerCase().includes('53 hc') ||
                                     containerSku?.toLowerCase().includes('53hc') ||
                                     containerSku?.toLowerCase().includes('53 hc')) &&
                                    (containerCondition?.toLowerCase().includes('cargo worthy') ||
                                     containerCondition?.toLowerCase().includes('cargoworthy') ||
                                     containerCondition?.toLowerCase().includes('cw') ||
                                     containerCondition?.toLowerCase().includes('iicl') ||
                                     containerCondition?.toLowerCase().includes('wind water tight') ||
                                     containerCondition?.toLowerCase().includes('wind & water tight') ||
                                     containerCondition?.toLowerCase().includes('wwt'));




  // Check for 40GP Open Top Brand New containers (fourth priority for 40-foot Open Top Brand New)
  const gp40OTBrandNewTypeCheck = (containerType?.toLowerCase().includes('40gp') ||
                                  containerType?.toLowerCase().includes('40 gp') ||
                                  containerType?.toLowerCase().includes('40dc') ||
                                  containerType?.toLowerCase().includes('40hc') ||
                                  containerType?.toLowerCase().includes('40-foot') ||
                                  containerType?.toLowerCase().includes('40 foot')) &&
                                 (containerType?.toLowerCase().includes('open top') ||
                                  containerType?.toLowerCase().includes('opentop') ||
                                  containerType?.toLowerCase().includes('open-top'));
  const gp40OTBrandNewSkuCheck = (containerSku?.toLowerCase().includes('40gp') ||
                                 containerSku?.toLowerCase().includes('40-gp') ||
                                 containerSku?.toLowerCase().includes('40 gp') ||
                                 containerSku?.toLowerCase().includes('40dc') ||
                                 containerSku?.toLowerCase().includes('40hc')) &&
                                (containerSku?.toLowerCase().includes('brand new') ||
                                 containerSku?.toLowerCase().includes('brandnew'));
  // Combined check: Type must be Open Top + 40-foot, and SKU must contain Brand New
  const gp40OTBrandNewCombinedCheck = gp40OTBrandNewTypeCheck && 
                                     (containerSku?.toLowerCase().includes('brand new') ||
                                      containerSku?.toLowerCase().includes('brandnew'));
  const is40GPOTBrandNewContainer = gp40OTBrandNewCombinedCheck;

  // Check for 40GP WWT containers (Wind and Water Tight) - exclude 40HC containers
  const gp40WWTTypeCheck = (containerType?.toLowerCase().includes('40gp') ||
                           containerType?.toLowerCase().includes('40 gp') ||
                           containerType?.toLowerCase().includes('40dc') ||
                           containerType?.toLowerCase().includes('40-foot') ||
                           containerType?.toLowerCase().includes('40 foot')) &&
                          !containerType?.toLowerCase().includes('40hc') &&
                          !containerType?.toLowerCase().includes('40 hc') &&
                          !containerType?.toLowerCase().includes('high cube');
  const gp40WWTSkuCheck = (containerSku?.toLowerCase().includes('40gp') ||
                          containerSku?.toLowerCase().includes('40-gp') ||
                          containerSku?.toLowerCase().includes('40 gp') ||
                          containerSku?.toLowerCase().includes('40dc')) &&
                         !containerSku?.toLowerCase().includes('40hc') &&
                         !containerSku?.toLowerCase().includes('40-hc') &&
                         !containerSku?.toLowerCase().includes('40 hc');
  const gp40WWTConditionCheck = (containerType?.toLowerCase().includes('wind and water tight') ||
                                containerType?.toLowerCase().includes('wwt') ||
                                containerSku?.toLowerCase().includes('wind and water tight') ||
                                containerSku?.toLowerCase().includes('windandwatertight') ||
                                containerSku?.toLowerCase().includes('wwt'));
  const is40GPWWTContainer = (gp40WWTTypeCheck || gp40WWTSkuCheck) && gp40WWTConditionCheck;

  // Check for 40HC Multi-sidedoor containers (highest priority for 40HC multi-door variants)
  const hc40MultiSidedoorTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                                     containerType?.toLowerCase().includes('40 hc') ||
                                     containerType?.toLowerCase().includes('40-foot') ||
                                     containerType?.toLowerCase().includes('40 foot') ||
                                     containerType?.toLowerCase().includes('high cube')) &&
                                    (containerType?.toLowerCase().includes('multi-side door') ||
                                     containerType?.toLowerCase().includes('multi side door') ||
                                     containerType?.toLowerCase().includes('multi-sidedoor') ||
                                     containerType?.toLowerCase().includes('multisidedoor'));
  const hc40MultiSidedoorSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                                    containerSku?.toLowerCase().includes('40-hc') ||
                                    containerSku?.toLowerCase().includes('40 hc')) &&
                                   (containerSku?.toLowerCase().includes('multi-sidedoor') ||
                                    containerSku?.toLowerCase().includes('multi side door') ||
                                    containerSku?.toLowerCase().includes('multi-side door') ||
                                    containerSku?.toLowerCase().includes('multisidedoor'));
  


  const is40HCMultiSidedoorContainer = hc40MultiSidedoorTypeCheck || hc40MultiSidedoorSkuCheck || 
                                      (searchedContainerType === 'Multi-Side Door' && 
                                       containerType?.toLowerCase().includes('40hc') && 
                                       containerType?.toLowerCase().includes('side door'));

  // Check for 40HC Open Top Cargo Worthy containers
  const hc40OTCWTypeCheck = (containerType?.toLowerCase().includes('open top') ||
                            containerType?.toLowerCase().includes('ot')) &&
                           (containerType?.toLowerCase().includes('40hc') ||
                            containerType?.toLowerCase().includes('40 hc') ||
                            containerType?.toLowerCase().includes('high cube'));
  const hc40OTCWSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                           containerSku?.toLowerCase().includes('40-hc') ||
                           containerSku?.toLowerCase().includes('40 hc')) &&
                          (containerSku?.toLowerCase().includes('ot') ||
                           containerSku?.toLowerCase().includes('open-top') ||
                           containerSku?.toLowerCase().includes('open top')) &&
                          (containerSku?.toLowerCase().includes('cw') ||
                           containerSku?.toLowerCase().includes('cargo-worthy') ||
                           containerSku?.toLowerCase().includes('cargoworthy'));


  const is40HCOTCWContainer = (hc40OTCWTypeCheck || hc40OTCWSkuCheck || 
                              (searchedContainerType === 'Open Top Container' && 
                               containerType?.toLowerCase().includes('40hc') && 
                               containerType?.toLowerCase().includes('open top'))) &&
                             // Exclude IICL and WWT containers from CW detection
                             !containerType?.toLowerCase().includes('iicl') &&
                             !containerCondition?.toLowerCase().includes('iicl') &&
                             !containerCondition?.toLowerCase().includes('wind and water tight') &&
                             !containerCondition?.toLowerCase().includes('wwt');

  // Check for 40HC Open Top IICL containers
  const hc40OTIICLTypeCheck = (containerType?.toLowerCase().includes('open top') ||
                              containerType?.toLowerCase().includes('ot')) &&
                             (containerType?.toLowerCase().includes('40hc') ||
                              containerType?.toLowerCase().includes('40 hc') ||
                              containerType?.toLowerCase().includes('high cube')) &&
                             (containerType?.toLowerCase().includes('iicl') ||
                              containerCondition?.toLowerCase().includes('iicl'));
  const hc40OTIICLSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                             containerSku?.toLowerCase().includes('40-hc') ||
                             containerSku?.toLowerCase().includes('40 hc')) &&
                            (containerSku?.toLowerCase().includes('ot') ||
                             containerSku?.toLowerCase().includes('open-top') ||
                             containerSku?.toLowerCase().includes('open top')) &&
                            (containerSku?.toLowerCase().includes('iicl') ||
                             containerCondition?.toLowerCase().includes('iicl'));
  
  // Also check for search combination: Open Top Container + 40HC size + IICL condition
  const searchedForOpenTopIICL = searchedContainerType === 'Open Top Container' && 
                                 containerType?.toLowerCase().includes('40hc') && 
                                 containerType?.toLowerCase().includes('open top') &&
                                 containerCondition?.toLowerCase().includes('iicl');
  
  const is40HCOTIICLContainer = hc40OTIICLTypeCheck || hc40OTIICLSkuCheck || searchedForOpenTopIICL;

  // Check for 40HC Open Top WWT containers (exclude refrigerated and standard containers)
  const hc40OTWWTTypeCheck = (containerType?.toLowerCase().includes('open top') ||
                             containerType?.toLowerCase().includes('ot')) &&
                            (containerType?.toLowerCase().includes('40hc') ||
                             containerType?.toLowerCase().includes('40 hc') ||
                             containerType?.toLowerCase().includes('high cube')) &&
                            (containerType?.toLowerCase().includes('wwt') ||
                             containerType?.toLowerCase().includes('wind and water tight') ||
                             containerCondition?.toLowerCase().includes('wwt')) &&
                            !containerType?.toLowerCase().includes('refrigerated') &&
                            !containerType?.toLowerCase().includes('reefer') &&
                            !containerType?.toLowerCase().includes('rf') &&
                            !containerType?.toLowerCase().includes('standard');
  const hc40OTWWTSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                            containerSku?.toLowerCase().includes('40-hc') ||
                            containerSku?.toLowerCase().includes('40 hc')) &&
                           (containerSku?.toLowerCase().includes('wwt') ||
                            containerSku?.toLowerCase().includes('windandwatertight') ||
                            containerSku?.toLowerCase().includes('wind and water tight') ||
                            containerCondition?.toLowerCase().includes('wwt')) &&
                           !containerSku?.toLowerCase().includes('rf') &&
                           !containerSku?.toLowerCase().includes('refrigerated') &&
                           !containerSku?.toLowerCase().includes('reefer') &&
                           !containerType?.toLowerCase().includes('standard');
  
  // Also check for search combination: Open Top Container + 40HC size + WWT condition (exclude refrigerated and standard)
  const searchedForOpenTopWWT = searchedContainerType === 'Open Top Container' && 
                                containerType?.toLowerCase().includes('40hc') && 
                                containerType?.toLowerCase().includes('open top') &&
                                containerCondition?.toLowerCase().includes('wwt') &&
                                !containerType?.toLowerCase().includes('refrigerated') &&
                                !containerType?.toLowerCase().includes('reefer') &&
                                !containerType?.toLowerCase().includes('rf') &&
                                !containerType?.toLowerCase().includes('standard');
  
  const is40HCOTWWTContainer = hc40OTWWTTypeCheck || hc40OTWWTSkuCheck || searchedForOpenTopWWT;

  // Check for 40HC Refrigerated containers
  const hc40RFTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                          containerType?.toLowerCase().includes('40 hc') ||
                          containerType?.toLowerCase().includes('high cube')) &&
                         (containerType?.toLowerCase().includes('refrigerated') ||
                          containerType?.toLowerCase().includes('reefer') ||
                          containerType?.toLowerCase().includes('rf'));
  const hc40RFSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                         containerSku?.toLowerCase().includes('40-hc') ||
                         containerSku?.toLowerCase().includes('40 hc')) &&
                        (containerSku?.toLowerCase().includes('rf') ||
                         containerSku?.toLowerCase().includes('refrigerated') ||
                         containerSku?.toLowerCase().includes('reefer'));
  const searchedForRefrigerated = searchedContainerType === 'Refrigerated Container' && 
                                 containerType?.toLowerCase().includes('40hc');
  
  const is40HCRFContainer = hc40RFTypeCheck || hc40RFSkuCheck || searchedForRefrigerated;

  // Check for 40HC Refrigerated Cargo Worthy containers (higher priority than regular RF)
  const hc40RFCWTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                            containerType?.toLowerCase().includes('40 hc') ||
                            containerType?.toLowerCase().includes('high cube')) &&
                           (containerType?.toLowerCase().includes('refrigerated') ||
                            containerType?.toLowerCase().includes('reefer') ||
                            containerType?.toLowerCase().includes('rf')) &&
                           (containerType?.toLowerCase().includes('cargo worthy') ||
                            containerType?.toLowerCase().includes('cw'));
  const hc40RFCWSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                           containerSku?.toLowerCase().includes('40-hc') ||
                           containerSku?.toLowerCase().includes('40 hc')) &&
                          (containerSku?.toLowerCase().includes('rf') ||
                           containerSku?.toLowerCase().includes('refrigerated') ||
                           containerSku?.toLowerCase().includes('reefer')) &&
                          (containerSku?.toLowerCase().includes('cw') ||
                           containerSku?.toLowerCase().includes('cargo worthy') ||
                           containerSku?.toLowerCase().includes('cargoworthy'));
  const hc40RFCWConditionCheck = containerCondition?.toLowerCase().includes('cargo worthy') ||
                                containerCondition?.toLowerCase().includes('cw');
  const searchedForRefrigeratedCW = searchedContainerType === 'Refrigerated Container' && 
                                   containerType?.toLowerCase().includes('40hc') &&
                                   (containerCondition?.toLowerCase().includes('cargo worthy') ||
                                    containerCondition?.toLowerCase().includes('cw'));
  
  const is40HCRFCWContainer = hc40RFCWTypeCheck || hc40RFCWSkuCheck || hc40RFCWConditionCheck || searchedForRefrigeratedCW;

  // Check for 40HC Refrigerated Wind and Water Tight containers (highest priority for refrigerated containers)
  const hc40RFWWTTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                             containerType?.toLowerCase().includes('40 hc') ||
                             containerType?.toLowerCase().includes('high cube')) &&
                            (containerType?.toLowerCase().includes('refrigerated') ||
                             containerType?.toLowerCase().includes('reefer') ||
                             containerType?.toLowerCase().includes('rf')) &&
                            (containerType?.toLowerCase().includes('wind and water tight') ||
                             containerType?.toLowerCase().includes('wwt'));
  const hc40RFWWTSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                            containerSku?.toLowerCase().includes('40-hc') ||
                            containerSku?.toLowerCase().includes('40 hc')) &&
                           (containerSku?.toLowerCase().includes('rf') ||
                            containerSku?.toLowerCase().includes('refrigerated') ||
                            containerSku?.toLowerCase().includes('reefer')) &&
                           (containerSku?.toLowerCase().includes('wwt') ||
                            containerSku?.toLowerCase().includes('wind and water tight') ||
                            containerSku?.toLowerCase().includes('windandwatertight'));
  const hc40RFWWTConditionCheck = (containerCondition?.toLowerCase().includes('wind and water tight') ||
                                  containerCondition?.toLowerCase().includes('wwt')) &&
                                 (containerType?.toLowerCase().includes('40hc') ||
                                  containerType?.toLowerCase().includes('high cube')) &&
                                 (containerType?.toLowerCase().includes('refrigerated') ||
                                  containerType?.toLowerCase().includes('reefer') ||
                                  containerType?.toLowerCase().includes('rf'));
  const searchedForRefrigeratedWWT = searchedContainerType === 'Refrigerated Container' && 
                                    containerType?.toLowerCase().includes('40hc') &&
                                    (containerCondition?.toLowerCase().includes('wind and water tight') ||
                                     containerCondition?.toLowerCase().includes('wwt'));
  
  const is40HCRFWWTContainer = hc40RFWWTTypeCheck || hc40RFWWTSkuCheck || hc40RFWWTConditionCheck || searchedForRefrigeratedWWT;

  // Check for 40HC Wind and Water Tight containers (non-refrigerated)
  const hc40WWTTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                           containerType?.toLowerCase().includes('40 hc') ||
                           containerType?.toLowerCase().includes('high cube')) &&
                          (containerType?.toLowerCase().includes('wind and water tight') ||
                           containerType?.toLowerCase().includes('wwt')) &&
                          !containerType?.toLowerCase().includes('refrigerated') &&
                          !containerType?.toLowerCase().includes('reefer') &&
                          !containerType?.toLowerCase().includes('rf') &&
                          !containerType?.toLowerCase().includes('open top') &&
                          !containerType?.toLowerCase().includes('ot');
  const hc40WWTSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                          containerSku?.toLowerCase().includes('40-hc') ||
                          containerSku?.toLowerCase().includes('40 hc')) &&
                         (containerSku?.toLowerCase().includes('wwt') ||
                          containerSku?.toLowerCase().includes('wind and water tight') ||
                          containerSku?.toLowerCase().includes('windandwatertight')) &&
                         !containerSku?.toLowerCase().includes('rf') &&
                         !containerSku?.toLowerCase().includes('refrigerated') &&
                         !containerSku?.toLowerCase().includes('reefer') &&
                         !containerSku?.toLowerCase().includes('ot') &&
                         !containerSku?.toLowerCase().includes('open-top');
  const hc40WWTConditionCheck = (containerCondition?.toLowerCase().includes('wind and water tight') ||
                                containerCondition?.toLowerCase().includes('wwt')) &&
                               (containerType?.toLowerCase().includes('40hc') ||
                                containerType?.toLowerCase().includes('high cube')) &&
                               !containerType?.toLowerCase().includes('refrigerated') &&
                               !containerType?.toLowerCase().includes('reefer') &&
                               !containerType?.toLowerCase().includes('rf') &&
                               !containerType?.toLowerCase().includes('open top') &&
                               !containerType?.toLowerCase().includes('ot');
  
  const is40HCWWTContainer = hc40WWTTypeCheck || hc40WWTSkuCheck || hc40WWTConditionCheck;

  // Check for 45HC containers
  const hc45TypeCheck = (containerType?.toLowerCase().includes('45hc') ||
                        containerType?.toLowerCase().includes('45 hc') ||
                        containerType?.toLowerCase().includes('45-foot') ||
                        containerType?.toLowerCase().includes('45 foot') ||
                        containerType?.toLowerCase().includes('45\'') ||
                        containerType?.toLowerCase().includes('45 ft')) &&
                       (containerType?.toLowerCase().includes('high cube') ||
                        containerType?.toLowerCase().includes('hc'));
  const hc45SkuCheck = (containerSku?.toLowerCase().includes('45hc') ||
                       containerSku?.toLowerCase().includes('45-hc') ||
                       containerSku?.toLowerCase().includes('45 hc'));
  const hc45SizeCheck = searchedContainerType === '45\' High Cube' ||
                       searchedContainerType === '45 High Cube' ||
                       searchedContainerType === '45HC';
  
  const is45HCContainer = hc45TypeCheck || hc45SkuCheck || hc45SizeCheck;

  // Check for 45HC-CW containers (highest priority for 45HC variants)
  const hc45CWTypeCheck = (containerType?.toLowerCase().includes('45hc') ||
                          containerType?.toLowerCase().includes('45 hc') ||
                          containerType?.toLowerCase().includes('45-foot') ||
                          containerType?.toLowerCase().includes('45 foot') ||
                          containerType?.toLowerCase().includes('45\'') ||
                          containerType?.toLowerCase().includes('45 ft')) &&
                         (containerType?.toLowerCase().includes('high cube') ||
                          containerType?.toLowerCase().includes('hc')) &&
                         (containerType?.toLowerCase().includes('cargo worthy') ||
                          containerType?.toLowerCase().includes('cw'));
  const hc45CWSkuCheck = (containerSku?.toLowerCase().includes('45hc') ||
                         containerSku?.toLowerCase().includes('45-hc') ||
                         containerSku?.toLowerCase().includes('45 hc')) &&
                        (containerSku?.toLowerCase().includes('cw') ||
                         containerSku?.toLowerCase().includes('cargo worthy'));
  const hc45CWConditionCheck = containerCondition?.toLowerCase().includes('cargo worthy');
  
  const is45HCCWContainer = (hc45CWTypeCheck || hc45CWSkuCheck || hc45CWConditionCheck) && is45HCContainer;

  // Check for 45HC-IICL containers (high priority for 45HC IICL condition)
  const hc45IICLTypeCheck = (containerType?.toLowerCase().includes('45hc') ||
                            containerType?.toLowerCase().includes('45 hc') ||
                            containerType?.toLowerCase().includes('45-foot') ||
                            containerType?.toLowerCase().includes('45 foot') ||
                            containerType?.toLowerCase().includes('45\'') ||
                            containerType?.toLowerCase().includes('45 ft')) &&
                           (containerType?.toLowerCase().includes('high cube') ||
                            containerType?.toLowerCase().includes('hc')) &&
                           (containerType?.toLowerCase().includes('iicl') ||
                            containerType?.toLowerCase().includes('institute'));
  const hc45IICLSkuCheck = (containerSku?.toLowerCase().includes('45hc') ||
                           containerSku?.toLowerCase().includes('45-hc') ||
                           containerSku?.toLowerCase().includes('45 hc')) &&
                          (containerSku?.toLowerCase().includes('iicl') ||
                           containerSku?.toLowerCase().includes('institute'));
  const hc45IICLConditionCheck = containerCondition?.toLowerCase().includes('iicl') &&
                                (containerType?.toLowerCase().includes('45hc') ||
                                 containerType?.toLowerCase().includes('45 hc') ||
                                 containerType?.toLowerCase().includes('45\'') ||
                                 containerType?.toLowerCase().includes('45 ft') ||
                                 containerType?.toLowerCase().includes('high cube') ||
                                 searchedContainerType === '45\' High Cube' ||
                                 searchedContainerType === '45 High Cube' ||
                                 searchedContainerType === '45HC');
  
  const is45HCIICLContainer = (hc45IICLTypeCheck || hc45IICLSkuCheck || hc45IICLConditionCheck) && is45HCContainer;

  // Check for 45HC-WWT containers (high priority for 45HC Wind and Water Tight condition)
  const hc45WWTTypeCheck = (containerType?.toLowerCase().includes('45hc') ||
                            containerType?.toLowerCase().includes('45 hc') ||
                            containerType?.toLowerCase().includes('45-foot') ||
                            containerType?.toLowerCase().includes('45 foot') ||
                            containerType?.toLowerCase().includes('45\'') ||
                            containerType?.toLowerCase().includes('45 ft')) &&
                           (containerType?.toLowerCase().includes('high cube') ||
                            containerType?.toLowerCase().includes('hc')) &&
                           (containerType?.toLowerCase().includes('wind and water tight') ||
                            containerType?.toLowerCase().includes('wwt') ||
                            containerType?.toLowerCase().includes('watertight'));
  const hc45WWTSkuCheck = (containerSku?.toLowerCase().includes('45hc') ||
                           containerSku?.toLowerCase().includes('45-hc') ||
                           containerSku?.toLowerCase().includes('45 hc')) &&
                          (containerSku?.toLowerCase().includes('wwt') ||
                           containerSku?.toLowerCase().includes('wind and water tight') ||
                           containerSku?.toLowerCase().includes('watertight'));
  const hc45WWTConditionCheck = (containerCondition?.toLowerCase().includes('wind and water tight') ||
                                containerCondition?.toLowerCase().includes('wwt') ||
                                containerCondition?.toLowerCase().includes('watertight')) &&
                               (containerType?.toLowerCase().includes('45hc') ||
                                containerType?.toLowerCase().includes('45 hc') ||
                                containerType?.toLowerCase().includes('45\'') ||
                                containerType?.toLowerCase().includes('45 ft') ||
                                containerType?.toLowerCase().includes('high cube') ||
                                searchedContainerType === '45\' High Cube' ||
                                searchedContainerType === '45 High Cube' ||
                                searchedContainerType === '45HC');
  
  const is45HCWWTContainer = (hc45WWTTypeCheck || hc45WWTSkuCheck || hc45WWTConditionCheck) && is45HCContainer;

  // Check for 53HC containers first
  const hc53TypeCheck = (containerType?.toLowerCase().includes('53hc') ||
                        containerType?.toLowerCase().includes('53 hc') ||
                        containerType?.toLowerCase().includes('53-foot') ||
                        containerType?.toLowerCase().includes('53 foot') ||
                        containerType?.toLowerCase().includes('53\'') ||
                        containerType?.toLowerCase().includes('53 ft')) &&
                       (containerType?.toLowerCase().includes('high cube') ||
                        containerType?.toLowerCase().includes('hc'));
  const hc53SkuCheck = (containerSku?.toLowerCase().includes('53hc') ||
                       containerSku?.toLowerCase().includes('53-hc') ||
                       containerSku?.toLowerCase().includes('53 hc'));
  const hc53SizeCheck = searchedContainerType === '53\' High Cube' ||
                       searchedContainerType === '53 High Cube' ||
                       searchedContainerType === '53HC';
  
  const is53HCContainer = hc53TypeCheck || hc53SkuCheck || hc53SizeCheck;

  // Check for 53HC-BrandNew containers (high priority for 53HC Brand New condition)
  const hc53BrandNewTypeCheck = (containerType?.toLowerCase().includes('53hc') ||
                                containerType?.toLowerCase().includes('53 hc') ||
                                containerType?.toLowerCase().includes('53-foot') ||
                                containerType?.toLowerCase().includes('53 foot') ||
                                containerType?.toLowerCase().includes('53\'') ||
                                containerType?.toLowerCase().includes('53 ft')) &&
                               (containerType?.toLowerCase().includes('high cube') ||
                                containerType?.toLowerCase().includes('hc')) &&
                               (containerType?.toLowerCase().includes('brand new') ||
                                containerType?.toLowerCase().includes('brandnew') ||
                                containerType?.toLowerCase().includes('new'));
  const hc53BrandNewSkuCheck = (containerSku?.toLowerCase().includes('53hc') ||
                               containerSku?.toLowerCase().includes('53-hc') ||
                               containerSku?.toLowerCase().includes('53 hc')) &&
                              (containerSku?.toLowerCase().includes('brand new') ||
                               containerSku?.toLowerCase().includes('brandnew') ||
                               containerSku?.toLowerCase().includes('new'));
  const hc53BrandNewConditionCheck = (containerCondition?.toLowerCase().includes('brand new') ||
                                     containerCondition?.toLowerCase().includes('brandnew') ||
                                     containerCondition?.toLowerCase().includes('new')) &&
                                    (containerType?.toLowerCase().includes('53hc') ||
                                     containerType?.toLowerCase().includes('53 hc') ||
                                     containerType?.toLowerCase().includes('53\'') ||
                                     containerType?.toLowerCase().includes('53 ft') ||
                                     containerType?.toLowerCase().includes('high cube') ||
                                     searchedContainerType === '53\' High Cube' ||
                                     searchedContainerType === '53 High Cube' ||
                                     searchedContainerType === '53HC');
  
  const is53HCBrandNewContainer = (hc53BrandNewTypeCheck || hc53BrandNewSkuCheck || hc53BrandNewConditionCheck) && is53HCContainer;

  // Check for 53HC-OT-BrandNew containers (high priority for 53HC Open Top Brand New combination)
  const hc53OTBrandNewTypeCheck = (containerType?.toLowerCase().includes('53hc') ||
                                  containerType?.toLowerCase().includes('53 hc') ||
                                  containerType?.toLowerCase().includes('53-foot') ||
                                  containerType?.toLowerCase().includes('53 foot') ||
                                  containerType?.toLowerCase().includes('53\'') ||
                                  containerType?.toLowerCase().includes('53 ft')) &&
                                 (containerType?.toLowerCase().includes('high cube') ||
                                  containerType?.toLowerCase().includes('hc')) &&
                                 (containerType?.toLowerCase().includes('open top') ||
                                  containerType?.toLowerCase().includes('opentop') ||
                                  containerType?.toLowerCase().includes('open-top') ||
                                  containerType?.toLowerCase().includes('ot')) &&
                                 (containerType?.toLowerCase().includes('brand new') ||
                                  containerType?.toLowerCase().includes('brandnew') ||
                                  containerType?.toLowerCase().includes('new'));
  const hc53OTBrandNewSkuCheck = (containerSku?.toLowerCase().includes('53hc') ||
                                 containerSku?.toLowerCase().includes('53-hc') ||
                                 containerSku?.toLowerCase().includes('53 hc')) &&
                                (containerSku?.toLowerCase().includes('open top') ||
                                 containerSku?.toLowerCase().includes('opentop') ||
                                 containerSku?.toLowerCase().includes('open-top') ||
                                 containerSku?.toLowerCase().includes('ot')) &&
                                (containerSku?.toLowerCase().includes('brand new') ||
                                 containerSku?.toLowerCase().includes('brandnew') ||
                                 containerSku?.toLowerCase().includes('new'));
  const hc53OTBrandNewConditionCheck = (containerCondition?.toLowerCase().includes('brand new') ||
                                       containerCondition?.toLowerCase().includes('brandnew') ||
                                       containerCondition?.toLowerCase().includes('new')) &&
                                      (containerType?.toLowerCase().includes('53hc') ||
                                       containerType?.toLowerCase().includes('53 hc') ||
                                       containerType?.toLowerCase().includes('53\'') ||
                                       containerType?.toLowerCase().includes('53 ft') ||
                                       containerType?.toLowerCase().includes('high cube') ||
                                       searchedContainerType === '53\' High Cube' ||
                                       searchedContainerType === '53 High Cube' ||
                                       searchedContainerType === '53HC') &&
                                      (containerType?.toLowerCase().includes('open top') ||
                                       containerType?.toLowerCase().includes('opentop') ||
                                       containerType?.toLowerCase().includes('open-top') ||
                                       containerType?.toLowerCase().includes('ot') ||
                                       containerCondition?.toLowerCase().includes('open top') ||
                                       containerCondition?.toLowerCase().includes('opentop') ||
                                       containerCondition?.toLowerCase().includes('open-top') ||
                                       containerCondition?.toLowerCase().includes('ot'));
  
  const is53HCOTBrandNewContainer = (hc53OTBrandNewTypeCheck || hc53OTBrandNewSkuCheck || hc53OTBrandNewConditionCheck) && is53HCContainer;

  // Check for 40HC Cargo Worthy containers (high priority for 40HC CW to prevent RF image conflicts)
  const hc40CWTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                          containerType?.toLowerCase().includes('40 hc') ||
                          containerType?.toLowerCase().includes('40-foot') ||
                          containerType?.toLowerCase().includes('40 foot') ||
                          containerType?.toLowerCase().includes('high cube')) &&
                         (containerType?.toLowerCase().includes('cargo worthy') ||
                          containerType?.toLowerCase().includes('cw')) &&
                         !containerType?.toLowerCase().includes('rf') &&
                         !containerType?.toLowerCase().includes('refrigerated') &&
                         !containerType?.toLowerCase().includes('open top') &&
                         !containerType?.toLowerCase().includes('ot');
  const hc40CWSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                         containerSku?.toLowerCase().includes('40-hc') ||
                         containerSku?.toLowerCase().includes('40 hc')) &&
                        (containerSku?.toLowerCase().includes('cw') ||
                         containerSku?.toLowerCase().includes('cargo worthy')) &&
                        !containerSku?.toLowerCase().includes('rf') &&
                        !containerSku?.toLowerCase().includes('refrigerated') &&
                        !containerSku?.toLowerCase().includes('ot');
  const hc40CWConditionCheck = containerCondition?.toLowerCase().includes('cargo worthy') &&
                              (containerType?.toLowerCase().includes('40hc') ||
                               containerType?.toLowerCase().includes('40 hc') ||
                               containerType?.toLowerCase().includes('high cube') ||
                               searchedContainerType === '40\' High Cube' ||
                               searchedContainerType === '40 High Cube' ||
                               searchedContainerType === '40HC') &&
                              !containerType?.toLowerCase().includes('rf') &&
                              !containerType?.toLowerCase().includes('refrigerated') &&
                              !containerType?.toLowerCase().includes('open top') &&
                              !containerType?.toLowerCase().includes('ot');
  
  const is40HCCWContainer = hc40CWTypeCheck || hc40CWSkuCheck || hc40CWConditionCheck;





  // Check for 40HC Full Open Sidedoor containers (second priority for 40HC sidedoor variants)
  const hc40FullOpenSidedoorTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                                        containerType?.toLowerCase().includes('40 hc') ||
                                        containerType?.toLowerCase().includes('40-foot') ||
                                        containerType?.toLowerCase().includes('40 foot') ||
                                        containerType?.toLowerCase().includes('high cube')) &&
                                       (containerType?.toLowerCase().includes('full open side') ||
                                        containerType?.toLowerCase().includes('full open sidedoor') ||
                                        containerType?.toLowerCase().includes('full-open-sidedoor') ||
                                        containerType?.toLowerCase().includes('side door') ||
                                        containerType?.toLowerCase().includes('sidedoor')) &&
                                       !is40HCMultiSidedoorContainer;
  const hc40FullOpenSidedoorSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                                       containerSku?.toLowerCase().includes('40-hc') ||
                                       containerSku?.toLowerCase().includes('40 hc')) &&
                                      (containerSku?.toLowerCase().includes('full-open-sidedoor') ||
                                       containerSku?.toLowerCase().includes('full open sidedoor') ||
                                       containerSku?.toLowerCase().includes('full open side') ||
                                       containerSku?.toLowerCase().includes('sidedoor') ||
                                       containerSku?.toLowerCase().includes('side door')) &&
                                      !is40HCMultiSidedoorContainer;
  const is40HCFullOpenSidedoorContainer = hc40FullOpenSidedoorTypeCheck || hc40FullOpenSidedoorSkuCheck;

  // Check for 40HC Brand New containers (40-foot High Cube Brand New)
  const hc40BrandNewTypeCheck = (containerType?.toLowerCase().includes('40hc') ||
                                containerType?.toLowerCase().includes('40 hc') ||
                                containerType?.toLowerCase().includes('40-foot') ||
                                containerType?.toLowerCase().includes('40 foot') ||
                                containerType?.toLowerCase().includes('high cube')) &&
                               (containerType?.toLowerCase().includes('brand new') ||
                                containerType?.toLowerCase().includes('new')) &&
                               !is40HCFullOpenSidedoorContainer;
  const hc40BrandNewSkuCheck = (containerSku?.toLowerCase().includes('40hc') ||
                               containerSku?.toLowerCase().includes('40-hc') ||
                               containerSku?.toLowerCase().includes('40 hc')) &&
                              (containerSku?.toLowerCase().includes('brand new') ||
                               containerSku?.toLowerCase().includes('brandnew') ||
                               containerSku?.toLowerCase().includes('new')) &&
                              !is40HCFullOpenSidedoorContainer;
  const is40HCBrandNewContainer = hc40BrandNewTypeCheck || hc40BrandNewSkuCheck;



  // Check for 20HC IICL containers (highest priority for High Cube IICL)
  const hcIiclTypeCheck = (containerType?.toLowerCase().includes('high cube') ||
                           containerType?.toLowerCase().includes('20hc')) &&
                          containerType?.toLowerCase().includes('iicl');
  const hcIiclSkuCheck = (containerSku?.toLowerCase().includes('20hc') ||
                          containerSku?.toLowerCase().includes('high cube')) &&
                         containerSku?.toLowerCase().includes('iicl');
  const isHCIICLContainer = hcIiclTypeCheck || hcIiclSkuCheck;

  // Check for IICL containers (by condition, type, or SKU)
  const iiclTypeCheck = containerType?.toLowerCase().includes('iicl');
  const iiclSkuCheck = containerSku?.toLowerCase().includes('iicl') && !isHCIICLContainer;
  const isIICLContainer = iiclTypeCheck || iiclSkuCheck;

  // Check for 20HC Brand New containers (highest priority for High Cube Brand New)
  const hcBrandNewTypeCheck = (containerType?.toLowerCase().includes('high cube') ||
                               containerType?.toLowerCase().includes('20hc')) &&
                              (containerType?.toLowerCase().includes('brand new') ||
                               containerType?.toLowerCase().includes('new'));
  const hcBrandNewSkuCheck = (containerSku?.toLowerCase().includes('20hc') ||
                              containerSku?.toLowerCase().includes('high cube')) &&
                             (containerSku?.toLowerCase().includes('brand new') ||
                              containerSku?.toLowerCase().includes('brandnew') ||
                              containerSku?.toLowerCase().includes('new'));
  const isHCBrandNewContainer = hcBrandNewTypeCheck || hcBrandNewSkuCheck;





  // Check for New containers (by condition, type, or SKU) - exclude SKU codes that start with NEW-
  const newTypeCheck = containerType?.toLowerCase().includes('new') ||
                       containerType?.toLowerCase().includes('brand new');
  // Don't match SKUs that start with "NEW-" as these are just identifier codes
  // Also exclude containers with specific conditions like WindandWaterTight, CargoWorthy, etc.
  const newSkuCheck = containerSku?.toLowerCase().includes('new') && 
                      !containerSku?.toLowerCase().startsWith('new-') &&
                      !containerSku?.toLowerCase().includes('windandwatertight') &&
                      !containerSku?.toLowerCase().includes('cargoworthy') &&
                      !isHCBrandNewContainer;
  const isNewContainer = newTypeCheck || newSkuCheck;

  // Check for Refrigerated Wind and Water Tight containers (highest priority for reefer WWT variants)
  const rfwwtTypeCheck = containerType?.toLowerCase().includes('rf-wwt') ||
                         containerType?.toLowerCase().includes('rfwwt') ||
                         containerType?.toLowerCase().includes('refrigerated wind and water tight') ||
                         containerType?.toLowerCase().includes('refrigerated wind & water tight') ||
                         containerType?.toLowerCase().includes('20gp-rf-wwt');
  const rfwwtSkuCheck = (containerSku?.toLowerCase().includes('rf-wwt') ||
                        containerSku?.toLowerCase().includes('rfwwt') ||
                        containerSku?.toLowerCase().includes('refrigerated wind and water tight') ||
                        containerSku?.toLowerCase().includes('refrigerated wind & water tight') ||
                        containerSku?.toLowerCase().includes('20gp-rf-wwt') ||
                        (containerSku?.toLowerCase().includes('windandwatertight') && 
                         containerType?.toLowerCase().includes('refrigerated')));
  const isRFWWTContainer = rfwwtTypeCheck || rfwwtSkuCheck;

  // Check for Refrigerated Cargo Worthy containers (for reefer CW variants)
  const rfcwTypeCheck = containerType?.toLowerCase().includes('rf-cw') ||
                        containerType?.toLowerCase().includes('rfcw') ||
                        containerType?.toLowerCase().includes('refrigerated cargo worthy') ||
                        containerType?.toLowerCase().includes('20gp-rf-cw');
  const rfcwSkuCheck = containerSku?.toLowerCase().includes('rf-cw') ||
                       containerSku?.toLowerCase().includes('rfcw') ||
                       containerSku?.toLowerCase().includes('refrigerated cargo worthy') ||
                       containerSku?.toLowerCase().includes('20gp-rf-cw') ||
                       containerSku?.toLowerCase().includes('cargoworthy');
  const isRFCWContainer = rfcwTypeCheck || rfcwSkuCheck;

  // Check for Refrigerated containers (for reefer variants)
  const rfTypeCheck = containerType?.toLowerCase().includes('refrigerated') ||
                      containerType?.toLowerCase().includes('reefer') ||
                      containerType?.toLowerCase().includes('rf') ||
                      containerType?.toLowerCase().includes('20gp-rf');
  const rfSkuCheck = containerSku?.toLowerCase().includes('rf') ||
                     containerSku?.toLowerCase().includes('reefer') ||
                     containerSku?.toLowerCase().includes('refrigerated') ||
                     containerSku?.toLowerCase().includes('20gp-rf');
  const isRFContainer = rfTypeCheck || rfSkuCheck;

  // Check for Open Top Wind and Water Tight containers (highest priority for open top variants)
  const otwwtTypeCheck = containerType?.toLowerCase().includes('ot-wwt') ||
                         containerType?.toLowerCase().includes('otwwt') ||
                         containerType?.toLowerCase().includes('wind and water tight') ||
                         containerType?.toLowerCase().includes('wind & water tight');
  const otwwtSkuCheck = containerSku?.toLowerCase().includes('ot-wwt') ||
                        containerSku?.toLowerCase().includes('otwwt') ||
                        containerSku?.toLowerCase().includes('wind and water tight') ||
                        containerSku?.toLowerCase().includes('wind & water tight');
  const isOTWWTContainer = otwwtTypeCheck || otwwtSkuCheck;

  // Check for Open Top Cargo Worthy containers (by type or SKU)
  const otcwTypeCheck = containerType?.toLowerCase().includes('open top') ||
                        containerType?.toLowerCase().includes('ot-cw') ||
                        containerType?.toLowerCase().includes('otcw');
  const otcwSkuCheck = containerSku?.toLowerCase().includes('ot-cw') ||
                       containerSku?.toLowerCase().includes('otcw') ||
                       containerSku?.toLowerCase().includes('open top');
  const isOTCWContainer = otcwTypeCheck || otcwSkuCheck;

  // Check for Multi-Side Door containers (highest priority for side door variants)
  const multiSideTypeCheck = containerType?.toLowerCase().includes('multi-side door') ||
                             containerType?.toLowerCase().includes('multi side door') ||
                             containerType?.toLowerCase().includes('multi-sidedoor') ||
                             containerType?.toLowerCase().includes('multisidedoor');
                             
  const multiSideSkuCheck = containerSku?.toLowerCase().includes('multi-side door') ||
                            containerSku?.toLowerCase().includes('multi side door') ||
                            containerSku?.toLowerCase().includes('multi-sidedoor') ||
                            containerSku?.toLowerCase().includes('multisidedoor');
                            
  // Also check if user specifically searched for Multi-Side Door
  const searchedForMultiSide = searchedContainerType === 'Multi-Side Door';
  
  // If it's a side door container from database AND user searched for Multi-Side Door, show Multi-Side Door images
  const isSideDoorFromDB = containerType?.toLowerCase().includes('side door container');
  const isMultiSideContainer = multiSideTypeCheck || multiSideSkuCheck || (searchedForMultiSide && isSideDoorFromDB);

  // Check for Full Open Sidedoor containers
  const sideDoorTypeCheck = containerType?.toLowerCase().includes('full open sidedoor') ||
                            containerType?.toLowerCase().includes('full-open-sidedoor') ||
                            containerType?.toLowerCase().includes('full open side') ||
                            containerType?.toLowerCase().includes('sidedoor') ||
                            containerType?.toLowerCase().includes('side door');
                            
  const sideDoorSkuCheck = containerSku?.toLowerCase().includes('full open sidedoor') ||
                           containerSku?.toLowerCase().includes('full-open-sidedoor') ||
                           containerSku?.toLowerCase().includes('full open side') ||
                           containerSku?.toLowerCase().includes('sidedoor') ||
                           containerSku?.toLowerCase().includes('side door');
                           
  const isSideDoorContainer = sideDoorTypeCheck || sideDoorSkuCheck;

  // Check for DoubleDoor containers
  const doubleDoorTypeCheck = containerType?.toLowerCase().includes('doubledoor') ||
                              containerType?.toLowerCase().includes('double door') ||
                              containerType?.toLowerCase().includes('double-door');
                              
  const doubleDoorSkuCheck = containerSku?.toLowerCase().includes('doubledoor') ||
                             containerSku?.toLowerCase().includes('double door') ||
                             containerSku?.toLowerCase().includes('double-door');
                             
  const isDoubleDoorContainer = doubleDoorTypeCheck || doubleDoorSkuCheck;

  // Check for non-refrigerated Wind and Water Tight containers (before Cargo Worthy)
  const wwtTypeCheck = containerType?.toLowerCase().includes('wind and water tight') ||
                       containerType?.toLowerCase().includes('wind & water tight') ||
                       containerType?.toLowerCase().includes('wwt') ||
                       containerType?.toLowerCase().includes('20gp-wwt');
  const wwtSkuCheck = (containerSku?.toLowerCase().includes('windandwatertight') ||
                      containerSku?.toLowerCase().includes('wind and water tight') ||
                      containerSku?.toLowerCase().includes('wind & water tight') ||
                      containerSku?.toLowerCase().includes('wwt') ||
                      containerSku?.toLowerCase().includes('20gp-wwt')) &&
                      !containerSku?.toLowerCase().includes('rf') &&
                      !containerSku?.toLowerCase().includes('refrigerated') &&
                      !containerSku?.toLowerCase().includes('ot-wwt') &&
                      !containerSku?.toLowerCase().includes('otwwt') &&
                      !containerSku?.toLowerCase().includes('open top');
  const isWWTContainer = wwtTypeCheck || wwtSkuCheck;



  // Check for CW containers (but exclude Open Top containers which should use OTCW images)
  const cwTypeCheck = (containerType?.toLowerCase().includes('cw') || 
                      containerType?.toLowerCase().includes('cargo worthy') ||
                      containerType?.toLowerCase().includes('cargoworthy') ||
                      containerType?.toLowerCase().includes('20gp') ||
                      containerType?.toLowerCase().includes('20dc')) &&
                      !containerType?.toLowerCase().includes('open top');
                      
  const cwSkuCheck = (containerSku?.toLowerCase().includes('cw') ||
                     containerSku?.toLowerCase().includes('cargo worthy') ||
                     containerSku?.toLowerCase().includes('cargoworthy') ||
                     containerSku?.toLowerCase().includes('20gp') ||
                     containerSku?.toLowerCase().includes('20dc')) &&
                     !containerSku?.toLowerCase().includes('open top');
                     
  const isCWContainer = cwTypeCheck || cwSkuCheck;



  // Determine which images to show (prioritize 53HC-OT-BrandNew, then 53HC-BrandNew, then 45HC-CW, then 45HC-IICL, then 45HC-WWT, then 45HC, then 40HC-CW, then 40GP Brand New, then 40GP CW, then 40GP DoubleDoor, then 40GP OT Brand New, then 40GP WWT, then 40HC Multi-sidedoor, then 40HC Open Top CW, then 40HC Open Top IICL, then 40HC RF-WWT, then 40HC Open Top WWT, then 40HC RF-CW, then 40HC RF, then 40HC WWT, then 40HC Full Open Sidedoor, then 40HC Brand New, then HC IICL, then HC Brand New, then New, then IICL, then RF-WWT, then RF-CW, then RF, then OT-WWT, then OTCW, then MultiSide, then SideDoor, then DoubleDoor, then WWT, then CW)
  const images = useMemo(() => {
    const selectedImages = is53HCOTBrandNewContainer ? hc53OTBrandNewImages :
           is53HCBrandNewContainer ? hc53BrandNewImages :
           is45HCCWContainer ? hc45CWImages :
           is45HCIICLContainer ? hc45IICLImages :
           is45HCWWTContainer ? hc45WWTImages :
           is45HCContainer ? hc45Images :
           is40HCCWContainer ? hc40CWImages :
           is40GPBrandNewContainer ? gp40BrandNewImages :
           is40GPCWContainer ? gp40CWImages :
           is40GPDoubleDoorContainer ? gp40DoubleDoorImages :
           is40HCAsIsContainer ? hc40AsIsImages :
           is40GPAsIsContainer ? gp40AsIsImages :
           is40GPOTBrandNewContainer ? gp40OTBrandNewImages :
           is40GPWWTContainer ? gp40WWTImages :
           is40HCMultiSidedoorContainer ? hc40MultiSidedoorImages :
           is40HCOTCWContainer ? hc40OTCWImages :
           is40HCOTIICLContainer ? hc40OTIICLImages :
           is40HCRFWWTContainer ? hc40RFWWTImages :
           is40HCOTWWTContainer ? hc40OTWWTImages :
           is40HCRFCWContainer ? hc40RFCWImages :
           is40HCRFContainer ? hc40RFImages :
           is40HCWWTContainer ? hc40WWTImages :
           is40HCFullOpenSidedoorContainer ? hc40FullOpenSidedoorImages :
           is40HCBrandNewContainer ? hc40BrandNewImages :
           is40HCIICLContainer ? hc40IICLImages :
           isHCIICLContainer ? iiclImages :
           isHCBrandNewContainer ? hcBrandNewImages :
           isNewContainer ? newContainerImages :
           isIICLContainer ? iiclImages :
           isRFWWTContainer ? rfwwtImages :
           isRFCWContainer ? rfcwImages :
           isRFContainer ? rfImages :
           isOTWWTContainer ? otwwtImages :
           isOTCWContainer ? otcwImages :
           isMultiSideContainer ? multiSideImages :
           isSideDoorContainer ? sideDoorImages :
           isDoubleDoorContainer ? doubleDoorImages : 
           isWWTContainer ? wwtImages :
           isCWContainer ? cwImages : [];



    return selectedImages;
  }, [
    is40GPAsIsContainer, is40HCAsIsContainer, is40HCIICLContainer, is53HCOTBrandNewContainer, is53HCBrandNewContainer, is45HCCWContainer, is45HCIICLContainer, is45HCWWTContainer, is45HCContainer, is40HCCWContainer, is40GPBrandNewContainer, is40GPCWContainer, is40GPDoubleDoorContainer, is40GPOTBrandNewContainer, 
    is40GPWWTContainer, is40HCMultiSidedoorContainer, is40HCOTCWContainer, is40HCOTIICLContainer, is40HCOTWWTContainer, 
    is40HCRFWWTContainer, is40HCRFCWContainer, is40HCRFContainer, is40HCWWTContainer, is40HCFullOpenSidedoorContainer, is40HCBrandNewContainer, isHCIICLContainer, isHCBrandNewContainer, 
    isNewContainer, isIICLContainer, isRFWWTContainer, isRFCWContainer, isRFContainer, isOTWWTContainer, isOTCWContainer, 
    isMultiSideContainer, isSideDoorContainer, isDoubleDoorContainer, isWWTContainer, isCWContainer
  ]);





  // Reset current index when images change to prevent out-of-bounds errors
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Check if this is a 20HC unavailable container
  const is20HCUnavailableContainer = (containerType?.toLowerCase().includes('20hc') || 
                                     containerSku?.toLowerCase().includes('20hc')) &&
                                    (containerCondition?.toLowerCase().includes('as is') ||
                                     containerCondition?.toLowerCase().includes('asis') ||
                                     containerCondition?.toLowerCase().includes('cargo worthy') ||
                                     containerCondition?.toLowerCase().includes('cargoworthy') ||
                                     containerCondition?.toLowerCase().includes('cw') ||
                                     containerCondition?.toLowerCase().includes('iicl') ||
                                     containerCondition?.toLowerCase().includes('wind and water tight') ||
                                     containerCondition?.toLowerCase().includes('wind & water tight') ||
                                     containerCondition?.toLowerCase().includes('wwt') ||
                                     containerCondition?.toLowerCase().includes('watertight') ||
                                     containerType?.toLowerCase().includes('open top') ||
                                     containerType?.toLowerCase().includes('open-top') ||
                                     containerType?.toLowerCase().includes('ot') ||
                                     containerType?.toLowerCase().includes('double door') ||
                                     containerType?.toLowerCase().includes('double-door') ||
                                     containerType?.toLowerCase().includes('doubledoor') ||
                                     containerType?.toLowerCase().includes('full open') ||
                                     containerType?.toLowerCase().includes('full-open') ||
                                     containerType?.toLowerCase().includes('side door') ||
                                     containerType?.toLowerCase().includes('side-door') ||
                                     containerType?.toLowerCase().includes('sidedoor') ||
                                     containerType?.toLowerCase().includes('multi-side') ||
                                     containerType?.toLowerCase().includes('multi side') ||
                                     containerType?.toLowerCase().includes('multisidedoor') ||
                                     containerType?.toLowerCase().includes('refrigerated') ||
                                     containerType?.toLowerCase().includes('rf'));

  // Don't render if not a supported container type or no images
  if ((!is40GPAsIsContainer && !is40HCAsIsContainer && !is40HCIICLContainer && !is53HCOTBrandNewContainer && !is53HCBrandNewContainer && !is45HCCWContainer && !is45HCIICLContainer && !is45HCWWTContainer && !is45HCContainer && !is40HCCWContainer && !is40GPBrandNewContainer && !is40GPCWContainer && !is40GPDoubleDoorContainer && !is40GPOTBrandNewContainer && !is40GPWWTContainer && !is40HCMultiSidedoorContainer && !is40HCOTCWContainer && !is40HCOTIICLContainer && !is40HCOTWWTContainer && !is40HCRFWWTContainer && !is40HCRFCWContainer && !is40HCRFContainer && !is40HCWWTContainer && !is40HCFullOpenSidedoorContainer && !is40HCBrandNewContainer && !isHCIICLContainer && !isHCBrandNewContainer && !isCWContainer && !isDoubleDoorContainer && !isSideDoorContainer && !isIICLContainer && !isMultiSideContainer && !isNewContainer && !isOTCWContainer && !isRFWWTContainer && !isRFCWContainer && !isRFContainer && !isOTWWTContainer && !isWWTContainer) || images.length === 0) {
    return null;
  }

  // Show unavailable message for 20HC unavailable containers
  if (is20HCUnavailableContainer) {
    return (
      <div className={`relative w-full max-w-md mx-auto ${className}`}>
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-gray-600 text-lg font-semibold mb-2">
              Sorry, Product Unavailable
            </div>
            <div className="text-gray-500 text-sm">
              This Container is currently out of stock
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show unavailable message for 53HC unavailable containers
  if (is53HCUnavailableContainer) {
    return (
      <div className={`relative w-full max-w-md mx-auto ${className}`}>
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <img
            src={defaultUnavailableContainer}
            alt="Container Unavailable"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-black bg-opacity-60 rounded-lg border-2 border-red-500">
              <div className="text-white text-lg font-bold mb-2 drop-shadow-lg">
                Sorry, Product Unavailable
              </div>
              <div className="text-red-200 text-sm font-medium drop-shadow-md">
                This Container is currently out of stock
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      {/* Main image container */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        {images.length > 0 && currentIndex < images.length && (
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="w-full h-full object-contain transition-opacity duration-300"
          />
        )}

        {/* Image counter */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigation arrows below image */}
      {showControls && images.length > 1 && (
        <div className="flex justify-center items-center mt-3 space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Dot indicators */}
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex 
                    ? 'bg-[#42d1bd]' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}