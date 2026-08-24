import { Button } from "@/components/ui/Button";
import { isEmptyObject } from "@/functions/product/souldSaveDraft";

const ShippingAddressReview = ({
    shippingData,
    theme,
    onStepChange,
    backendErrors = {},
}: {
    onStepChange: (action: any) => void;
    shippingData: any;
    theme: any;
    backendErrors?: Record<string, string[]>;
}) => {
    const err = (field: string) => backendErrors[`address.${field}`]?.[0];
    const addr = shippingData?.address;

    return (
        <div className="relative overflow-visible">
            {/* ticket notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10" style={{ background: theme.bg }} />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-10" style={{ background: theme.bg }} />

            <div
                className="border rounded-sm overflow-hidden"
                style={{ borderColor: theme.border, background: theme.bgSecondary }}
            >
                {/* Header strip */}
                <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{ background: theme.primary + "15", borderBottom: `1px dashed ${theme.border}` }}
                >
                    <div>
                        <p className="text-xs tracking-widest uppercase opacity-50" style={{ color: theme.text }}>
                            Ship To
                        </p>
                        <p className="font-bold text-sm" style={{ color: theme.text }}>
                            {addr?.first_name} {addr?.last_name}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onStepChange("prev")}
                        className="text-xs px-3 py-1 rounded-sm border hover:opacity-70 transition-opacity"
                        style={{ borderColor: theme.border, color: theme.textSecondary }}
                    >
                        Edit 
                    </button>
                </div>

                {/* Body */}
                {isEmptyObject(shippingData) ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <p className="text-sm opacity-60" style={{ color: theme.text }}>No address yet</p>
                        <Button onClick={() => onStepChange("prev")}>Add address</Button>
                    </div>
                ) : (
                    <div className="px-5 py-4 space-y-3">
                        {/* Address line */}
                        <Row label="Address" error={err("address_line1")}>
                            {addr?.address_line1}
                            {addr?.address_line2 && `, ${addr.address_line2}`}
                        </Row>

                        {/* City / State / Zip on one row */}
                        <div className="grid grid-cols-3 gap-2">
                            <Row label="City"    error={err("city")}        >{addr?.city}</Row>
                            <Row label="State"   error={err("state")}       >{addr?.state}</Row>
                            <Row label="ZIP"     error={err("postal_code")} >{addr?.postal_code}</Row>
                        </div>

                        {/* dashed divider */}
                        <div className="border-t border-dashed" style={{ borderColor: theme.border }} />

                        <Row label="Phone" error={err("phone")}>{addr?.phone}</Row>
                        <Row label="Email" error={err("email")}>{addr?.email}</Row>
                    </div>
                )}
            </div>
        </div>
    );
};

// tiny helper so rows are clean
const Row = ({
    label,
    children,
    error,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
}) => (
    <div>
        <p className="text-xs uppercase tracking-wider opacity-40 mb-0.5" style={{ fontSize: "10px" }}>
            {label}
        </p>
        <p className="text-sm font-medium">{children || "—"}</p>
        {error && <p className="text-xs text-red-500 mt-0.5">⚠ {error}</p>}
    </div>
);


export default ShippingAddressReview ;
