import { Droppable } from '@hello-pangea/dnd';
import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import TaskCard from './TaskCard';

export default function Column({ column, tasks, onOpenTask, onAddTask }) {
  return (
    <div className="board-column">
      <div className="column-header">
        <div className="column-title">
          <span className={`column-dot dot-${column.id}`} />
          {column.title}
          <span className="column-count">{tasks.length}</span>
        </div>
        <button className="icon-btn" onClick={() => onAddTask(column.id)} title="Tambah task">
          <IonIcon icon={addOutline} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`column-body ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onOpen={onOpenTask} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="column-empty">Belum ada task</div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
