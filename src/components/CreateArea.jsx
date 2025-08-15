import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea(props) {
  const { onAdd, availableLabels = [], getLabelColor, getCustomLabelColor } = props;
  const [isExpanded, setExpanded] = useState(false);
  const formRef = useRef(null);

  const [note, setNote] = useState({
    title: "",
    content: "",
    images: [],
    labels: []
  });

  // Handle clicks outside the form to collapse it
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote(event) {
    console.log('Submitting note:', note); // Debug log
    onAdd(note);
    setNote({
      title: "",
      content: "",
      images: [],
      labels: []
    });
    setExpanded(false); // Collapse back to small state after submitting
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note" ref={formRef}>
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = reader.result;
                  setNote((prev) => ({ ...prev, images: [...prev.images, dataUrl] }));
                };
                reader.readAsDataURL(file);
                // reset the input so the same file can be selected again later
                e.target.value = '';
              }}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              style={{
                background: 'var(--accent)',
                color: 'var(--surface)',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 1px 4px var(--shadow-subtle)'
              }}
            >
              📎 Attach Image
            </label>
          </div>
        )}
        
        {/* Image Preview Section */}
        {isExpanded && note.images.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: 8,
              marginBottom: 8
            }}>
              {note.images.map((imageSrc, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img 
                    src={imageSrc} 
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      maxHeight: '120px',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNote(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }));
                    }}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: 'var(--accent)',
                      color: 'var(--surface)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px var(--shadow)'
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Labels Section */}
        {isExpanded && (
          <div style={{ marginTop: 12 }}>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--text)', 
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Labels:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '6px',
              maxHeight: '80px',
              overflowY: 'auto'
            }}>
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
                      checked={note.labels.includes(label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNote(prev => ({
                            ...prev,
                            labels: [...prev.labels, label]
                          }));
                        } else {
                          setNote(prev => ({
                            ...prev,
                            labels: prev.labels.filter(l => l !== label)
                          }));
                        }
                      }}
                      style={{
                        margin: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      background: note.labels.includes(label) ? getLabelColor(label) : 'transparent',
                      color: note.labels.includes(label) ? 'white' : 'var(--text)',
                      border: `1px solid ${note.labels.includes(label) ? getLabelColor(label) : 'var(--border)'}`,
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

            {/* Selected labels display */}
            {note.labels.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {note.labels.map((label, index) => (
                  <span
                    key={index}
                    style={{
                      background: getLabelColor(label),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => {
                        setNote(prev => ({
                          ...prev,
                          labels: prev.labels.filter((_, i) => i !== index)
                        }));
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0,
                        marginLeft: '4px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
