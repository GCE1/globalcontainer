import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContainerImage } from "@/components/ui/container-image";
import { RALColor } from "@/data/colors";

// Import container images from assets
// Using relative paths to make sure we can find the images properly
import RAL1001 from "../assets/20GP-RAL1001.png";
import RAL1002 from "../assets/20GP-RAL1002.png";
import RAL1003 from "../assets/20GP-RAL1003.png";
import RAL1004 from "../assets/20GP-RAL1004.png";
import RAL1005 from "../assets/20GP-RAL1005.png";
import RAL1006 from "../assets/20GP-RAL1006.png";
import RAL1007 from "../assets/20GP-RAL1007.png";
import RAL1011 from "../assets/20GP-RAL1011.png";
import RAL1012 from "../assets/20GP-RAL1012.png";
import RAL1013 from "../assets/20GP-RAL1013.png";
import RAL1014 from "../assets/20GP-RAL1014.png";
import RAL1015 from "../assets/20GP-RAL1015.png";
import RAL1016 from "../assets/20GP-RAL1016.png";
import RAL1017 from "../assets/20GP-RAL1017.png";
import RAL1018 from "../assets/20GP-RAL1018.png";
import RAL1019 from "../assets/20GP-RAL1019.png";
import RAL1020 from "../assets/20GP-RAL1020.png";
import RAL1021 from "../assets/20GP-RAL1021.png";
import RAL1023 from "../assets/20GP-RAL1023.png";
import RAL1024 from "../assets/20GP-RAL1024.png";
import RAL1026 from "../assets/20GP-RAL1026.png";
import RAL1027 from "../assets/20GP-RAL1027.png";
import RAL1028 from "../assets/20GP-RAL1028.png";
import RAL1032 from "../assets/20GP-RAL1032.png";
import RAL1033 from "../assets/20GP-RAL1033.png";
import RAL1034 from "../assets/20GP-RAL1034.png";
import RAL1036 from "../assets/20GP-RAL1036.png";
import RAL1037 from "../assets/20GP-RAL1037.png";
// New container images
import RAL6013 from "../assets/20GP-RAL6013.png";
import RAL7047 from "../assets/20GP-RAL7047.png";
import RAL7048 from "../assets/20GP-RAL7048.png";
import RAL8008 from "../assets/20GP-RAL8008.png";
import RAL8029 from "../assets/20GP-RAL8029.png";
import RAL9001 from "../assets/20GP-RAL9001.png";
import RAL9002 from "../assets/20GP-RAL9002.png";
import RAL9003 from "../assets/20GP-RAL9003.png";
import RAL9004 from "../assets/20GP-RAL9004.png";
import RAL9005 from "../assets/20GP-RAL9005.png";
import RAL9006 from "../assets/20GP-RAL9006.png";
import RAL9007 from "../assets/20GP-RAL9007.png";
import RAL2000 from "../assets/20GP-RAL2000.png";
import RAL2001 from "../assets/20GP-RAL2001.png";
import RAL2002 from "../assets/20GP-RAL2002.png";
import RAL2003 from "../assets/20GP-RAL2003.png";
import RAL2004 from "../assets/20GP-RAL2004.png";
import RAL3000 from "../assets/20GP-RAL3000.png";
import RAL3001 from "../assets/20GP-RAL3001.png";
import RAL3002 from "../assets/20GP-RAL3002.png";
import RAL3003 from "../assets/20GP-RAL3003.png";
import RAL3004 from "../assets/20GP-RAL3004.png";
import RAL3005 from "../assets/20GP-RAL3005.png";
import RAL3007 from "../assets/20GP-RAL3007.png";
import RAL3009 from "../assets/20GP-RAL3009.png";
import RAL3011 from "../assets/20GP-RAL3011.png";
import RAL3012 from "../assets/20GP-RAL3012.png";
import RAL3013 from "../assets/20GP-RAL3013.png";
import RAL3014 from "../assets/20GP-RAL3014.png";
import RAL3015 from "../assets/20GP-RAL3015.png";
import RAL3016 from "../assets/20GP-RAL3016.png";
import RAL3017 from "../assets/20GP-RAL3017.png";
import RAL3018 from "../assets/20GP-RAL3018.png";
import RAL3020 from "../assets/20GP-RAL3020.png";
import RAL3022 from "../assets/20GP-RAL3022.png";
import RAL3024 from "../assets/20GP-RAL3024.png";
import RAL3026 from "../assets/20GP-RAL3026.png";
import RAL3027 from "../assets/20GP-RAL3027.png";
import RAL3028 from "../assets/20GP-RAL3028.png";
import RAL3031 from "../assets/20GP-RAL3031.png";
import RAL3032 from "../assets/20GP-RAL3032.png";
import RAL3033 from "../assets/20GP-RAL3033.png";
import RAL4001 from "../assets/20GP-RAL4001.png";
import RAL4002 from "../assets/20GP-RAL4002.png";
import RAL4003 from "../assets/20GP-RAL4003.png";
import RAL4004 from "../assets/20GP-RAL4004.png";
import RAL4005 from "../assets/20GP-RAL4005.png";
import RAL4006 from "../assets/20GP-RAL4006.png";
import RAL4007 from "../assets/20GP-RAL4007.png";
import RAL5004 from "../assets/20GP-RAL5004.png";
import RAL5005 from "../assets/20GP-RAL5005.png";
import RAL5007 from "../assets/20GP-RAL5007.png";
import RAL5008 from "../assets/20GP-RAL5008.png";
import RAL5009 from "../assets/20GP-RAL5009.png";
import RAL5010 from "../assets/20GP-RAL5010.png";
import RAL5011 from "../assets/20GP-RAL5011.png";
import RAL5012 from "../assets/20GP-RAL5012.png";
import RAL5013 from "../assets/20GP-RAL5013.png";
import RAL5014 from "../assets/20GP-RAL5014.png";
import RAL5015 from "../assets/20GP-RAL5015.png";
import RAL5017 from "../assets/20GP-RAL5017.png";
import RAL5026 from "../assets/20GP-RAL5026.png";
import RAL6000 from "../assets/20GP-RAL6000.png";
import RAL6001 from "../assets/20GP-RAL6001.png";
import RAL6002 from "../assets/20GP-RAL6002.png";
import RAL6003 from "../assets/20GP-RAL6003.png";
import RAL6004 from "../assets/20GP-RAL6004.png";
import RAL6005 from "../assets/20GP-RAL6005.png";
import RAL6006 from "../assets/20GP-RAL6006.png";
import RAL6007 from "../assets/20GP-RAL6007.png";
import RAL6009 from "../assets/20GP-RAL6009.png";
import RAL6010 from "../assets/20GP-RAL6010.png";
import RAL6011 from "../assets/20GP-RAL6011.png";
import RAL6020 from "../assets/20GP-RAL6020.png";
import RAL6021 from "../assets/20GP-RAL6021.png";
import RAL6022 from "../assets/20GP-RAL6022.png";
import RAL6024 from "../assets/20GP-RAL6024.png";
import RAL6025 from "../assets/20GP-RAL6025.png";
import RAL6026 from "../assets/20GP-RAL6026.png";
import RAL6027 from "../assets/20GP-RAL6027.png";
import RAL6028 from "../assets/20GP-RAL6028.png";
import RAL6029 from "../assets/20GP-RAL6029.png";
import RAL6032 from "../assets/20GP-RAL6032.png";
import RAL6033 from "../assets/20GP-RAL6033.png";
import RAL6034 from "../assets/20GP-RAL6034.png";
import RAL7002 from "../assets/20GP-RAL7002.png";
import RAL7003 from "../assets/20GP-RAL7003.png";
import RAL7004 from "../assets/20GP-RAL7004.png";
import RAL7005 from "../assets/20GP-RAL7005.png";
import RAL7006 from "../assets/20GP-RAL7006.png";
import RAL7008 from "../assets/20GP-RAL7008.png";
import RAL7009 from "../assets/20GP-RAL7009.png";
import RAL7010 from "../assets/20GP-RAL7010.png";
import RAL7011 from "../assets/20GP-RAL7011.png";
import RAL7012 from "../assets/20GP-RAL7012.png";
import RAL7013 from "../assets/20GP-RAL7013.png";
import RAL7015 from "../assets/20GP-RAL7015.png";
import RAL7016 from "../assets/20GP-RAL7016.png";
import RAL7021 from "../assets/20GP-RAL7021.png";
import RAL7034 from "../assets/20GP-RAL7034.png";
import RAL7035 from "../assets/20GP-RAL7035.png";
import RAL7036 from "../assets/20GP-RAL7036.png";
import RAL7037 from "../assets/20GP-RAL7037.png";
import RAL7038 from "../assets/20GP-RAL7038.png";
import RAL7039 from "../assets/20GP-RAL7039.png";
import RAL7040 from "../assets/20GP-RAL7040.png";
import RAL7042 from "../assets/20GP-RAL7042.png";
import RAL7043 from "../assets/20GP-RAL7043.png";
import RAL7044 from "../assets/20GP-RAL7044.png";
import RAL7045 from "../assets/20GP-RAL7045.png";
import RAL7046 from "../assets/20GP-RAL7046.png";
import RAL8000 from "../assets/20GP-RAL8000.png";
import RAL8001 from "../assets/20GP-RAL8001.png";
import RAL8002 from "../assets/20GP-RAL8002.png";
import RAL8003 from "../assets/20GP-RAL8003.png";
import RAL8004 from "../assets/20GP-RAL8004.png";
import RAL8007 from "../assets/20GP-RAL8007.png";
import RAL8011 from "../assets/20GP-RAL8011.png";
import RAL8012 from "../assets/20GP-RAL8012.png";
import RAL8014 from "../assets/20GP-RAL8014.png";
import RAL8015 from "../assets/20GP-RAL8015.png";
import RAL8016 from "../assets/20GP-RAL8016.png";
import RAL8017 from "../assets/20GP-RAL8017.png";
import RAL8019 from "../assets/20GP-RAL8019.png";
import RAL8022 from "../assets/20GP-RAL8022.png";
import RAL8023 from "../assets/20GP-RAL8023.png";
import RAL8024 from "../assets/20GP-RAL8024.png";
import RAL8025 from "../assets/20GP-RAL8025.png";
import RAL8028 from "../assets/20GP-RAL8028.png";
import RAL9010 from "../assets/20GP-RAL9010.png";
import RAL9011 from "../assets/20GP-RAL9011.png";
import RAL9016 from "../assets/20GP-RAL9016.png";
import RAL9017 from "../assets/20GP-RAL9017.png";
import RAL9018 from "../assets/20GP-RAL9018.png";
import RAL9022 from "../assets/20GP-RAL9022.png";
import RAL9023 from "../assets/20GP-RAL9023.png";
import RALCamo from "../assets/20GP-RAL-Camo.png";

