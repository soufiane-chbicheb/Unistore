// Pages/Checkout/components/PaymentMethodSelector.tsx
import { Banknote, CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
    selected: "COD" | "CARD";
    onChange: (method: "COD" | "CARD") => void;
    theme: any;
}

export default function PaymentMethodSelector({
    selected,
    onChange,
    theme,
}: PaymentMethodSelectorProps) {
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
            className="border rounded-lg p-6"
        >
            <h2 style={{ color: theme.text }} className="text-xl font-bold mb-4">
                Payment Method
            </h2>

            <div className="space-y-3">
                <label
                    className="flex items-center gap-3 p-4 rounded border cursor-pointer transition"
                    style={{
                        borderColor:
                            selected === "COD" ? theme.primary : theme.border,
                        backgroundColor:
                            selected === "COD" ? theme.bgSecondary : "transparent",
                    }}
                    onClick={() => onChange("COD")}
                >
                    <input
                        type="radio"
                        checked={selected === "COD"}
                        onChange={() => onChange("COD")}
                        className="w-5 h-5"
                        style={{ accentColor: theme.primary }}
                    />
                    <Banknote size={24} style={{ color: theme.primary }} />
                    <div>
                        <div style={{ color: theme.text }} className="font-semibold">
                            Cash on Delivery
                        </div>
                        <div
                            style={{ color: theme.textSecondary }}
                            className="text-sm"
                        >
                            Pay with cash when you receive your order
                        </div>
                    </div>
                </label>

                <label
                    className="flex items-center gap-3 p-4 rounded border cursor-pointer transition"
                    style={{
                        borderColor:
                            selected === "CARD" ? theme.primary : theme.border,
                        backgroundColor:
                            selected === "CARD" ? theme.bgSecondary : "transparent",
                    }}
                    onClick={() => onChange("CARD")}
                >
                    <input
                        type="radio"
                        checked={selected === "CARD"}
                        onChange={() => onChange("CARD")}
                        className="w-5 h-5"
                        style={{ accentColor: theme.primary }}
                    />
                    <CreditCard size={24} style={{ color: theme.primary }} />
                    <div>
                        <div style={{ color: theme.text }} className="font-semibold">
                            Credit/Debit Card
                        </div>
                        <div
                            style={{ color: theme.textSecondary }}
                            className="text-sm"
                        >
                            Secure payment with Visa, Mastercard, or Amex
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
}
