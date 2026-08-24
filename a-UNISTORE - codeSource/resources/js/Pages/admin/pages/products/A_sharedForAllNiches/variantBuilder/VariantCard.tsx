import { useRef, useState, useEffect } from "react";
import { X, Upload, ChevronDown, Image, Wand2, Trash2 } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Variant } from "@/types/products/productVariantType";
import ColorPicker from "./ColorPicker";
import PricePreview from "../components/editAndCreate/PricePreview";
import { Input } from "@/components/ui/input";
import { ProductSchemaType, variantSchema } from "@/shemas/productSchema";
import { Button } from "@/components/ui/Button";
import { productFilesUploaderCleaner } from "@/functions/product/productFilesUploaderCleaner";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";
import axios from "axios";
import { useFieldArray } from "react-hook-form";

const OPTION_VALUES_STATIC: Record<string, { label: string; value: string }[]> =
    {
        size: ["XS", "S", "M", "L", "XL", "XXL"].map((v) => ({
            label: v,
            value: v,
        })),
        storage: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"].map(
            (v) => ({ label: v, value: v }),
        ),
        ram: ["4GB", "8GB", "16GB", "32GB"].map((v) => ({
            label: v,
            value: v,
        })),
    };

// Always compare options case-insensitively
const hasOption = (options: string[], name: string) =>
    options.some((o) => o.toLowerCase() === name.toLowerCase());

type FormErrors = Record<string, string[]> | null;

interface VariantCardProps {
    variant: Variant;
    activeOptions: string[];
    defaultVariantsPrice?: number;
    colorImages: Record<string, string>;
    onChange: (id: string, field: string, value: any) => void;
    onRemove: (id: string) => void;
    onDone: (id: string) => void;
    onVariantImageUploaded: (hex: string, url: string) => void;
    theme: ThemePalette;
}

interface CreateVariantFormProps {
    variant: Variant;
    activeOptions: string[];
    colorHex: string | null;
    colorName: string | null;
    inheritedImage: string | null;
    overrideImage: boolean;
    setOverrideImage: (val: boolean) => void;
    imgRef: React.RefObject<HTMLInputElement>;
    onChange: (id: string, field: string, value: any) => void;
    onRemove: (id: string) => void;
    onDone: () => void;
    onVariantImageUploaded: (hex: string, url: string) => void;
    theme: ThemePalette;
    errors: any;
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-red-500 text-xs mt-2">{message}</p>;
}

