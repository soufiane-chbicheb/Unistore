import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { ChevronLeft, Maximize2, PanelRight, Sliders, Trash2 } from "lucide-react";

interface CollectionEditorInspectorProps {
  open: boolean;
  onToggle: () => void;
  activeSection: CollectionPayload;
  globalCardConfig: CardConfig;
  onUpdateSection: (updates: Partial<CollectionPayload>) => void;
  onUpdateLayout: (updates: Partial<CollectionPayload['layout_config']>) => void;
  onUpdateGlobalCard: (updates: Partial<CardConfig>) => void;
}

const CATEGORIES = ["Menswear", "Electronics", "Home & Living", "Beauty", "Accessories"];
const BRANDS     = ["Nike", "Apple", "Samsung", "Zara", "Adidas"];


export default function CollectionEditorInspector({
  open,
  onToggle,
  activeSection,
  globalCardConfig,
  onUpdateSection,
  onUpdateLayout,
  onUpdateGlobalCard,
}: CollectionEditorInspectorProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();

  return (
    <aside
      className="border-l flex-shrink-0 overflow-y-auto scrollbar-hide transition-all duration-300"
      style={{
        width: open ? '320px' : '40px',
        backgroundColor: theme.bgSecondary,
        borderColor: theme.border,
        transition: 'width 0.3s ease',
      }}
    >
      {/* Toggle row */}
      <div
        className="sticky top-0 z-10 p-3 border-b flex items-center"
        style={{ 
          height: 56,
          backgroundColor: theme.bgSecondary, 
          borderColor: theme.border 
        }}
      >
        <button
          onClick={onToggle}
          style={{ color: theme.textSecondary }}
          className={`p-1 hover:bg-black/5 rounded transition-all ${!open ? 'mx-auto' : 'mr-3'}`}
        >
          {open ? <PanelRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        {open && (
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: theme.textSecondary,
          }}>
            Inspector
          </span>
        )}
      </div>

      {/* Controls */}
      {open && (
        <div className="p-6 space-y-8">

          {/* Layout & Spacing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 mb-4">
              <Maximize2 size={12} /> Layout & Spacing
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold block mb-1">
                  Card Count ({activeSection.layout_config.displayLimit})
                </label>
                <input
                  type="range" min="1" max="5"
                  value={activeSection.layout_config.displayLimit}
                  onChange={(e) => onUpdateLayout({ displayLimit: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">
                  Gap Size ({activeSection.layout_config.gap}px)
                </label>
                <input
                  type="range" min="0" max="40"
                  value={activeSection.layout_config.gap}
                  onChange={(e) => onUpdateLayout({ gap: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">
                  Global Border Radius ({globalCardConfig.borderRadius}px)
                </label>
                <input
                  type="range" min="0" max="40"
                  value={globalCardConfig.borderRadius}
                  onChange={(e) => onUpdateGlobalCard({ borderRadius: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />
              </div>
            </div>
          </section>

          <hr className="opacity-10" />

          {/* Selection Rules */}
          <section className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
                <Sliders size={12} /> Selection Rules
              </div>
              <button
                className="text-[10px] font-bold"
                style={{ color: theme.primary }}
                onClick={() => {
                  const newRule = { id: Date.now().toString(), field: 'category_id', operator: '=', value: '' };
                  onUpdateSection({ rules: [...activeSection.rules, newRule] });
                }}
              >
                + Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {activeSection.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 border rounded-xl relative group shadow-sm"
                  style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                >
                  <select
                    className="w-full text-[10px] font-black mb-2 border-b bg-transparent outline-none pb-1"
                    style={{ borderColor: theme.border, color: theme.text }}
                    value={rule.field}
                    onChange={(e) => {
                      const updated = activeSection.rules.map((r) =>
                        r.id === rule.id ? { ...r, field: e.target.value, value: '' } : r
                      );
                      onUpdateSection({ rules: updated });
                    }}
                  >
                    <option value="discount">Discount Percentage</option>
                    <option value="price">Price Range</option>
                    <option value="category_id">Filter by Category</option>
                    <option value="brand_id">Filter by Brand</option>
                  </select>

                  {rule.field === 'category_id' || rule.field === 'brand_id' ? (
                    <select
                      className="w-full p-2 text-[10px] border rounded bg-transparent"
                      style={{ borderColor: theme.border, color: theme.text }}
                      value={rule.value}
                      onChange={(e) => {
                        const updated = activeSection.rules.map((r) =>
                          r.id === rule.id ? { ...r, value: e.target.value } : r
                        );
                        onUpdateSection({ rules: updated });
                      }}
                    >
                      <option value="">
                        Select {rule.field === 'category_id' ? 'Category' : 'Brand'}...
                      </option>
                      {(rule.field === 'category_id' ? CATEGORIES : BRANDS).map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        className="p-1 text-[10px] border rounded bg-transparent"
                        style={{ borderColor: theme.border, color: theme.text }}
                        value={rule.operator}
                        onChange={(e) => {
                          const updated = activeSection.rules.map((r) =>
                            r.id === rule.id ? { ...r, operator: e.target.value } : r
                          );
                          onUpdateSection({ rules: updated });
                        }}
                      >
                        <option value=">=">{'>='}</option>
                        <option value="<=">{'<='}</option>
                        <option value="=">{'='}</option>
                      </select>
                      <input
                        className="flex-1 p-1 text-[10px] border rounded outline-none bg-transparent"
                        style={{ borderColor: theme.border, color: theme.text }}
                        placeholder="Value"
                        value={rule.value}
                        onChange={(e) => {
                          const updated = activeSection.rules.map((r) =>
                            r.id === rule.id ? { ...r, value: e.target.value } : r
                          );
                          onUpdateSection({ rules: updated });
                        }}
                      />
                    </div>
                  )}

                  <button
                    onClick={() =>
                      onUpdateSection({ rules: activeSection.rules.filter((r) => r.id !== rule.id) })
                    }
                    className="absolute -top-2 -right-2 p-1.5 border rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <hr className="opacity-10" />

          {/* Toggles */}
          <section className="space-y-3">
            {[
              { label: 'Show Price',        key: 'showPrice', target: 'card'    },
              { label: 'Show Promo Badges', key: 'showBadge', target: 'card'    },
              { label: 'Visible to Public', key: 'is_active', target: 'section' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 border rounded-xl"
                style={{ borderColor: theme.border }}
              >
                <span className="text-[10px] font-bold uppercase opacity-60">{item.label}</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  style={{ accentColor: theme.primary }}
                  checked={
                    item.target === 'card'
                      ? (globalCardConfig as any)[item.key]
                      : (activeSection as any)[item.key]
                  }
                  onChange={(e) =>
                    item.target === 'card'
                      ? onUpdateGlobalCard({ [item.key]: e.target.checked })
                      : onUpdateSection({ [item.key]: e.target.checked } as any)
                  }
                />
              </div>
            ))}
          </section>
        </div>
      )}
    </aside>
  );
}

