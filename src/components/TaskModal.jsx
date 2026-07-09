import { useEffect, useRef, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
} from '@ionic/react';
import {
  close,
  imageOutline,
  trashOutline,
  addOutline,
  checkmarkCircle,
  documentAttachOutline,
} from 'ionicons/icons';
import { MEMBERS, LABELS, PRIORITIES } from '../data/seed';
import AvatarGroup from './AvatarGroup';

const emptyTask = {
  title: '',
  description: '',
  assignees: [],
  dueDate: '',
  label: '',
  priority: '',
  cover: null,
  checklist: [],
  attachments: [],
};

export default function TaskModal({
  isOpen,
  onClose,
  task, // null when creating
  columns,
  columnOrder,
  currentColumnId,
  onSave,
  onDelete,
}) {
  const [draft, setDraft] = useState(emptyTask);
  const [targetColumnId, setTargetColumnId] = useState(currentColumnId);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(task ? { ...task } : { ...emptyTask });
      setTargetColumnId(currentColumnId);
      setNewChecklistText('');
      setShowAssigneePicker(false);
    }
  }, [isOpen, task, currentColumnId]);

  if (!isOpen) return null;

  const isEditing = Boolean(task);
  const doneCount = draft.checklist?.filter((c) => c.done).length || 0;
  const totalCount = draft.checklist?.length || 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const toggleAssignee = (id) => {
    const has = draft.assignees.includes(id);
    update({
      assignees: has ? draft.assignees.filter((a) => a !== id) : [...draft.assignees, id],
    });
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    update({
      checklist: [
        ...draft.checklist,
        { id: `c-${Date.now()}`, text: newChecklistText.trim(), done: false },
      ],
    });
    setNewChecklistText('');
  };

  const toggleChecklistItem = (id) => {
    update({
      checklist: draft.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    });
  };

  const removeChecklistItem = (id) => {
    update({ checklist: draft.checklist.filter((c) => c.id !== id) });
  };

  const handleAttachmentPick = (e) => {
    const files = Array.from(e.target.files || []);
    const newAtt = files.map((f) => ({ id: `a-${Date.now()}-${f.name}`, name: f.name }));
    update({ attachments: [...draft.attachments, ...newAtt] });
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    update({ attachments: draft.attachments.filter((a) => a.id !== id) });
  };

  const handleCoverPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ cover: reader.result });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    onSave(draft, targetColumnId);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="task-modal">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="modal-toolbar-inner">
            {isEditing && (
              <button className="mark-complete-btn" onClick={() => update({ completed: !draft.completed })}>
                <IonIcon icon={checkmarkCircle} />
                {draft.completed ? 'Completed' : 'Mark Complete'}
              </button>
            )}
            <IonButtons slot="end">
              <IonButton onClick={onClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="task-modal-content">
        <div className="modal-grid">
          {/* LEFT COLUMN */}
          <div className="modal-col-left">
            <div
              className="cover-drop"
              style={draft.cover ? { backgroundImage: `url(${draft.cover})` } : undefined}
              onClick={() => coverInputRef.current?.click()}
            >
              {!draft.cover && (
                <div className="cover-placeholder">
                  <IonIcon icon={imageOutline} />
                  <span>Add Cover Image</span>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverPick}
              />
            </div>

            <input
              className="title-input"
              placeholder="Judul task"
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
            />

            <div className="field-grid">
              <div className="field">
                <label>Assignee</label>
                <div className="assignee-field" onClick={() => setShowAssigneePicker((v) => !v)}>
                  <AvatarGroup memberIds={draft.assignees} size={26} max={4} />
                  <button className="avatar add-avatar" type="button">
                    <IonIcon icon={addOutline} />
                  </button>
                </div>
                {showAssigneePicker && (
                  <div className="assignee-picker">
                    {MEMBERS.map((m) => (
                      <label key={m.id} className="assignee-picker-row">
                        <input
                          type="checkbox"
                          checked={draft.assignees.includes(m.id)}
                          onChange={() => toggleAssignee(m.id)}
                        />
                        <span className="avatar" style={{ background: m.color, width: 22, height: 22, fontSize: 10 }}>
                          {m.initials}
                        </span>
                        {m.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="field">
                <label>Due Date</label>
                <input
                  type="date"
                  className="field-input"
                  value={draft.dueDate || ''}
                  onChange={(e) => update({ dueDate: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Column</label>
                <select
                  className="field-input"
                  value={targetColumnId}
                  onChange={(e) => setTargetColumnId(e.target.value)}
                >
                  {columnOrder.map((id) => (
                    <option key={id} value={id}>
                      {columns[id].title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Label</label>
                <select
                  className="field-input"
                  value={draft.label || ''}
                  onChange={(e) => update({ label: e.target.value })}
                >
                  <option value="">-- pilih label --</option>
                  {LABELS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Priority</label>
                <select
                  className="field-input"
                  value={draft.priority || ''}
                  onChange={(e) => update({ priority: e.target.value })}
                >
                  <option value="">-- opsional --</option>
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                className="field-input textarea"
                placeholder="Tulis deskripsi task..."
                value={draft.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="modal-col-right">
            <div className="field">
              <label>Attachments</label>
              <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
                <IonIcon icon={documentAttachOutline} />
                Drag &amp; Drop files here, or browse from device
                <input ref={fileInputRef} type="file" multiple hidden onChange={handleAttachmentPick} />
              </div>
              {draft.attachments?.length > 0 && (
                <ul className="attachment-list">
                  {draft.attachments.map((a) => (
                    <li key={a.id}>
                      <IonIcon icon={documentAttachOutline} />
                      <span>{a.name}</span>
                      <button className="icon-btn small" onClick={() => removeAttachment(a.id)}>
                        <IonIcon icon={trashOutline} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="field">
              <label>
                Check List{' '}
                {totalCount > 0 && (
                  <span className="checklist-count">
                    {doneCount}/{totalCount}
                  </span>
                )}
              </label>
              {totalCount > 0 && (
                <div className="task-progress-bar">
                  <div className="task-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}
              <ul className="checklist-list">
                {draft.checklist.map((c) => (
                  <li key={c.id}>
                    <label>
                      <input type="checkbox" checked={c.done} onChange={() => toggleChecklistItem(c.id)} />
                      <span className={c.done ? 'done' : ''}>{c.text}</span>
                    </label>
                    <button className="icon-btn small" onClick={() => removeChecklistItem(c.id)}>
                      <IonIcon icon={trashOutline} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="add-subtask-row">
                <input
                  className="field-input"
                  placeholder="Tambah subtask..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                />
                <button className="add-subtask-btn" onClick={addChecklistItem}>
                  <IonIcon icon={addOutline} /> Add subtask
                </button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar>
          <div className="modal-footer-inner">
            {isEditing ? (
              <button className="btn-danger" onClick={() => onDelete(task.id)}>
                <IonIcon icon={trashOutline} /> Delete
              </button>
            ) : (
              <span />
            )}
            <div className="footer-actions">
              <button className="btn-secondary" onClick={onClose}>
                Discard
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
}