function CreateVariantForm({
    variant,
    activeOptions,
    colorHex,
    colorName,
    inheritedImage,
    overrideImage,
    setOverrideImage,
    imgRef,
    onChange,
    onRemove,
    onDone,
    theme,
    onVariantImageUploaded,
    errors,
}: CreateVariantFormProps) {
    const { uploadProductFiles, deleteMedia } = productFilesUploaderCleaner();
    const { setValue, getValues, variants_options } = useProductDataCtx();
    const inputClassName = "w-full px-5 py-4 rounded-xl font-medium shadow-sm";
    const inputStyle = (hasError?: boolean) => ({
        backgroundColor: theme.bg,
        color: theme.text,
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: hasError ? "#ef4444" : theme.border,
    });
    const labelClassName =
        "block text-sm font-bold mb-4 uppercase tracking-wide";
    const sectionLabelClassName =
        "text-xs font-bold uppercase tracking-widest mb-3";

    const err = (field: string) => errors?.[field]?.[0];

    const [local, setLocal] = useState({
        price: variant.price ?? "",
        compare_price: variant.compare_price ?? "",
        stock: variant.stock ?? "",
        sku: variant.sku ?? "",
    });

    // FIX #6 — sync local state if variant changes externally (e.g. switching variants)
    useEffect(() => {
        setLocal({
            price: variant.price ?? "",
            compare_price: variant.compare_price ?? "",
            stock: variant.stock ?? "",
            sku: variant.sku ?? "",
        });
    }, [variant.variant_id]);

    const handleLocalChange = (field: string, value: string) => {
        setLocal((prev) => ({ ...prev, [field]: value }));
    };

    const handleBlur = (field: string) => {
        const value = local[field as keyof typeof local];
        if (field === "sku") {
            onChange(String(variant.variant_id), field, value);
        } else {
            onChange(
                String(variant.variant_id),
                field,
                value === "" ? null : Number(value),
            );
        }
    };

    const handleVariantImageUpload = async (
        variantId: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        try {
            const file = e.target?.files?.[0];
            if (!file) return;
            const variantIdSnapshot = variantId;
            const { media } = await uploadProductFiles(
                file,
                "gallery",
                "variant",
            );
            if (media) {
                const freshVariants = getValues("variants");
                const targetVariant = freshVariants.find(
                    (v) => String(v.variant_id) === variantIdSnapshot,
                );
                const hex = (
                    targetVariant?.attrs?.color as { hex: string } | undefined
                )?.hex;
                if (hex) {
                    onVariantImageUploaded(hex, media.url);
                }
                const currentImages = targetVariant?.images || [];
                onChange(variantIdSnapshot, "images", [
                    ...currentImages,
                    { url: media.url, id: media.id },
                ]);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleRemoveVariantImage = (
        variant: Variant,
        imgId: string | null | undefined,
    ) => {
        if (!imgId) return;
        deleteMedia(String(imgId));
        const currentImages = (variant.images || []).filter((m) =>
            m.id ? String(m.id) !== imgId : false,
        );
        onChange(String(variant.variant_id), "images", currentImages);
    };

    return (
        <div
            style={{
                padding: "0 16px 20px",
                borderTop: `1px solid ${theme.border}`,
            }}
        >
            {/* Color */}
            {hasOption(activeOptions, "color") && (
                <div style={{ marginTop: 18 }}>
                    <ColorPicker
                        value={colorHex}
                        onChange={(hex, name) => {
                            onChange(
                                String(variant.variant_id),
                                "attrs.color",
                                { hex, name },
                            );
                            setOverrideImage(false);
                        }}
                        theme={theme}
                    />
                    {err("color") ? (
                        <FieldError message={err("color")} />
                    ) : (
                        <p
                            className="text-xs mt-2"
                            style={{ color: theme.textMuted }}
                        >
                            pre-filled from product
                        </p>
                    )}
                </div>
            )}

            {/* Other options */}
            {activeOptions.filter((o) => o.toLowerCase() !== "color").length >
                0 && (
                <div
                    className="grid grid-cols-2 gap-4"
                    style={{ marginTop: 18 }}
                >
                    {activeOptions
                        .filter((o) => o.toLowerCase() !== "color")
                        .map((opt) => {
                            const optKey = opt.toLowerCase();
                            const attrValue = variant.attrs?.[optKey];
                            const selectedValues =
                                attrValue && typeof attrValue === "string"
                                    ? [{ label: attrValue, value: attrValue }]
                                    : [];

                            return (
                                <div key={opt}>
                                    <label
                                        className={labelClassName}
                                        style={{ color: theme.text }}
                                    >
                                        {opt}
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <MultiSelectDropdownForObject
                                            label={`— pick ${optKey} —`}
                                            selectedValues={selectedValues}
                                            onChange={(selected) => {
                                                if (
                                                    !selected?.length ||
                                                    selected[0]?.value == null
                                                )
                                                    return;
                                                onChange(
                                                    String(variant.variant_id),
                                                    `attrs.${optKey}`,
                                                    selected[0].value,
                                                );
                                            }}
                                            multiple={false}
                                            options={(
                                                variants_options[optKey] || []
                                            ).map((o) => ({
                                                value: o.value,
                                                label: o.value,
                                            }))}
                                        />
                                    </div>
                                    <FieldError message={err(optKey)} />
                                </div>
                            );
                        })}
                </div>
            )}

            {/* Pricing */}
            <div
                className="rounded-xl p-4"
                style={{
                    marginTop: 18,
                    border: `2px solid ${err("price") ? "#ef4444" : theme.border}`,
                    background: theme.bgSecondary,
                }}
            >
                <p
                    className={sectionLabelClassName}
                    style={{ color: theme.textMuted }}
                >
                    Pricing
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <label
                            className={labelClassName}
                            style={{ color: theme.text }}
                        >
                            Price
                        </label>
                        <Input
                            type="number"
                            value={local.price}
                            placeholder="e.g. 299"
                            onChange={(e) =>
                                handleLocalChange("price", e.target.value)
                            }
                            onBlur={() => handleBlur("price")}
                            className={inputClassName}
                            style={inputStyle(!!err("price"))}
                        />
                        {err("price") ? (
                            <FieldError message={err("price")} />
                        ) : (
                            <p
                                className="text-xs mt-2"
                                style={{ color: theme.textMuted }}
                            >
                                pre-filled from product
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            className={labelClassName}
                            style={{ color: theme.text }}
                        >
                            Compare Price
                        </label>
                        <Input
                            type="number"
                            value={local.compare_price}
                            placeholder="e.g. 399"
                            onChange={(e) =>
                                handleLocalChange(
                                    "compare_price",
                                    e.target.value,
                                )
                            }
                            onBlur={() => handleBlur("compare_price")}
                            className={inputClassName}
                            style={inputStyle(!!err("compare_price"))}
                        />
                        {err("compare_price") ? (
                            <FieldError message={err("compare_price")} />
                        ) : (
                            <p
                                className="text-xs mt-2"
                                style={{ color: theme.textMuted }}
                            >
                                original / crossed-out price
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            className={labelClassName}
                            style={{ color: theme.text }}
                        >
                            Preview
                        </label>
                        <PricePreview
                            price={variant.price ?? null}
                            comparePrice={variant.compare_price ?? null}
                            currentTheme={theme}
                        />
                    </div>
                </div>
            </div>

            {/* Inventory */}
            <div
                className="rounded-xl p-4"
                style={{
                    marginTop: 12,
                    border: `2px solid ${err("stock") ? "#ef4444" : theme.border}`,
                    background: theme.bgSecondary,
                }}
            >
                <p
                    className={sectionLabelClassName}
                    style={{ color: theme.textMuted }}
                >
                    Inventory
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label
                            className={labelClassName}
                            style={{ color: theme.text }}
                        >
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            value={local.stock}
                            placeholder="e.g. 50"
                            onChange={(e) =>
                                handleLocalChange("stock", e.target.value)
                            }
                            onBlur={() => handleBlur("stock")}
                            className={inputClassName}
                            style={inputStyle(!!err("stock"))}
                        />
                        <FieldError message={err("stock")} />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-bold mb-4 uppercase tracking-wide flex items-center gap-2"
                            style={{ color: theme.text }}
                        >
                            SKU
                            {!variant.sku && (
                                <span
                                    className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal"
                                    style={{
                                        backgroundColor: theme.primary + "18",
                                        color: theme.primary,
                                        border: `1px solid ${theme.primary}40`,
                                    }}
                                >
                                    <Wand2 size={10} /> Auto
                                </span>
                            )}
                        </label>
                        <Input
                            type="text"
                            value={local.sku}
                            placeholder="Leave empty to auto-generate"
                            onChange={(e) =>
                                handleLocalChange("sku", e.target.value)
                            }
                            onBlur={() => handleBlur("sku")}
                            className={inputClassName}
                            style={inputStyle(!!err("sku"))}
                        />
                        <FieldError message={err("sku")} />
                    </div>
                </div>
            </div>

            {/* Images */}
            {/* inherited banner — always show on top if exists */}
            {inheritedImage && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3"
                    style={{
                        background: theme.bg,
                        border: `2px solid ${theme.border}`,
                    }}
                >
                    <img
                        src={inheritedImage}
                        alt=""
                        style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 8,
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                        >
                            Inherited from{" "}
                            <strong style={{ color: colorHex || theme.text }}>
                                {colorName}
                            </strong>
                        </p>
                        <p
                            className="text-xs mt-0.5"
                            style={{ color: theme.textMuted }}
                        >
                            All {colorName} variants share this image
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setOverrideImage(true)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{
                            border: `1px solid ${theme.border}`,
                            background: "transparent",
                            color: theme.textMuted,
                            cursor: "pointer",
                        }}
                    >
                        Override
                    </Button>
                </div>
            )}

            {/* images + uploader — always show */}
            <div className="flex items-center gap-4">
                {(variant.images || []).map(
                    (image) =>
                        image?.url && (
                            <div
                                key={image.id}
                                style={{
                                    position: "relative",
                                    width: 64,
                                    height: 64,
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src={image.url}
                                    alt=""
                                    style={{
                                        width: 64,
                                        height: 64,
                                        objectFit: "cover",
                                        borderRadius: 12,
                                        border: `2px solid ${theme.border}`,
                                        display: "block",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveVariantImage(
                                            variant,
                                            String(image?.id),
                                        )
                                    }
                                    style={{
                                        position: "absolute",
                                        top: -6,
                                        right: -6,
                                        background: theme.error,
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 20,
                                        height: 20,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        padding: 0,
                                    }}
                                >
                                    <Trash2 size={10} color="#fff" />
                                </button>
                            </div>
                        ),
                )}
                <div
                    onClick={() => imgRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 10,
                        border: `2px dashed ${theme.border}`,
                        background: theme.bg,
                        flexShrink: 0,
                    }}
                >
                    <Upload size={16} color={theme.textMuted} />
                    <span style={{ fontSize: 9, color: theme.textMuted }}>
                        upload
                    </span>
                </div>
                <Input
                    ref={imgRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                        handleVariantImageUpload(String(variant.variant_id), e)
                    }
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
                <Button
                    type="button"
                    onClick={() => onRemove(String(variant.variant_id))}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                        border: `2px solid ${theme.border}`,
                        background: "transparent",
                        color: theme.textMuted,
                        cursor: "pointer",
                    }}
                >
                    Remove
                </Button>
                <Button
                    type="button"
                    onClick={onDone}
                    className="px-6 py-2 rounded-xl text-sm font-semibold"
                    style={{
                        background: theme.primary,
                        border: "none",
                        color: theme.textInverse,
                        cursor: "pointer",
                    }}
                >
                    ✓ Save Variant
                </Button>
            </div>
        </div>
    );
}

export default function VariantCard({
    variant,
    activeOptions,
    defaultVariantsPrice,
    colorImages,
    onChange,
    onRemove,
    onDone,
    onVariantImageUploaded,
    theme,
}: VariantCardProps) {
    const [overrideImage, setOverrideImage] = useState(false);
    const [errors, setErrors] = useState<FormErrors>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const { getValues, control } = useProductDataCtx();
    const { fields: variants, append, remove, update } = useFieldArray<ProductSchemaType, 'variants'>({
        control,
        name: 'variants'
    });
    const color = variant.attrs?.color as
        | { hex: string; name: string }
        | undefined;
    const colorHex = color?.hex ?? null;
    const colorName = color?.name ?? null;

    // FIX #4 — guard against object values being cast to string (shows [object Object])
    const cardLabel =
        activeOptions
            .map((opt) => {
                if (hasOption([opt], "color")) return colorName;
                const val = variant.attrs?.[opt.toLowerCase()];
                // only return if it's a plain string, not an object
                return typeof val === "string" ? val : undefined;
            })
            .filter(Boolean)
            .join(" / ") || "New Variant";

    const inheritedImage = colorHex ? colorImages[colorHex] : null;
    const displayImage = variant.images?.[0]?.url || inheritedImage;
    const isInherited = !variant.images?.[0]?.url && !!inheritedImage;

    useEffect(() => {
       const index = getValues("variants").findIndex(v => String(v.variant_id) == String(variant.variant_id))
       if(index == -1 ) return ; 
       const current = getValues("variants")[index] ; 
       update(index  , {...current , images : [{url : inheritedImage ?? undefined}]} )
    }, [isInherited]);

    const handleDone = () => {
        const result = variantSchema.safeParse(variant);

        const attrErrors: Record<string, string[]> = {};
        activeOptions.forEach((opt) => {
            if (hasOption([opt], "color")) {
                if (!variant.attrs?.color)
                    attrErrors["color"] = ["Color is required"];
            } else {
                const key = opt.toLowerCase();
                if (!variant.attrs?.[key])
                    attrErrors[key] = [`${opt} is required`];
            }
        });

        const zodErrors = !result.success
            ? result.error.flatten().fieldErrors
            : {};
        const allErrors = { ...zodErrors, ...attrErrors };

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            return;
        }

        setErrors(null);
        onDone(String(variant.variant_id) ?? "");
    };

    return (
        <div
            style={{
                background: theme.bgSecondary,
                border: `1px solid ${errors && Object.keys(errors).length > 0 ? "#ef4444" : theme.border}`,
                borderRadius: theme.borderRadius,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                }}
            >
                {hasOption(activeOptions, "color") && (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        {displayImage ? (
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 6,
                                    overflow: "hidden",
                                    border: `2px solid ${colorHex || theme.border}`,
                                }}
                            >
                                <img
                                    src={displayImage}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 6,
                                    background: colorHex || theme.border,
                                    border: `2px solid ${theme.border}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {!colorHex && (
                                    <Image size={14} color={theme.textMuted} />
                                )}
                            </div>
                        )}
                        {isInherited && (
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -3,
                                    right: -3,
                                    background: theme.success,
                                    borderRadius: "50%",
                                    width: 12,
                                    height: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span style={{ fontSize: 7, color: "#fff" }}>
                                    ↓
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* FIX #4 — use cardLabel instead of label (which conflicted with framer-motion import) */}
                <span

                    style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 500,
                        color: theme.text,
                    }}
                >
                    {cardLabel}
                </span>

                {errors && Object.keys(errors).length > 0 && (
                    <span
                        style={{
                            fontSize: 11,
                            color: "#ef4444",
                            background: "#ef444415",
                            border: "1px solid #ef444440",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontWeight: 600,
                            flexShrink: 0,
                        }}
                    >
                        ⚠ {Object.keys(errors).length} error
                        {Object.keys(errors).length > 1 ? "s" : ""}
                    </span>
                )}

                {!variant.isOpen && (
                    <span style={{ fontSize: 12, color: theme.textMuted }}>
                        {Number(variant.price ?? defaultVariantsPrice ?? 0)} MAD
                        &nbsp;·&nbsp;
                        {Number(variant.stock ?? 0) > 0 ? (
                            `${variant.stock} units`
                        ) : (
                            <span style={{ color: theme.error + "cc" }}>
                                no stock
                            </span>
                        )}
                    </span>
                )}

                <Button
                    type="button"
                    onClick={() => {
                        if (!variant.variant_id) return;
                        onChange(
                            String(variant.variant_id),
                            "isOpen",
                            !variant.isOpen,
                        );
                    }}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: theme.textMuted,
                        padding: 2,
                    }}
                >
                    <ChevronDown
                        size={14}
                        style={{
                            transform: variant.isOpen
                                ? "rotate(180deg)"
                                : "rotate(0)",
                            transition: "transform 0.2s",
                        }}
                    />
                </Button>
                <Button
                    type="button"
                    onClick={() => onRemove(String(variant.variant_id))}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: theme.textMuted,
                        padding: 2,
                    }}
                >
                    <X size={14} />
                </Button>
            </div>

            {/* Body */}
            {variant.isOpen && (
                <CreateVariantForm
                    variant={variant}
                    activeOptions={activeOptions}
                    colorHex={colorHex}
                    colorName={colorName}
                    inheritedImage={inheritedImage}
                    overrideImage={overrideImage}
                    setOverrideImage={setOverrideImage}
                    imgRef={imgRef}
                    onChange={onChange}
                    onRemove={onRemove}
                    onDone={handleDone}
                    onVariantImageUploaded={onVariantImageUploaded}
                    theme={theme}
                    errors={errors}
                />
            )}
        </div>
    );
}
