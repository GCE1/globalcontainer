import React from "react";

interface ContainerImageProps {
  color: string;
  className?: string;
}

export const ContainerImage: React.FC<ContainerImageProps> = ({ color, className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 600 300"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Container body */}
      <rect
        x="50"
        y="50"
        width="500"
        height="200"
        rx="2"
        fill={color}
        stroke="#333"
        strokeWidth="2"
        style={{ transition: "fill 0.5s ease" }}
      />
      
      {/* Container door outlines */}
      <rect
        x="460"
        y="60"
        width="80"
        height="180"
        rx="1"
        fill={color}
        stroke="#444"
        strokeWidth="1.5"
        style={{ transition: "fill 0.5s ease" }}
      />
      
      {/* Door handle and locking bars */}
      <rect x="520" y="120" width="10" height="40" rx="1" fill="#555" />
      <rect x="475" y="60" width="2" height="180" fill="#555" />
      <rect x="495" y="60" width="2" height="180" fill="#555" />
      <rect x="515" y="60" width="2" height="180" fill="#555" />
      <rect x="535" y="60" width="2" height="180" fill="#555" />
      
      {/* Container side panels/ridges */}
      {[...Array(10)].map((_, i) => (
        <line
          key={`ridge-${i}`}
          x1="50"
          y1={70 + i * 18}
          x2="460"
          y2={70 + i * 18}
          stroke="#555"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      
      {/* Container top edge highlights */}
      <line x1="50" y1="50" x2="550" y2="50" stroke="#666" strokeWidth="3" />
      
      {/* Warning sign */}
      <g transform="translate(80, 100) scale(0.4)">
        <polygon
          points="0,86.6 50,0 100,86.6"
          fill="#FFF100"
          stroke="#000"
          strokeWidth="5"
        />
        <text
          x="50"
          y="70"
          fontSize="60"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000"
        >
          !
        </text>
      </g>
      
      {/* Container corner fittings */}
      <rect x="45" y="45" width="15" height="15" fill="#444" />
      <rect x="540" y="45" width="15" height="15" fill="#444" />
      <rect x="45" y="240" width="15" height="15" fill="#444" />
      <rect x="540" y="240" width="15" height="15" fill="#444" />
    </svg>
  );
};
