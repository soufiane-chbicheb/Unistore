import CollapsibleSection from "@/components/CollapsibleSection";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import {
    Video as VideoIcon,
    Droplet,
    Settings,
    HelpCircle,
    Tag,
    Layers,
    Megaphone,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import MediaSection from "../components/editAndCreate/MediaSection";
import {
    Video,
} from "@/types/inventoryTypes";
import BaseSharedForm from "../components/editAndCreate/BaseSharedForm";

import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";

import CollapsibleFrendlySection from "@/components/CollapsibleFrendlySection";
import adapters from "@/functions/product/adapters";
import { Button } from "@/components/ui/Button";
import VisibilitySettings from "../components/editAndCreate/VisibilitySettings";
import RelatedProductsSection from "../components/editAndCreate/RelatedProductsSection";
import PricingOrVariants from "../components/editAndCreate/PricingOrVariants";
import MarketingSection from "../components/editAndCreate/MarketingSection";
import FaqsSection from "../components/editAndCreate/FAQS";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";
import AttributesBuilder from "../components/editAndCreate/AttributesBuilder";


interface ProductCrEdFormFormProps {
}

const ProductCrEdForm = ({} : ProductCrEdFormFormProps) => {
    const { register, control, watch, setValue, formState: { errors } ,  nich_cats } = useProductDataCtx();
    const { toSelectOptionAdapter } = adapters()
    const {
        state: { currentTheme },
    } = useAdminThemeCtx();

    const covers = watch('covers');
    const video = watch('video');
    const variants = watch('variants');

    const isOpenShowMedia = (covers ?? [])?.length > 0 || !!(video && Object.keys(video).length > 0);
    const isOpenShowVariantBuilder = variants?.length > 0;
    const isOpenShowAttributes = true;
    const hasVariants = variants?.length > 0;

    const [showAttributes, setShowAttributes] = useState<boolean>(isOpenShowAttributes);
    const [videoPreview, setVideoPreview] = useState<Video | null>(video ?? null);
    const [showMedia, setShowMedia] = useState<boolean>(isOpenShowMedia);
    const [showFaqs, setShowFaqs] = useState(false);
    const [showVisibility, setShowVisibility] = useState(false);
    const [showRelated, setShowRelated] = useState(false);
    const [showMarketing, setShowMarketing] = useState(false);

    const mediaRef = useRef<HTMLDivElement | null>(null);
    const attributesRef = useRef<HTMLDivElement | null>(null);
    const variantRef = useRef<HTMLDivElement | null>(null);
    const thumbnailPreviewRef = useRef<any | null>(null);
   
    const handleToggleSection = (
        sectionName: string,
        currentState: boolean,
        setter: (value: boolean) => void,
        clearData?: () => void
    ) => {
        if (currentState && clearData) {
            const confirmed = window.confirm(
                `Deactivating "${sectionName}" will clear all data. Proceed?`
            );
            if (confirmed) {
                clearData();
                setter(false);
            }
        } else {
            setter(!currentState);
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto">
            <div
                className="space-y-8 py-8 px-4 rounded-xl shadow-2xl"
                style={{ background: "transparent", color: currentTheme.text }}
            >
                {/* Category selection */}
                <section
                    className="p-4 border border-1"
                    style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                    <h2
                        className="text-xl font-bold uppercase tracking-wide mb-4"
                        style={{ color: currentTheme.text }}
                    >
                        What You are going to sell ??
                    </h2>
                 <MultiSelectDropdownForObject
                            multiple={false}
                            label="select niche"
                            options={nich_cats?.map(toSelectOptionAdapter)}
                            selectedValues={
                                watch('category_niche_id')
                                ? [{ value: watch('category_niche_id'), label: nich_cats?.find(c => c.id === watch('category_niche_id'))?.name ?? '' }]
                                : []
                            }
                            onChange={(selected) => {
                                setValue('category_niche_id', selected[0]?.value ?? '', { shouldValidate: true });
                            }}
                            />
                    {errors.category_niche_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.category_niche_id.message as string}</p>
                    )}
                </section>

                {/* Base form */}
                <section
                    className="p-4 border border-1"
                    style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                    <BaseSharedForm 
                        
                        getThumbnailPreview={(thumbnail) =>
                            (thumbnailPreviewRef.current = thumbnail)
                        }
                    />
                </section>

                {/* Media */}
                <section
                    className="border border-1"
                    style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                    <div ref={mediaRef}>
                        <CollapsibleFrendlySection
                            title="Add Media"
                            icon={VideoIcon}
                            isOpen={showMedia}
                            onToggle={() => setShowMedia((prev) => !prev)}
                            headerActions={
                                <>
                                    <Button type="button" className="px-3 py-1.5 text-sm rounded-lg border">
                                        Add images
                                    </Button>
                                    <Button type="button" className="px-3 py-1.5 text-sm rounded-lg border">
                                        Add video
                                    </Button>
                                </>
                            }
                        >
                            <MediaSection {...{ videoPreview, setVideoPreview }} />
                        </CollapsibleFrendlySection>
                        {errors.covers && (
                            <p className="text-red-500 text-xs mt-1">{errors.covers.message as string}</p>
                        )}
                    </div>
                </section>

                {/* Pricing or variants */}
                <section
                    className="border border-1"
                    style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                    <PricingOrVariants />
                </section>

                {/* FAQs */}
                <section
                    className="border border-1"
                    style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                    <CollapsibleSection
                        title="FAQs"
                        icon={HelpCircle}
                        isOpen={showFaqs}
                        onToggle={() => handleToggleSection("FAQs", showFaqs, setShowFaqs)}
                    >
                        <FaqsSection />
                    </CollapsibleSection>
                </section>

                {/* Attributes */}
                    <section
                        className="border border-1"
                        style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                    >
                        <div ref={attributesRef}>
                            <CollapsibleSection
                                title="Product Attributes"
                                icon={Settings}
                                isOpen={showAttributes}
                                onToggle={() =>
                                    handleToggleSection("Product Attributes", showAttributes, setShowAttributes)
                                }
                            >
                                <AttributesBuilder />
                            </CollapsibleSection>
                        </div>
                    </section>

                {/* Marketing */}
                <section
                className="border border-1"
                style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                <CollapsibleSection
                    title="Marketing"
                    icon={Megaphone}
                    isOpen={showMarketing}
                    onToggle={() => handleToggleSection("Marketing", showMarketing, setShowMarketing)}
                >
                    <MarketingSection />
                </CollapsibleSection>
                </section>

                {/* Related products */}
                <CollapsibleSection
                    title="Related Products"
                    icon={Layers}
                    isOpen={showRelated}
                    onToggle={() => handleToggleSection("Related Products", showRelated, setShowRelated)}
                >
                    <RelatedProductsSection />
                </CollapsibleSection>

                {/* Visibility */}
                <section
                    className="border border-1"
                    style={{ background: currentTheme.card, borderColor: currentTheme.border }}
                >
                    <CollapsibleSection
                        title="Visibility Settings"
                        icon={Settings}
                        isOpen={showVisibility}
                        onToggle={() => handleToggleSection("Product Settings", showVisibility, setShowVisibility)}
                    >
                        <VisibilitySettings />
                    </CollapsibleSection>
                </section>
            </div>
        </div>
    );
};

export default ProductCrEdForm;

