"use client"

import React, { useRef, useEffect } from 'react';

const RichEditor = ({ content, setContent }) => {
  const editorRef = useRef(null);

  // Safely inject initial content when the component mounts
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
    }
  }, []); // Empty dependency array prevents cursor jumping during typing

  // 1. The function to execute formatting commands
  const formatText = (command, value = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleInput = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  // Reusable button component to keep the toolbar code clean
  const ToolbarButton = ({ onClick, label, className = "" }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevents focus from leaving the editor
        onClick();
      }}
      className={`px-3 py-1.5 text-sm font-medium bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 hover:text-white transition-colors text-gray-300 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full mx-auto border border-gray-700 rounded-lg shadow-lg dark:bg-gray-900 overflow-hidden flex flex-col">
      
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-700 dark:bg-gray-800/50">
        <ToolbarButton onClick={() => formatText('bold')} label="B" className="font-bold" />
        <ToolbarButton onClick={() => formatText('italic')} label="I" className="italic font-serif" />
        <ToolbarButton onClick={() => formatText('underline')} label="U" className="underline" />
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1"></div> 
        
        <ToolbarButton onClick={() => formatText('formatBlock', 'H1')} label="H1" className="font-bold" />
        <ToolbarButton onClick={() => formatText('formatBlock', 'H2')} label="H2" className="font-bold" />
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1"></div> 
        
        <ToolbarButton onClick={() => formatText('insertUnorderedList')} label="Bullet List" />
        <ToolbarButton onClick={() => formatText('insertOrderedList')} label="Number List" />
      </div>

      {/* EDITING AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        // prose-invert ensures the Tailwind typography looks good in dark mode
        className="p-5 min-h-[250px] focus:outline-none prose prose-invert max-w-none dark:text-gray-100"
      />

      {/* OUTPUT DISPLAY (For debugging) */}
      <div className="p-4 text-xs font-mono dark:text-green-400 dark:bg-black border-t border-gray-800 break-all">
        <strong className="text-gray-500 block mb-2 uppercase tracking-wider">Generated HTML:</strong>
        {content || '<empty>'}
      </div>
    </div>
  );
}

export default RichEditor;