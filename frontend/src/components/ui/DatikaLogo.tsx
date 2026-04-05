interface DatikaLogoProps {
  /** Width of the icon mark in px */
  size?: number;
  /** Show "DATIKA" wordmark next to icon */
  showText?: boolean;
  /** Text colour (defaults to #1e3a6e) */
  textColor?: string;
  className?: string;
}

/**
 * Datika brand logo — geometric diamond network mark + DATIKA wordmark.
 * Approximated from the brand image: navy diamond, connected node graph,
 * green arrow accent.
 */
export default function DatikaLogo({
  size = 40,
  showText = true,
  textColor = '#1e3a6e',
  className = '',
}: DatikaLogoProps) {
  const totalW = showText ? size * 2.8 : size;
  const h = size;

  /* All coordinates are in a 70×70 viewBox */
  const nodes = [
    { id: 'A', cx: 35, cy: 4  },   // top
    { id: 'B', cx: 56, cy: 18 },   // upper-right
    { id: 'C', cx: 66, cy: 35 },   // right corner
    { id: 'D', cx: 56, cy: 52 },   // lower-right
    { id: 'E', cx: 35, cy: 66 },   // bottom
    { id: 'F', cx: 14, cy: 52 },   // lower-left (hollow)
    { id: 'G', cx: 4,  cy: 35 },   // left corner
    { id: 'H', cx: 14, cy: 18 },   // upper-left
    { id: 'I', cx: 35, cy: 20 },   // inner-upper
    { id: 'J', cx: 50, cy: 35 },   // inner-right
    { id: 'K', cx: 35, cy: 50 },   // inner-lower
  ];

  const edges: [string, string][] = [
    ['A','B'], ['A','I'],
    ['B','C'], ['B','I'],
    ['C','J'],
    ['H','I'], ['H','G'],
    ['I','J'], ['I','K'],
    ['J','D'],
    ['K','D'], ['K','F'], ['K','E'],
    ['F','E'], ['G','F'],
  ];

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg
      width={totalW}
      height={h}
      viewBox={`0 0 ${showText ? 196 : 70} 70`}
      fill="none"
      className={className}
      aria-label="Datika"
    >
      {/* ── Diamond outer frame ── */}
      <path
        d="M35 2 L68 35 L35 68 L2 35 Z"
        stroke="#1e3a6e"
        strokeWidth="1.8"
        fill="none"
      />

      {/* ── Network edges ── */}
      {edges.map(([a, b]) => {
        const n1 = nodeMap[a];
        const n2 = nodeMap[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={n1.cx} y1={n1.cy}
            x2={n2.cx} y2={n2.cy}
            stroke="#2d5a9e"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        );
      })}

      {/* ── Nodes ── */}
      {nodes.map((n) =>
        n.id === 'F' ? (
          /* Hollow circle for lower-left node */
          <circle
            key={n.id}
            cx={n.cx} cy={n.cy}
            r="2.8"
            stroke="#1e3a6e"
            strokeWidth="1.4"
            fill="white"
          />
        ) : (
          <circle
            key={n.id}
            cx={n.cx} cy={n.cy}
            r={['A','C','E','G'].includes(n.id) ? 2.4 : 3}
            fill={['I','J'].includes(n.id) ? '#4a80c4' : '#1e3a6e'}
          />
        )
      )}

      {/* ── Green arrow accent (points upper-right from centre) ── */}
      <path
        d="M38 40 L50 26"
        stroke="#5bab6f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M44 24 L50 26 L48 32"
        stroke="#5bab6f"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── DATIKA wordmark ── */}
      {showText && (
        <text
          x="80"
          y="46"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700"
          fontSize="26"
          letterSpacing="2"
          fill={textColor}
        >
          DATIKA
        </text>
      )}
    </svg>
  );
}
