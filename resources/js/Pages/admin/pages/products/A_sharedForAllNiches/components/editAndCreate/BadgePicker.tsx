import { Button } from "@/components/ui/Button";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { Flame, Sparkles, Tag, Zap, Rocket, Ban } from "lucide-react";

interface Badge {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Ban,
  Sparkles,
  Flame,
  Tag,
  Zap,
  Rocket,
};

export default function BadgePicker({ currentTheme }: { currentTheme: any }) {
  const { watch, setValue, badges = [] } = useProductDataCtx();

  // state stores badge ID only
  const value: number | null = watch("badge") ?? null;

  const BADGE_OPTIONS = badges.map((b: Badge) => {
    return {
      ...b,
      icon: ICON_MAP[b.icon] ?? Ban,
    };
  });

  const selected = BADGE_OPTIONS.find((b) => b.id === value) ?? null;

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: currentTheme.text }}
          >
            Product Badge
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: currentTheme.textMuted }}
          >
            Label shown on the product card image
          </p>
        </div>

        {/* Live preview (now bigger) */}
        {selected && (
          <span
            className="flex items-center gap-2 px-3 py-1.5 rounded-full font-bold transition-all"
            style={{
              backgroundColor: selected.color + "22",
              color: selected.color,
              fontSize: "0.875rem", // bigger text
              padding: "0.375rem 0.75rem",
              border: `1px solid ${selected.color}`,
            }}
          >
            <selected.icon size={16} /> {/* bigger icon */}
            {selected.text}
          </span>
        )}
      </div>

      {/* Badge options */}
      <div className="flex flex-wrap gap-2 mt-1">
        {BADGE_OPTIONS.map((badge) => {
          const isSelected = value === badge.id;

          return (
            <Button
              key={badge.id}
              type="button"
              onClick={() =>
                setValue("badge", badge.id, { shouldValidate: true })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
              style={{
                backgroundColor: isSelected
                  ? badge.color + "18"
                  : "transparent",
                color: isSelected ? badge.color : currentTheme.textMuted,
                border: `1px solid ${
                  isSelected ? badge.color : currentTheme.border
                }`,
              }}
            >
              <badge.icon size={12} />
              {badge.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
