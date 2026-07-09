import { Draggable } from '@hello-pangea/dnd';
import { IonIcon } from '@ionic/react';
import { calendarOutline, checkboxOutline, attachOutline } from 'ionicons/icons';
import LabelBadge from './LabelBadge';
import AvatarGroup from './AvatarGroup';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function TaskCard({ task, index, onOpen }) {
  const doneCount = task.checklist?.filter((c) => c.done).length || 0;
  const totalCount = task.checklist?.length || 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpen(task.id)}
        >
          {task.cover && (
            <div className="task-cover" style={{ backgroundImage: `url(${task.cover})` }} />
          )}
          <div className="task-card-body">
            {task.label && <LabelBadge labelId={task.label} />}
            <p className="task-title">{task.title}</p>

            {totalCount > 0 && (
              <div className="task-progress">
                <div className="task-progress-bar">
                  <div className="task-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="task-meta-row">
              <div className="task-meta-left">
                {task.dueDate && (
                  <span className="meta-chip">
                    <IonIcon icon={calendarOutline} /> {formatDate(task.dueDate)}
                  </span>
                )}
                {totalCount > 0 && (
                  <span className="meta-chip">
                    <IonIcon icon={checkboxOutline} /> {doneCount}/{totalCount}
                  </span>
                )}
                {task.attachments?.length > 0 && (
                  <span className="meta-chip">
                    <IonIcon icon={attachOutline} /> {task.attachments.length}
                  </span>
                )}
              </div>
              <AvatarGroup memberIds={task.assignees} size={22} max={3} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
