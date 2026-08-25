/** The Uhodim wordmark — an orbit glyph and the name. Plain markup, styled by uhodim.css. */
export function Wordmark() {
  return (
    <span className="uhodim-wordmark">
      <svg
        className="uhodim-wordmark__mark"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="6" />
        <ellipse cx="16" cy="16" rx="14" ry="5" transform="rotate(-30 16 16)" />
        <circle cx="27" cy="9" r="2" fill="currentColor" stroke="none" />
      </svg>
      Uhodim
    </span>
  );
}
