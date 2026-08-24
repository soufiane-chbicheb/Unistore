import { Input } from "@/components/ui/input";
import NotifyUser from "@/components/ui/NotifyUser";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";

import { getMediaSrcOrDefault } from "@/functions/product/getMediaSrcOrDefault";
import { productFilesUploaderCleaner } from "@/functions/product/productFilesUploaderCleaner";
import { Cover } from "@/types/inventoryTypes";
import { Upload, X } from "lucide-react";
import {  useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";




const BaseSharedForm = ({getThumbnailPreview}: {getThumbnailPreview: (thumbnail: string) => void}) => {
    const { draftId, register, control, formState: { errors }, watch, setValue } = useProductDataCtx();
    const { state: { currentTheme } } = useAdminThemeCtx()
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [thumbnailUploading, setThumbnailUploading] = useState(false)
    const [localPreview, setLocalPreview] = useState<string | null>(null)

    const thumbnail = watch('thumbnail');
    const [thumbnailPreview, setThumbnailPreview] = useState<Cover | null>(thumbnail ?? null);
    
    const { deleteMedia, uploadProductFiles } = productFilesUploaderCleaner()

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;
            const localUrl = URL.createObjectURL(file);
            setLocalPreview(localUrl);
            setUploadError(null)
            setThumbnailUploading(true)
            const data = await uploadProductFiles(file, 'thumbnail', 'product', draftId.current);
            setThumbnailPreview({ url: data.media.url, id: data.media.id });
            setValue('thumbnail', { url: data.media.url, id: data.media.id }, { shouldValidate: true });
            if (!draftId.current) draftId.current = data.draft_id
            URL.revokeObjectURL(localUrl);
        } catch (err: any) {
            setUploadError(err.message)
        } finally {
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
            setThumbnailUploading(false)
            setLocalPreview(null)
        }
    };

    const handleThumnailRemove = async (mediaId: string) => {
        if (!mediaId) return;
        try {
            await deleteMedia(mediaId);
            setThumbnailPreview(null);
            setValue('thumbnail', null, { shouldValidate: true });
        } catch (err: any) {
            setUploadError(err.message)
        } finally {
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        }
    }

    return (
        <div className="space-y-6 pb-6 border-b" style={{ borderColor: currentTheme.border }}>

            {/* Thumbnail */}
            <div>
                <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Thumbnail <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                    {/* loading skeleton — blurred local preview */}
                   {/* loading — with local preview */}
{thumbnailUploading && localPreview && (
    <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-dashed flex-shrink-0"
        style={{ borderColor: currentTheme.border }}>
        <img src={localPreview} alt="uploading" className="w-full h-full object-cover blur-sm scale-105" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg"
            style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span className="text-xs text-white opacity-70">Uploading...</span>
        </div>
    </div>
)}

{/* loading — no local preview */}
{thumbnailUploading && !localPreview && (
    <div className="w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 animate-pulse"
        style={{ background: currentTheme.bgSecondary, borderColor: currentTheme.border }}>
        <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin"
            style={{ borderColor: currentTheme.textMuted }} />
        <span className="text-xs opacity-40" style={{ color: currentTheme.textMuted }}>Uploading...</span>
    </div>
)}

                    {!thumbnailUploading && !!thumbnailPreview && (
                        <div className="relative w-40 group h-40 group overflow-hidden rounded-2xl shadow-lg border-2"
                            style={{ borderColor: errors.thumbnail ? '' : currentTheme.success }}>
                            <img
                                src={thumbnailPreview.url ?? getMediaSrcOrDefault(thumbnailPreview, 'image')}
                                alt="Product thumbnail"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
                            />
                            <button
                                type="button"
                                onClick={() => handleThumnailRemove(String(thumbnailPreview.id))}
                                className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 p-1 rounded-full bg-white/70 hover:bg-white shadow-lg transition-all"
                            >
                                <X className="w-5 h-5 text-black" />
                            </button>
                        </div>
                    )}

                    {/* uploader */}
                    {!thumbnailPreview && !thumbnailUploading && (
                        <label className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-md font-semibold"
                            style={{ backgroundColor: currentTheme.secondary, color: currentTheme.text, borderWidth: '2px', borderColor: errors.thumbnail ? '#ef4444' : currentTheme.border }}>
                            <Upload className="w-6 h-6" />
                            Upload Image
                            <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                        </label>
                    )}
                </div>

                {/* upload error */}
                {uploadError && <NotifyUser message={uploadError} />}
                {/* zod error */}
                {errors.thumbnail && (
                    <p className="text-red-500 text-sm mt-2">{errors.thumbnail.message as string}</p>
                )}
            </div>

            {/* Name & Brand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder='Product Name'
                        type="text"
                        {...register('name')}
                        className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                        style={{
                            backgroundColor: currentTheme.bg,
                            color: currentTheme.text,
                            borderWidth: '2px',
                            borderColor: errors.name ? '#ef4444' : currentTheme.border
                        }}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-2">{errors.name.message as string}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                        Brand <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder='Brand'
                        type="text"
                        {...register('brand')}
                        className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                        style={{
                            backgroundColor: currentTheme.bg,
                            color: currentTheme.text,
                            borderWidth: '2px',
                            borderColor: errors.brand ? '#ef4444' : currentTheme.border
                        }}
                    />
                    {errors.brand && (
                        <p className="text-red-500 text-sm mt-2">{errors.brand.message as string}</p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Description <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <div>
                           <div className="quill-wrapper">
                            <ReactQuill
                                theme="snow"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                            <style>{`
                                .quill-wrapper .ql-toolbar,
                                .quill-wrapper .ql-container {
                                border: 1px solid ${currentTheme.border} !important;
                                outline: none !important;
                                }
                            `}</style>
                            </div>
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-2">{errors.description.message as string}</p>
                            )}
                        </div>
                    )}
                />
            </div>
        </div>
    )
}


export default BaseSharedForm ;

