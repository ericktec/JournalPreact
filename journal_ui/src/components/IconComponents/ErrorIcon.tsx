import { ComponentProps } from "preact";

const SvgComponent = ({stroke="#000", ...props}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 16h.01M12 8v4m0 9a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
    />
  </svg>
)
export default SvgComponent