// Map RAL codes to image paths
const containerImages: Record<string, string> = {
  "RAL 1001": RAL1001,
  "RAL 1002": RAL1002,
  "RAL 1003": RAL1003,
  "RAL 1004": RAL1004,
  "RAL 1005": RAL1005,
  "RAL 1006": RAL1006,
  "RAL 1007": RAL1007,
  "RAL 1011": RAL1011,
  "RAL 1012": RAL1012,
  "RAL 1013": RAL1013,
  "RAL 1014": RAL1014,
  "RAL 1015": RAL1015,
  "RAL 1016": RAL1016,
  "RAL 1017": RAL1017,
  "RAL 1018": RAL1018,
  "RAL 1019": RAL1019,
  "RAL 1020": RAL1020,
  "RAL 1021": RAL1021,
  "RAL 1023": RAL1023,
  "RAL 1024": RAL1024,
  "RAL 1026": RAL1026,
  "RAL 1027": RAL1027,
  "RAL 1028": RAL1028,
  "RAL 1032": RAL1032,
  "RAL 1033": RAL1033,
  "RAL 1034": RAL1034,
  "RAL 1036": RAL1036,
  "RAL 1037": RAL1037,
  "RAL 6013": RAL6013,
  "RAL 7047": RAL7047,
  "RAL 7048": RAL7048,
  "RAL 8008": RAL8008,
  "RAL 8029": RAL8029,
  "RAL 9001": RAL9001,
  "RAL 9002": RAL9002,
  "RAL 9003": RAL9003,
  "RAL 9004": RAL9004,
  "RAL 9005": RAL9005,
  "RAL 9006": RAL9006,
  "RAL 9007": RAL9007,
  "RAL 2000": RAL2000,
  "RAL 2001": RAL2001,
  "RAL 2002": RAL2002,
  "RAL 2003": RAL2003,
  "RAL 2004": RAL2004,
  "RAL 3000": RAL3000,
  "RAL 3001": RAL3001,
  "RAL 3002": RAL3002,
  "RAL 3003": RAL3003,
  "RAL 3004": RAL3004,
  "RAL 3005": RAL3005,
  "RAL 3007": RAL3007,
  "RAL 3009": RAL3009,
  "RAL 3011": RAL3011,
  "RAL 3012": RAL3012,
  "RAL 3013": RAL3013,
  "RAL 3014": RAL3014,
  "RAL 3015": RAL3015,
  "RAL 3016": RAL3016,
  "RAL 3017": RAL3017,
  "RAL 3018": RAL3018,
  "RAL 3020": RAL3020,
  "RAL 3022": RAL3022,
  "RAL 3024": RAL3024,
  "RAL 3026": RAL3026,
  "RAL 3027": RAL3027,
  "RAL 3028": RAL3028,
  "RAL 3031": RAL3031,
  "RAL 3032": RAL3032,
  "RAL 3033": RAL3033,
  "RAL 4001": RAL4001,
  "RAL 4002": RAL4002,
  "RAL 4003": RAL4003,
  "RAL 4004": RAL4004,
  "RAL 4005": RAL4005,
  "RAL 4006": RAL4006,
  "RAL 4007": RAL4007,
  "RAL 5004": RAL5004,
  "RAL 5005": RAL5005,
  "RAL 5007": RAL5007,
  "RAL 5008": RAL5008,
  "RAL 5009": RAL5009,
  "RAL 5010": RAL5010,
  "RAL 5011": RAL5011,
  "RAL 5012": RAL5012,
  "RAL 5013": RAL5013,
  "RAL 5014": RAL5014,
  "RAL 5015": RAL5015,
  "RAL 5017": RAL5017,
  "RAL 5026": RAL5026,
  "RAL 6000": RAL6000,
  "RAL 6001": RAL6001,
  "RAL 6002": RAL6002,
  "RAL 6003": RAL6003,
  "RAL 6004": RAL6004,
  "RAL 6005": RAL6005,
  "RAL 6006": RAL6006,
  "RAL 6007": RAL6007,
  "RAL 6009": RAL6009,
  "RAL 6010": RAL6010,
  "RAL 6011": RAL6011,
  "RAL 6020": RAL6020,
  "RAL 6021": RAL6021,
  "RAL 6022": RAL6022,
  "RAL 6024": RAL6024,
  "RAL 6025": RAL6025,
  "RAL 6026": RAL6026,
  "RAL 6027": RAL6027,
  "RAL 6028": RAL6028,
  "RAL 6029": RAL6029,
  "RAL 6032": RAL6032,
  "RAL 6033": RAL6033,
  "RAL 6034": RAL6034,
  "RAL 7002": RAL7002,
  "RAL 7003": RAL7003,
  "RAL 7004": RAL7004,
  "RAL 7005": RAL7005,
  "RAL 7006": RAL7006,
  "RAL 7008": RAL7008,
  "RAL 7009": RAL7009,
  "RAL 7010": RAL7010,
  "RAL 7011": RAL7011,
  "RAL 7012": RAL7012,
  "RAL 7013": RAL7013,
  "RAL 7015": RAL7015,
  "RAL 7016": RAL7016,
  "RAL 7021": RAL7021,
  "RAL 7034": RAL7034,
  "RAL 7035": RAL7035,
  "RAL 7036": RAL7036,
  "RAL 7037": RAL7037,
  "RAL 7038": RAL7038,
  "RAL 7039": RAL7039,
  "RAL 7040": RAL7040,
  "RAL 7042": RAL7042,
  "RAL 7043": RAL7043,
  "RAL 7044": RAL7044,
  "RAL 7045": RAL7045,
  "RAL 7046": RAL7046,
  "RAL 8000": RAL8000,
  "RAL 8001": RAL8001,
  "RAL 8002": RAL8002,
  "RAL 8003": RAL8003,
  "RAL 8004": RAL8004,
  "RAL 8007": RAL8007,
  "RAL 8011": RAL8011,
  "RAL 8012": RAL8012,
  "RAL 8014": RAL8014,
  "RAL 8015": RAL8015,
  "RAL 8016": RAL8016,
  "RAL 8017": RAL8017,
  "RAL 8019": RAL8019,
  "RAL 8022": RAL8022,
  "RAL 8023": RAL8023,
  "RAL 8024": RAL8024,
  "RAL 8025": RAL8025,
  "RAL 8028": RAL8028,
  "RAL 9010": RAL9010,
  "RAL 9011": RAL9011,
  "RAL 9016": RAL9016,
  "RAL 9017": RAL9017,
  "RAL 9018": RAL9018,
  "RAL 9022": RAL9022,
  "RAL 9023": RAL9023,
  "Camo": RALCamo,
};

