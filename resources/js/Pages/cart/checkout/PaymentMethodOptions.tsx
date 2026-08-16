import { ThemePalette } from "@/types/ThemeTypes";

interface PaymentMethodOptionsProps {
    payment_method: string;
    onPaymentMethodChange: (method: any) => void;
    theme: ThemePalette;
}

const PaymentMethodOptions = ({
    payment_method,
    onPaymentMethodChange,
    theme,
}: PaymentMethodOptionsProps) => {
    return (
        <div
            style={{
                backgroundColor: theme.bgSecondary,
                borderRadius: theme.borderRadius,
            }}
            className="p-4"
        >
            <h3
                style={{ color: theme.text }}
                className="text-sm font-semibold mb-3"
            >
                Payment Method
            </h3>

            <div className="space-y-2">
                {/* Cash on Delivery Option */}
                <button
                    type="button"
                    onClick={() => onPaymentMethodChange("COD")}
                    style={{
                        backgroundColor: theme.card,
                        borderColor:
                            payment_method === "COD"
                                ? theme.primary
                                : theme.border,
                        borderRadius: theme.borderRadius,
                    }}
                    className="w-full p-3 border-2 transition-all duration-200 hover:shadow-sm group"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                            payment_method === "COD"
                                ? theme.primary
                                : theme.borderHover;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                            payment_method === "COD"
                                ? theme.primary
                                : theme.border;
                    }}
                >
                    <div className="flex items-center gap-3">
                        {/* Radio Button Indicator */}
                        <div
                            style={{
                                borderColor:
                                    payment_method === "COD"
                                        ? theme.primary
                                        : theme.border,
                            }}
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        >
                            {payment_method === "COD" && (
                                <div
                                    style={{
                                        backgroundColor: theme.primary,
                                    }}
                                    className="w-3 h-3 rounded-full"
                                />
                            )}
                        </div>

                        {/* Icon */}
                        <div
                            style={{
                                color:
                                    payment_method === "COD"
                                        ? theme.primary
                                        : theme.textMuted,
                            }}
                            className="flex-shrink-0"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>

                        {/* Label */}
                        <div className="flex-1 text-left">
                            <div
                                style={{
                                    color:
                                        payment_method === "COD"
                                            ? theme.text
                                            : theme.textSecondary,
                                }}
                                className="font-medium text-sm"
                            >
                                Cash on Delivery
                            </div>
                            <div
                                style={{ color: theme.textMuted }}
                                className="text-xs mt-0.5"
                            >
                                Pay when you receive your order
                            </div>
                        </div>

                        {/* Selected Badge */}
                        {payment_method === "COD" && (
                             <div
                                    style={{
                                        backgroundColor: theme.badge,
                                        color: theme.textInverse,
                                        borderRadius: '9999px',
                                    }}
                                    className="px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Selected</span>
                                </div>
                        )}
                    </div>
                </button>

                {/* Credit/Debit Card Option */}
                <button
                    type="button"
                    onClick={() => onPaymentMethodChange("CARD")}
                    style={{
                        backgroundColor: theme.card,
                        borderColor:
                            payment_method === "CARD"
                                ? theme.primary
                                : theme.border,
                        borderRadius: theme.borderRadius,
                    }}
                    className="w-full p-3 border-2 transition-all duration-200 hover:shadow-sm group"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                            payment_method === "CARD"
                                ? theme.primary
                                : theme.borderHover;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                            payment_method === "CARD"
                                ? theme.primary
                                : theme.border;
                    }}
                >
                    <div className="flex items-center gap-3">
                        {/* Radio Button Indicator */}
                        <div
                            style={{
                                borderColor:
                                    payment_method === "CARD"
                                        ? theme.primary
                                        : theme.border,
                            }}
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        >
                            {payment_method === "CARD" && (
                                <div
                                    style={{
                                        backgroundColor: theme.primary,
                                    }}
                                    className="w-3 h-3 rounded-full"
                                />
                            )}
                        </div>

                        {/* Icon */}
                        <div
                            style={{
                                color:
                                    payment_method === "CARD"
                                        ? theme.primary
                                        : theme.textMuted,
                            }}
                            className="flex-shrink-0"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                        </div>

                        {/* Label */}
                        <div className="flex-1 text-left">
                            <div
                                style={{
                                    color:
                                        payment_method === "CARD"
                                            ? theme.text
                                            : theme.textSecondary,
                                }}
                                className="font-medium text-sm"
                            >
                                Credit/Debit Card
                            </div>
                            <div
                                style={{ color: theme.textMuted }}
                                className="text-xs mt-0.5"
                            >
                                Pay securely with your card
                            </div>
                        </div>

                        {/* Selected Badge */}
                        {payment_method === "CARD" && (
                           
                           <div
                                    style={{
                                        backgroundColor: theme.badge,
                                        color: theme.textInverse,
                                        borderRadius: '9999px',
                                    }}
                                    className="px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Selected</span>
                                </div>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default PaymentMethodOptions;
