interface WaveSeparatorProps {
  /** Background color class for the wave container (e.g., 'bg-primary', 'bg-stone-50') */
  bgColor?: string;
  /** Fill color class for the wave path (e.g., 'text-white', 'text-stone-50') */
  fillColor?: string;
}

/**
 * A decorative wave separator component for transitioning between sections.
 * The wave SVG creates a smooth curved transition between two sections.
 */
const WaveSeparator: React.FC<WaveSeparatorProps> = ({
  bgColor = 'bg-primary',
  fillColor = 'text-stone-50'
}) => {
  return (
    <div className={bgColor}>
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-auto block"
        style={{ transform: 'translateY(1px)' }}
      >
        <path
          d="M0,50 C480,150 960,0 1440,50 L1440,100 L0,100 Z"
          className={`fill-current ${fillColor}`}
        />
      </svg>
    </div>
  );
};

export default WaveSeparator;