interface ContainerPreviewProps {
  selectedColor: RALColor;
  selectedSize?: string;
  selectedFeature?: string;
}

const ContainerPreview: React.FC<ContainerPreviewProps> = ({
  selectedColor,
  selectedSize = "20ft",
  selectedFeature = "standard",
}) => {
  // Check if we have an image for this RAL color and fall back to a similar color if not found
  const containerImage = useMemo(() => {
    // If we have the exact image, use it
    if (containerImages[selectedColor.ral]) {
      return containerImages[selectedColor.ral];
    }
    
    // Handle all missing RAL images by returning visually similar colors
    // This ensures users always see an appropriate container visualization
    
    // Create groups of colors that can use similar fallbacks
    
    // Missing yellows and beiges (1000 series) and oranges (2000 series)
    if (["RAL 1008", "RAL 1009", "RAL 1010", "RAL 1035"].includes(selectedColor.ral)) {
      return containerImages["RAL 1011"]; // Similar brown beige/pearl beige
    }
    
    // Missing oranges (2000 series)
    if (["RAL 2013"].includes(selectedColor.ral)) {
      return containerImages["RAL 2001"]; // Similar red orange/pearl orange
    }
    
    // Missing grays (7000 series)
    if (["RAL 7000", "RAL 7001", "RAL 7022", "RAL 7023", "RAL 7024", "RAL 7026", 
         "RAL 7030", "RAL 7031", "RAL 7032", "RAL 7033"].includes(selectedColor.ral)) {
      return containerImages["RAL 7035"]; // Light grey as fallback
    }
    
    // Missing greens (6000 series)
    if (["RAL 6008", "RAL 6012", "RAL 6014", "RAL 6015", "RAL 6016", 
         "RAL 6017", "RAL 6018", "RAL 6019", "RAL 6035", 
         "RAL 6036", "RAL 6037", "RAL 6038"].includes(selectedColor.ral)) {
      return containerImages["RAL 6005"]; // Moss green as fallback
    }
    
    // Missing blues (5000 series)
    if (["RAL 5018", "RAL 5019", "RAL 5020", "RAL 5021", "RAL 5022", 
         "RAL 5023", "RAL 5024", "RAL 5025"].includes(selectedColor.ral)) {
      return containerImages["RAL 5015"]; // Sky blue as fallback
    }
    
    // Return undefined if no image found, which will trigger the SVG fallback
    return undefined;
  }, [selectedColor.ral]);
  
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <h2 className="text-base font-semibold mb-3 text-gray-800">Container Preview</h2>
        
        {/* Container image wrapper with optimized dimensions */}
        <div 
          className="container-preview relative bg-white rounded-md overflow-hidden mb-3 border border-gray-200 shadow-sm flex items-center justify-center flex-grow"
          style={{ 
            position: "relative",
            marginTop: "10px"
          }}
        >
          {/* Image container - uses full width with perfect centering */}
          <div className="flex items-center justify-center w-full h-full">
            {containerImage ? (
              <div className="flex items-center justify-center w-full h-full">
                <img 
                  src={containerImage} 
                  alt={`${selectedColor.ral} container`}
                  style={{
                    width: "85%", 
                    height: "85%", 
                    objectFit: "contain",
                    transition: "all 0.3s ease"
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ContainerImage 
                  color={selectedColor.hex} 
                  className="w-full h-full p-4"
                />
              </div>
            )}
          </div>
          
          {/* Enhanced color label in top left corner */}
          <div 
            className="absolute top-3 left-3 px-4 py-2 rounded-md text-sm font-medium z-10 shadow-md"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: `2px solid ${selectedColor.hex}`,
              transition: "all 0.3s ease"
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedColor.hex }}
              ></div>
              <div style={{ color: selectedColor.hex }}>
                <span className="font-bold">{selectedColor.ral}</span> - {selectedColor.name}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContainerPreview;
