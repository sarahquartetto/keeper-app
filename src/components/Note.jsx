import React, { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Note(props) {
  const { id, title, content, images = [], labels = [], availableLabels = [], getLabelColor, getCustomLabelColor, onDelete, onUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ title: title || "", content: content || "", images: images || [], labels: labels || [] });
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Combine refs for both drag and drop and our internal logic
  const combinedRef = (node) => {
    setNodeRef(node);
    containerRef.current = node;
  };

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(id);
  }

  function handleContainerClick(e) {
    // Ignore clicks on buttons inside the note
    if (e.target.closest('button')) return;
    // If already editing, don't reset or steal focus
    if (isEditing) return;
    setDraft({ title: title || "", content: content || "", images: images || [], labels: labels || [] });
    setIsEditing(true);
    // Focus title on next tick
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 0);
  }

  async function commitSaveIfChanged() {
    const changed = (draft.title !== (title || "")) || (draft.content !== (content || "")) || JSON.stringify(draft.images) !== JSON.stringify(images || []) || JSON.stringify(draft.labels) !== JSON.stringify(labels || []);
    if (changed) {
      await onUpdate(id, { title: draft.title, content: draft.content, images: draft.images, labels: draft.labels });
    }
    setIsEditing(false);
  }

  function handleContainerBlur(e) {
    const next = e.relatedTarget;
    const container = containerRef.current;
    if (container && next && container.contains(next)) {
      return; // focus moved within the note; don't save yet
    }
    // Focus left the note entirely → save
    commitSaveIfChanged();
  }

  return (
    <div
      className="note"
      ref={combinedRef}
      style={style}
      data-dragging={isDragging}
      data-editing={isEditing}
      {...attributes}
      onClick={handleContainerClick}
      onBlur={isEditing ? handleContainerBlur : undefined}
      tabIndex={0}
    >
      {isEditing ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <input
              ref={titleRef}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Title"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1.1em',
                fontFamily: 'inherit',
                background: 'transparent',
                margin: 0,
                color: 'var(--text)'
              }}
            />
            <div 
              {...listeners}
              style={{ 
                cursor: 'grab', 
                padding: '4px 8px', 
                marginLeft: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(107,112,92,0.1)',
                fontSize: '12px',
                color: 'var(--muted-text)',
                userSelect: 'none'
              }}
            >
              ⋮⋮
            </div>
          </div>
          <textarea
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            placeholder="Take a note..."
            rows={4}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1.05em',
              fontFamily: 'inherit',
              background: 'transparent',
              resize: 'vertical',
              color: 'var(--text)'
            }}
            onClick={(e) => e.stopPropagation()}
          />

          
          {/* Available labels selection in edit mode */}
          <div style={{ marginTop: 8 }}>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text)', 
              fontWeight: 500,
              marginBottom: '6px'
            }}>
              labels:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '6px',
              maxHeight: '80px',
              overflowY: 'auto'
            }}>
              {availableLabels.map((label) => (
                <label
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: 'var(--text)',
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={draft.labels.includes(label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDraft(prev => ({
                          ...prev,
                          labels: [...prev.labels, label]
                        }));
                      } else {
                        setDraft(prev => ({
                          ...prev,
                          labels: prev.labels.filter(l => l !== label)
                        }));
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      margin: 0,
                      cursor: 'pointer'
                    }}
                  />
                                      <span style={{
                      background: draft.labels.includes(label) ? getLabelColor(label) : 'transparent',
                      color: draft.labels.includes(label) ? 'white' : 'var(--text)',
                      border: `1px solid ${draft.labels.includes(label) ? getLabelColor(label) : 'var(--border)'}`,
                      borderRadius: '8px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      transition: 'all 0.2s ease'
                    }}>
                      {label}
                    </span>
                </label>
              ))}
            </div>
          </div>
          
          {draft.images?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {draft.images.map((src, idx) => (
                <img key={idx} src={src} alt="note" style={{ width: '100%', height: 'auto', borderRadius: 8, border: '1px solid var(--border)' }} />
              ))}
            </div>
          )}
          <button onClick={handleDelete} aria-label="Delete">
            <DeleteIcon />
          </button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <h1 style={{ margin: 0, flex: 1 }}>{title}</h1>
            <div 
              {...listeners}
              style={{ 
                cursor: 'grab', 
                padding: '4px 8px', 
                marginLeft: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(107,112,92,0.1)',
                fontSize: '12px',
                color: 'var(--muted-text)',
                userSelect: 'none'
              }}
            >
              ⋮⋮
            </div>
          </div>
          <p>{content}</p>
          
          {/* Labels in view mode */}
          {labels?.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {labels.map((label, index) => (
                <span
                  key={index}
                  style={{
                    background: getLabelColor(label),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
          
          {images?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              {images.map((src, idx) => (
                <img key={idx} src={src} alt="note" style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border)' }} />
              ))}
            </div>
          )}
          <button onClick={handleDelete} aria-label="Delete">
            <DeleteIcon />
          </button>
        </>
      )}
    </div>
  );
}

export default Note;
