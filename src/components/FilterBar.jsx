import { IonIcon, IonSearchbar } from '@ionic/react';
import { funnelOutline, closeCircle } from 'ionicons/icons';
import { MEMBERS, LABELS } from '../data/seed';

export default function FilterBar({ filters, setFilters, boardName }) {
  const hasActiveFilter = filters.assignee || filters.label || filters.dueDate;

  const clear = () => setFilters({ search: filters.search, assignee: '', label: '', dueDate: '' });

  return (
    <div className="filter-bar">
      <div className="filter-bar-left">
        <div className="board-badge">{boardName}</div>
      </div>

      <div className="filter-bar-right">
        <select
          className="filter-select"
          value={filters.assignee}
          onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
        >
          <option value="">Semua Assignee</option>
          {MEMBERS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.label}
          onChange={(e) => setFilters({ ...filters, label: e.target.value })}
        >
          <option value="">Semua Label</option>
          {LABELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="filter-select"
          value={filters.dueDate}
          onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
        />

        {hasActiveFilter && (
          <button className="icon-btn" onClick={clear} title="Clear filter">
            <IonIcon icon={closeCircle} />
          </button>
        )}

        <IonSearchbar
          value={filters.search}
          onIonInput={(e) => setFilters({ ...filters, search: e.detail.value })}
          placeholder="Search Tasks"
          className="task-searchbar"
          debounce={150}
        />
      </div>
    </div>
  );
}
