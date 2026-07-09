import { LABELS } from '../data/seed';

export default function LabelBadge({ labelId }) {
  const label = LABELS.find((l) => l.id === labelId);
  if (!label) return null;
  return (
    <div className="label-badge" style={{ color: label.color, background: `${label.color}1A` }}>
      <span className="label-bar" style={{ background: label.color }} />
      {label.name}
    </div>
  );
}
