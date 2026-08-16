import { useTheme } from "@/contextHooks/useTheme";



interface EmptyListSectionProps {
    Icon : React.ElementType , 
    label : string  ; 
    description : string 
}


// ─── Empty State ──────────────────────────────────────────────────────────────
 function EmptyListSection({ description , Icon}: {Icon : React.ElementType, description: string }) {
  const { theme: currentTheme } = useTheme()
  return (
    <div className="flex flex-col items-center justify-center py-8 rounded-lg"
      style={{ border: `2px dashed ${currentTheme.border}`, backgroundColor: currentTheme.bg }}>
      <Icon size={28} className="mb-2 opacity-25" style={{ color: currentTheme.textMuted }} />
      <p className="text-xs" style={{ color: currentTheme.textMuted }}>{description}</p>
    </div>
  );
}




export default EmptyListSection ;
