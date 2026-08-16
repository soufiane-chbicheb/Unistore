import { useState, useRef, useEffect } from 'react';
import { Plus, Tag, TagIcon, Trash2, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from '@/contextHooks/useTheme';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Input } from './ui/Input';
import EmptyListSection from '@/admin/components/partials/EmptyListSection';
import { route } from 'ziggy-js';
import axios from 'axios';

interface TagInputProps {
  tags: string[];
}

const TagSection: React.FC<TagInputProps> = ({ tags }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { theme: currentTheme } = useTheme();
  const { setValue } = useProductDataCtx();

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!inputValue.trim()) return;
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const { status, data } = await axios.get(route('tags.suggest', { q: inputValue }));
        if (status === 200) {
          setSuggestions(data.map((t: any) => t.name));
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setValue('tags', [...tags, trimmed] , { shouldValidate: true });
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((t) => t !== tagToRemove) , { shouldValidate: true });
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputValue.trim()) addTag(inputValue);
    else inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) addTag(filteredSuggestions[0]);
      else if (inputValue.trim()) addTag(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <style>{`
        .search-box { display:flex; max-width:100%; align-items:center; justify-content:space-between; gap:8px; border-radius:0.375rem; position:relative; background:${currentTheme.bg}; border:2px solid ${currentTheme.border}; }
        .search-button { position:absolute; right:6px; width:30px; height:30px; border-radius:0.5rem; background:${currentTheme.accent}20; border:0; display:inline-flex; align-items:center; justify-content:center; transition: background 200ms ease; cursor:pointer; }
        .search-button:hover { background:${currentTheme.accent}40; }
        .search-button:active { background:${currentTheme.accent}60; transform: scale(0.95); }
        .search-input { border:none; background:none; outline:none; color:${currentTheme.text}; font-size:15px; padding:16px 60px 16px 20px; width:100%; font-weight:500; border-radius:0.375rem; }
        .search-input::placeholder { color:${currentTheme.text}; opacity:0.5; }
        .themed-scroll { scrollbar-width: thin; scrollbar-color: ${currentTheme.accent} transparent; }
        .themed-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .themed-scroll::-webkit-scrollbar-track { background: transparent; }
        .themed-scroll::-webkit-scrollbar-thumb { background-color: ${currentTheme.accent}; border-radius: 999px; }
      `}</style>

      {/* Input */}
      <div className="relative">
        <div className="search-box">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tag..."
            className="search-input"
          />
          <Button type="button" onClick={handleAddClick} className="search-button">
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: currentTheme.accent }} />
              : <Plus className="w-4 h-4" style={{ color: currentTheme.accent }} />
            }
          </Button>
        </div>

        {/* Dropdown */}
        {(showSuggestions || loading) && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 rounded-xl shadow-lg overflow-hidden"
            style={{
              backgroundColor: currentTheme.bg,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-3" style={{ color: currentTheme.textSecondary }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">Searching...</span>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto themed-scroll flex flex-col gap-0.5 p-1">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addTag(s)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left"
                    style={{ color: currentTheme.text, backgroundColor: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${currentTheme.accent}15`)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <TagIcon className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.accent }} />
                    <span className="capitalize">{s}</span>
                    <Plus className="w-3 h-3 ml-auto opacity-40" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Tags */}
      <div
        className="rounded-md  overflow-y-auto themed-scroll"
        style={{
          backgroundColor: currentTheme.bgSecondary,
          borderWidth: '2px',
          borderColor: currentTheme.border,
          maxHeight: '240px',
          minHeight: '80px',
        }}
      >
        {tags.length === 0 ? (
          <EmptyListSection
            Icon={Tag}
            description='Add tags to organize your product'
          />
        ) : (
          <div className="flex flex-col gap-1">
            {tags.map((tag) => (
              <div
                key={tag}
                className="w-full flex items-center justify-between px-3 py-2 text-sm"
                style={{
                  backgroundColor: `${currentTheme.accent}12`,
                  border: `1px solid ${currentTheme.accent}40`,
                  borderRadius: currentTheme.borderRadius,
                  color: currentTheme.text,
                }}
              >
                <span className="capitalize">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: currentTheme.error ?? '#ef4444' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSection;
