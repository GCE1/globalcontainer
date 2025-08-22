import React, { useState, useEffect } from "react";
import { RALColor } from "@/data/colors";
import { ContainerImage } from "@/components/ui/container-image";

interface RealisticContainerProps {
  color: RALColor;
  className?: string;
}

export const RealisticContainer: React.FC<RealisticContainerProps> = ({ 
  color, 
  className = "" 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Create dynamic image path - this will access the images in the public folder
  const imageCode = color.ral.replace(/\s+/g, ""); // Remove space from RAL code (RAL 1001 -> RAL1001)
  const imagePath = `/containers/${imageCode}.png`;
  
  // Reset image loaded state when color changes
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = imagePath;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, [color.ral, imagePath]);
  
  return (
    <div className={`${className} container-image-wrapper relative`}>
      {imageLoaded ? (
        <img 
          src={imagePath}
          alt={`${color.ral} Container`}
          className="w-full h-auto rounded-md shadow"
        />
      ) : (
        <ContainerImage 
          color={color.hex} 
          className="w-full h-auto rounded-md"
        />
      )}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-3 py-1 rounded-md text-sm font-medium">
        {color.ral} - {color.name}
      </div>
    </div>
  );
};

export default RealisticContainer;