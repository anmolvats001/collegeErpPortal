import React, { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, Lock, Loader2, X } from 'lucide-react';

export const MessageInput = ({
  onSendMessage,
  onUploadFile,
  disabled = false,
  disabledReason = 'This channel is archived.',
}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || isSubmitting || disabled || isUploading) return;

    try {
      setIsSubmitting(true);
      await onSendMessage({
        messageType: 'TEXT',
        message: text.trim(),
      });
      setText('');
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle native file input change (Documents, PDFs, etc.)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatusText(`Uploading ${file.name}...`);
      setUploadProgress(10);

      if (onUploadFile) {
        await onUploadFile(file, false, (progress) => {
          setUploadProgress(progress);
        });
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatusText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle native image input change
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatusText(`Uploading image ${file.name}...`);
      setUploadProgress(10);

      if (onUploadFile) {
        await onUploadFile(file, true, (progress) => {
          setUploadProgress(progress);
        });
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatusText('');
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  if (disabled) {
    return (
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <Lock size={14} className="text-slate-400" />
        <span>{disabledReason} Messages cannot be sent to this room.</span>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-slate-200 bg-white">
      {/* Cloudinary Upload Progress Banner */}
      {isUploading && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-blue-600 shrink-0" />
            <span className="font-semibold truncate max-w-xs">{uploadStatusText}</span>
            {uploadProgress > 0 && (
              <span className="text-blue-600 font-bold">({uploadProgress}%)</span>
            )}
          </div>
          <span className="text-[10px] text-blue-500 font-medium">Cloudinary Upload</span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition"
      >
        {/* Document Picker Trigger */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition disabled:opacity-50"
          title="Upload Coursework Document / PDF"
        >
          <Paperclip size={18} />
        </button>

        {/* Image Picker Trigger */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => imageInputRef.current?.click()}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition disabled:opacity-50"
          title="Upload Diagram / Photo"
        >
          <ImageIcon size={18} />
        </button>

        {/* Text Input */}
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          disabled={isUploading}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message class cohort... (Press Enter to send, Shift+Enter for newline)"
          className="flex-1 bg-transparent border-0 focus:ring-0 text-xs text-slate-800 placeholder:text-slate-400 resize-none max-h-32 py-1.5 px-1 focus:outline-none"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting || isUploading}
          className={`p-2 rounded-lg font-semibold transition ${
            text.trim() && !isSubmitting && !isUploading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title="Send Message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
