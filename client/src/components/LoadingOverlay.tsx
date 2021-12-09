import React from "react";
import Loader from "react-loader-spinner";

const LoadingOverlay = ({ isLoading }: Props) => {
  return (
    <div
      className="loading-overlay"
      style={{ display: isLoading ? "flex" : "none" }}
    >
      <Loader
        type="MutatingDots"
        color="green"
        secondaryColor="red"
        width={125}
        height={125}
      />
    </div>
  );
};

interface Props {
  isLoading: boolean;
}

export default LoadingOverlay;
