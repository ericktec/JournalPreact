type Props = {
  fill: string;
  width: number;
  height: number;
}

const SvgComponent = ({ fill="#000", width=800, height=800, ...props }: Props)  => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={fill}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M15 12h-3m0 0H9m3 0V9m0 3v3M7 3.338A9.954 9.954 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
    />
  </svg>
)
export default SvgComponent