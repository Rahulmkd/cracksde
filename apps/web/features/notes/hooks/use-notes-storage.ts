"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { NoteItem } from "../types";

const STORAGE_KEY = "cracksde_notespace_notes";

export function useNotesStorage() {
  const [isMounted, setIsMounted] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");

  // Load user notes from localStorage on mount (never auto-seed demo notes)
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
          setSelectedNoteId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage", e);
    }
  }, []);

  // Sync user notes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes to localStorage", e);
    }
  }, [notes, isMounted]);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const createNote = useCallback(() => {
    const newNote: NoteItem = {
      id: `note_${Date.now()}`,
      title: "Untitled Note",
      subject: "General",
      content: "<p></p>",
      updatedAt: "Just now",
      tags: [],
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    toast.success("New note created");
  }, []);

  const updateActiveTitle = useCallback((title: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, title, updatedAt: "Just now" } : n
      )
    );
  }, [selectedNoteId]);

  const updateActiveSubject = useCallback((subject: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, subject, updatedAt: "Just now" } : n
      )
    );
  }, [selectedNoteId]);

  const updateActiveContent = useCallback((content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, content, updatedAt: "Just now" } : n
      )
    );
  }, [selectedNoteId]);

  const deleteNote = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (selectedNoteId === id) {
        setSelectedNoteId(remaining.length > 0 ? remaining[0].id : "");
      }
      return remaining;
    });
    toast.info("Note removed");
  }, [selectedNoteId]);

  const copyMarkdown = useCallback(() => {
    if (activeNote) {
      const plainText = activeNote.content.replace(/<[^>]+>/g, "");
      navigator.clipboard.writeText(`# ${activeNote.title}\n\n${plainText}`);
      toast.success("Copied note to clipboard");
    }
  }, [activeNote]);

  return {
    isMounted,
    notes,
    selectedNoteId,
    setSelectedNoteId,
    activeNote,
    createNote,
    updateActiveTitle,
    updateActiveSubject,
    updateActiveContent,
    deleteNote,
    copyMarkdown,
  };
}
