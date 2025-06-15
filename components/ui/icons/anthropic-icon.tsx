import { SVGProps } from "react";

export function AnthropicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2L1 22h4.5l1.8-4h9.4l1.8 4H23L12 2zm-2.5 12l2.5-5.5l2.5 5.5h-5z"
      />
    </svg>
  );
}
