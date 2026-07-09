import { useMemo, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { IonIcon, IonToast } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useBoard } from '../context/BoardContext';
import Column from './Column';
import FilterBar from './FilterBar';
import TaskModal from './TaskModal';

export default function Board() {
  const { state, dispatch } = useBoard();
  const [filters, setFilters] = useState({ search: '', assignee: '', label: '', dueDate: '' });
  const [modalState, setModalState] = useState({ open: false, taskId: null, columnId: null });
  const [toast, setToast] = useState({ open: false, message: '' });
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const showToast = (message) => setToast({ open: true, message });

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    dispatch({
      type: 'MOVE_TASK',
      payload: {
        taskId: draggableId,
        source: { columnId: source.droppableId, index: source.index },
        destination: { columnId: destination.droppableId, index: destination.index },
      },
    });
  };

  const openCreateModal = (columnId) => setModalState({ open: true, taskId: null, columnId });
  const openEditModal = (taskId) => {
    // find which column the task currently lives in
    const columnId = state.columnOrder.find((cid) => state.columns[cid].taskIds.includes(taskId));
    setModalState({ open: true, taskId, columnId });
  };
  const closeModal = () => setModalState({ open: false, taskId: null, columnId: null });

  const handleSave = (draft, targetColumnId) => {
    if (modalState.taskId) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          taskId: modalState.taskId,
          updates: draft,
          columnId: targetColumnId,
          prevColumnId: modalState.columnId,
        },
      });
      showToast('Task berhasil diupdate');
    } else {
      dispatch({ type: 'ADD_TASK', payload: { columnId: targetColumnId, task: draft } });
      showToast('Task berhasil dibuat');
    }
    closeModal();
  };

  const handleDelete = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId, columnId: modalState.columnId } });
    showToast('Task berhasil dihapus');
    closeModal();
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) {
      setAddingColumn(false);
      return;
    }
    dispatch({ type: 'ADD_COLUMN', payload: { title: newColumnTitle.trim() } });
    setNewColumnTitle('');
    setAddingColumn(false);
  };

  const matchesFilters = (task) => {
    const { search, assignee, label, dueDate } = filters;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (assignee && !task.assignees.includes(assignee)) return false;
    if (label && task.label !== label) return false;
    if (dueDate && task.dueDate !== dueDate) return false;
    return true;
  };

  const filteredColumns = useMemo(() => {
    const result = {};
    for (const colId of state.columnOrder) {
      const col = state.columns[colId];
      const tasks = col.taskIds.map((id) => state.tasks[id]).filter((t) => t && matchesFilters(t));
      result[colId] = tasks;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, filters]);

  const activeTask = modalState.taskId ? state.tasks[modalState.taskId] : null;

  return (
    <div className="board-page">
      <FilterBar filters={filters} setFilters={setFilters} boardName={state.name} />
      <div className="brand-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 24" preserveAspectRatio="none">
          <path d="M0,18 C 240,4 480,4 720,14 C 960,24 1200,24 1440,10 L1440,24 L0,24 Z" fill="#2F9E6E" opacity="0.9" />
          <path d="M0,20 C 300,10 600,22 900,16 C 1150,11 1300,8 1440,16 L1440,24 L0,24 Z" fill="#E3B23C" opacity="0.85" />
          <path d="M0,22 C 360,16 780,24 1080,18 C 1260,15 1350,14 1440,20 L1440,24 L0,24 Z" fill="#13294B" opacity="0.9" />
        </svg>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-scroll">
          {state.columnOrder.map((colId) => (
            <Column
              key={colId}
              column={state.columns[colId]}
              tasks={filteredColumns[colId]}
              onOpenTask={openEditModal}
              onAddTask={openCreateModal}
            />
          ))}

          <div className="add-column-wrap">
            {addingColumn ? (
              <div className="add-column-form">
                <input
                  autoFocus
                  className="field-input"
                  placeholder="Nama column..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                  onBlur={handleAddColumn}
                />
              </div>
            ) : (
              <button className="add-column-btn" onClick={() => setAddingColumn(true)}>
                <IonIcon icon={addOutline} /> Add new List
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={modalState.open}
        onClose={closeModal}
        task={activeTask}
        columns={state.columns}
        columnOrder={state.columnOrder}
        currentColumnId={modalState.columnId || state.columnOrder[0]}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <IonToast
        isOpen={toast.open}
        message={toast.message}
        duration={1800}
        onDidDismiss={() => setToast({ open: false, message: '' })}
        position="bottom"
        color="dark"
      />
    </div>
  );
}
