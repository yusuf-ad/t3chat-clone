function MessageLoading() {
  return (
    <svg
      width="42" // Increased from 36 to 42
      height="42" // Increased from 36 to 42
      viewBox="0 0 42 42" // Adjusted to match the new size
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <circle cx="7" cy="21" r="3.5" fill="currentColor">
        {" "}
        // Adjusted cx, cy, and r for larger size
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="21;10.5;21" // Adjusted values to match new cy
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="21" cy="21" r="3.5" fill="currentColor">
        {" "}
        // Adjusted cx, cy, and r for larger size
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="21;10.5;21" // Adjusted values to match new cy
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="35" cy="21" r="3.5" fill="currentColor">
        {" "}
        // Adjusted cx, cy, and r for larger size
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="21;10.5;21" // Adjusted values to match new cy
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}

export { MessageLoading };
