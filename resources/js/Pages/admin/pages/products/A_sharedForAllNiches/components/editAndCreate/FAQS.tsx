import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { Plus, Trash2, HelpCircle, GripVertical, Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { ProductBase } from '@/types/products/ProductTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type Faq = {
  question: string;
  answer: string;
};

// ─── Single FAQ Item ──────────────────────────────────────────────────────────
function FaqItem({
  faq,
  index,
  currentTheme,
  onChange,
  onRemove,
  isOpen,
  onToggle,
}: {
  faq: Faq;
  index: number;
  currentTheme: any;
  onChange: (index: number, field: 'question' | 'answer', value: string) => void;
  onRemove: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [focused, setFocused] = useState<'question' | 'answer' | null>(null);
  
  // ← local state to track typing without re-rendering parent
  const [localQuestion, setLocalQuestion] = useState(faq.question);
  const [localAnswer, setLocalAnswer] = useState(faq.answer);

  const isDone = localQuestion && localAnswer;

  return (
    <div
      className="rounded-xl mb-3 group transition-all duration-200 overflow-hidden"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1.5px solid ${isOpen ? currentTheme.primary : currentTheme.border}`,
        boxShadow: currentTheme.shadow,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer"
        onClick={onToggle}
        style={{ backgroundColor: currentTheme.bgSecondary }}
      >
        <GripVertical size={14} className="opacity-30 cursor-grab" style={{ color: currentTheme.textMuted }} />
        <span className="text-xs font-bold uppercase tracking-widest flex-1" style={{ color: currentTheme.textMuted }}>
          {localQuestion ? localQuestion : `FAQ #${index + 1}`}
        </span>
        {isDone && !isOpen && (
          <span style={{
            fontSize: 10,
            color: currentTheme.success,
            background: currentTheme.success + '15',
            border: `1px solid ${currentTheme.success}40`,
            padding: '2px 8px',
            borderRadius: 6,
            fontWeight: 600,
          }}>✓ Done</span>
        )}
        <ChevronDown size={14} style={{
          color: currentTheme.textMuted,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s'
        }} />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-lg"
          style={{ color: currentTheme.error }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-4">
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: currentTheme.textSecondary }}>
              Question
            </label>
            <Input
              type="text"
              value={localQuestion}
              placeholder="e.g. What material is this made of?"
              onFocus={() => setFocused('question')}
              onBlur={() => {
                setFocused(null);
                onChange(index, 'question', localQuestion); // ← only update useForm on blur
              }}
              onChange={(e) => setLocalQuestion(e.target.value)} // ← local state on change
              className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: currentTheme.bgSecondary,
                color: currentTheme.text,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: focused === 'question' ? currentTheme.primary : currentTheme.border,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: currentTheme.textSecondary }}>
              Answer
            </label>
            <textarea
              value={localAnswer}
              placeholder="Write a clear, helpful answer..."
              onFocus={() => setFocused('answer')}
              onBlur={() => {
                setFocused(null);
                onChange(index, 'answer', localAnswer); // ← only update useForm on blur
              }}
              onChange={(e) => setLocalAnswer(e.target.value)} // ← local state on change
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm font-medium resize-none transition-all duration-150"
              style={{
                backgroundColor: currentTheme.bgSecondary,
                color: currentTheme.text,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: focused === 'answer' ? currentTheme.primary : currentTheme.border,
                outline: 'none',
              }}
            />
          </div>

          <div className="flex justify-end mt-3">
            <Button
              type="button"
              onClick={() => {
                onChange(index, 'question', localQuestion); // ← save on done click
                onChange(index, 'answer', localAnswer);
                onToggle();
              }}
              disabled={!isDone}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: isDone ? currentTheme.primary : currentTheme.border,
                color: isDone ? currentTheme.textInverse : currentTheme.textMuted,
                cursor: isDone ? 'pointer' : 'not-allowed',
                border: 'none',
              }}
            >
              <Check size={12} />
              Save FAQ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyFaqs({ currentTheme }: { currentTheme: any }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 rounded-xl"
      style={{ border: `2px dashed ${currentTheme.border}`, backgroundColor: currentTheme.bg }}
    >
      <HelpCircle size={32} className="mb-3 opacity-30" style={{ color: currentTheme.textMuted }} />
      <p className="text-sm font-medium mb-1" style={{ color: currentTheme.textMuted }}>No FAQs yet</p>
      <p className="text-xs opacity-60" style={{ color: currentTheme.textMuted }}>
        Add questions customers commonly ask about this product
      </p>
    </div>
  );
}

// ─── Main FAQs Section ────────────────────────────────────────────────────────
function FaqsSection() {
  const { control, watch } = useProductDataCtx();
  const { state: { currentTheme } } = useAdminThemeCtx();

  const { fields, append, remove, update } = useFieldArray<ProductBase, 'faqs'>({
    control,
    name: 'faqs',
  });

  // track which faqs are open
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addFaq = () => {
    append({ question: '', answer: '' });
    // auto open the new one
    setOpenIndexes(prev => [...prev, fields.length]);
  };

  const removeFaq = (index: number) => {
    remove(index);
    setOpenIndexes(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const current = fields[index];
    update(index, { ...current, [field]: value });
  };

  return (
    <div className="p-5 ">
      {/* FAQ count badge */}
      {fields.length > 0 && (
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: currentTheme.accent + '20', color: currentTheme.accent }}
          >
            {fields.length} FAQ{fields.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>
            Shown as accordion on product page
          </span>
        </div>
      )}

      {/* FAQ list or empty state */}
      {fields.length === 0 ? (
        <EmptyFaqs currentTheme={currentTheme} />
      ) : (
        fields.map((faq, index) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            index={index}
            currentTheme={currentTheme}
            onChange={updateFaq}
            onRemove={removeFaq}
            isOpen={openIndexes.includes(index)}
            onToggle={() => toggleOpen(index)}
          />
        ))
      )}

      {/* Add FAQ button */}
      <Button
        type="button"
        onClick={addFaq}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          backgroundColor: 'transparent',
          color: currentTheme.primary,
          border: `1.5px solid ${currentTheme.badge}`,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = currentTheme.primary + '10'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
      >
        <Plus size={16} />
        Add FAQ
      </Button>
    </div>
  );
}

export default FaqsSection;

