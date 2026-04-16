export default function StatusBadge({ missing, isLate, statusMessage }) {
  let color = "";
  let bg = "";
  let label = statusMessage;

  if (statusMessage.includes("En avance")) {
    color = "#0FBF60";
    bg = "rgba(15,191,96,0.12)";
  } else if (missing === 0) {
    color = "#0FBF60";
    bg = "rgba(15,191,96,0.12)";
    label = "À jour";
  } else if (missing > 0 && !isLate) {
    color = "#FFB020";
    bg = "rgba(255,176,32,0.12)";
  } else if (missing > 0 && isLate) {
    color = "#FF4D4F";
    bg = "rgba(255,77,79,0.12)";
  }

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "10px",
        fontSize: "0.8rem",
        fontWeight: 600,
        color,
        backgroundColor: bg,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}
