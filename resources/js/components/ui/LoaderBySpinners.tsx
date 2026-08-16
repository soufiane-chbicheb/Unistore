import React from "react";
import {
  ClipLoader,
  BeatLoader,
  CircleLoader,
  RingLoader,
  ScaleLoader,
} from "react-spinners";

type LoaderProps = {
  style?: "clip" | "beat" | "circle" | "ring" | "scale";
  size?: number;
  color?: string;
};

const LoaderBySpinners: React.FC<LoaderProps> = ({
  style = "clip",
  size = 40,
  color = "#00bfff",
}) => {
  const loaderMap = {
    clip: <ClipLoader size={size} color={color} />,
    beat: <BeatLoader size={size / 4} color={color} />,
    circle: <CircleLoader size={size} color={color} />,
    ring: <RingLoader size={size} color={color} />,
    scale: <ScaleLoader height={size} width={6} color={color} />,
  };

  return <div className="flex items-center justify-center">{loaderMap[style]}</div>;
};

export default LoaderBySpinners;
