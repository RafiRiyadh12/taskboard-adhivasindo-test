import { MEMBERS } from '../data/seed';

function Avatar({ member, size = 26 }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: member.color,
        fontSize: size * 0.4,
      }}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}

export default function AvatarGroup({ memberIds = [], max = 3, size }) {
  const members = memberIds.map((id) => MEMBERS.find((m) => m.id === id)).filter(Boolean);
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;

  return (
    <div className="avatar-group">
      {shown.map((m) => (
        <Avatar key={m.id} member={m} size={size} />
      ))}
      {extra > 0 && (
        <div className="avatar avatar-extra" style={{ width: size, height: size, fontSize: size * 0.38 }}>
          +{extra}
        </div>
      )}
    </div>
  );
}
