// Pages/Checkout/components/PageHeader.tsx
import { router } from "@inertiajs/react";
import { ThemePalette } from "@/types/ThemeTypes";

interface PageHeaderProps {
    title: string;
    backLink?: () => void;
    backLabel?: string;
    theme: ThemePalette;
}

export default function PageHeader({
    title,
    backLink,
    backLabel = "Back" ,
    theme,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: theme.text }} className="text-2xl font-bold">
                {title}
            </h2>
            {backLink && (
                <button
                    type="button"
                    onClick={() => backLink()}
                    style={{ color: theme.link }}
                    className="text-sm font-medium hover:underline flex items-center gap-1"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    {backLabel}
                </button>
            )}
        </div>
    );
}
