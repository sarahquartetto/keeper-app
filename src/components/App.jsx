import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Auth from "./Auth";
import { Button } from "@mui/material";
import { API_BASE_URL } from "../config.js";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SearchBar from "./SearchBar";
import LabelFilter from "./LabelFilter";

function App() {
  const [notes, setNotes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [availableLabels, setAvailableLabels] = useState([]);

  // Debug logging
  console.log('App component loaded');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('API_BASE_URL:', API_BASE_URL);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      fetchNotes(savedToken);
    }
  }, []);

  // Filter notes based on search query and selected labels
  const filteredNotes = (notes || []).filter(note => {
    const matchesSearch = !searchQuery || 
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLabels = selectedLabels.length === 0 || 
      (note.labels && Array.isArray(note.labels) && selectedLabels.some(label => note.labels.includes(label)));
    
    return matchesSearch && matchesLabels;
  });

  // Extract available labels from notes
  useEffect(() => {
    if (notes && Array.isArray(notes)) {
      const labels = new Set();
      notes.forEach(note => {
        if (note.labels && Array.isArray(note.labels)) {
          note.labels.forEach(label => labels.add(label));
        }
      });
      setAvailableLabels(Array.from(labels));
    }
  }, [notes]);

  const fetchNotes = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleLogin = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    fetchNotes(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setNotes([]);
  };

  async function addNote(newNote) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          images: newNote.images || []
        })
      });

      if (response.ok) {
        const savedNote = await response.json();
        setNotes(prevNotes => [savedNote, ...prevNotes]);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }

  async function deleteNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async function updateNote(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updates.title,
          content: updates.content,
          images: updates.images || []
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setNotes(prevNotes => prevNotes.map(note => note.id === id ? updated : note));
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header onLogout={handleLogout} user={user} />
      <CreateArea onAdd={addNote} />
      <SearchBar onSearch={setSearchQuery} />
      <LabelFilter 
        selectedLabels={selectedLabels}
        onLabelToggle={(label) => {
          setSelectedLabels(prev => 
            prev.includes(label) 
              ? prev.filter(l => l !== label)
              : [...prev, label]
          );
        }}
        availableLabels={availableLabels}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={notes.map(note => note.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="notes-container">
            {filteredNotes.map((noteItem) => {
              return (
                <Note
                  key={noteItem.id}
                  id={noteItem.id}
                  title={noteItem.title}
                  content={noteItem.content}
                  images={noteItem.images || []}
                  onDelete={deleteNote}
                  onUpdate={updateNote}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
      <Footer />
    </div>
  );
}

export default App;
