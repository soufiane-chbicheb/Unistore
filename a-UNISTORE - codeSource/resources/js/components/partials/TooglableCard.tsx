import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import {
    LayoutStyle,
    ThemeCardsDataType
} from "@/types/StoreConfigTypes";
import { ThemeStyle } from "@/types/ThemeTypes";

export type TogglableOption = LayoutStyle | ThemeStyle | any;

interface TogglableCardProps<T extends TogglableOption > {
    handleOptionToggle: (style: T) => void;
    isPreview: boolean;
    isCurrent: boolean;
    changeToggledStyle: (style: T) => void;
    option: any;
    children?: React.ReactNode;
}
const TogglableCard = <T extends TogglableOption>({
    changeToggledStyle,
    option,
    isPreview,
    isCurrent,
    handleOptionToggle,
    children
}:TogglableCardProps<T>) => {
    const {
        state: { currentTheme },
    } = useStoreConfigCtx();


    return (
        <div
            onClick={() => changeToggledStyle(option.style)}
            className={`relative rounded-xl overflow-hidden border-4 transition-all flex flex-col cursor-pointer
                   
                  `}
            style={{
                borderColor: isPreview
                    ? currentTheme.accentHover
                    : currentTheme.border,
            }}
        >
            {/* card head */}
            <div
                className="flex items-center justify-between p-3 border-2 "
                style={{
                    background: currentTheme.card,
                    color: currentTheme.text,
                    borderColor: currentTheme.border,
                }}
            >
                <h4 className="font-semibold"
                 style={{color : currentTheme.text}}
                >{option.label}</h4>

                <button
                    onClick={() => handleOptionToggle(option.style)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isCurrent
                            ? "bg-blue-500"
                            : "bg-slate-300 hover:bg-slate-400"
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isCurrent ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                </button>
            </div>

            {children ? (
                <div className="p-2 transition-transform duration-300 transform group-hover:scale-105">
                    {children}
                </div>
            ) : (
                <img
                    src={option.image}
                    alt={option.label}
                    className="w-full h-32 object-cover cursor-pointer"
                />
            )}

            {isCurrent && (
                <div className="absolute inset-0 bg-black/20 flex items-start justify-start p-2 rounded-b-xl">
                    <div
                        className="flex items-center gap-2  rounded-full px-2 py-1"
                        style={{
                            background: currentTheme.badge,
                            color: currentTheme.text,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
                        <span className="text-xs font-medium">Active</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TogglableCard;
