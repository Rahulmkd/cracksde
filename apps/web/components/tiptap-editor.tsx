"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TiptapToolbar } from "./tiptap-toolbar";
import { useEffect } from "react";

export interface TiptapEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  className?: string;
}

export default function TiptapEditor({
  value = "",
  onChange,
  editable = true,
  className = "",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-brand-600 dark:text-brand-400 underline cursor-pointer",
        },
      }),
    ],
    content: value,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (!editor) return;
    const isSame = editor.getHTML() === value;
    if (!isSame && !editor.isFocused) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}
    >
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
