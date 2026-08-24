import { Button } from "@/components/ui/Button";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { getMediaSrcOrDefault } from "@/functions/product/getMediaSrcOrDefault";
import { productFilesUploaderCleaner } from "@/functions/product/productFilesUploaderCleaner";
import { Film, Image as ImageIcon, X, Upload, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotifyUser from "@/components/ui/NotifyUser";
import { Cover, Video } from "@/types/inventoryTypes";
import { convertYoutubeToEmbed } from "@/functions/product/convertYoutubeToEmbed";
import { convertToYoutubeId } from "@/functions/product/convertToYoutubeId";
import Tabs from "../showProductPage/Tabs";

interface MediaSectionProps {
    setVideoPreview: React.Dispatch<React.SetStateAction<Video | null>>;
    videoPreview: Video | null;
}

// Shared skeleton
export const MediaSkeleton = ({ icon, label, theme }: { icon: React.ReactNode; label: string; theme: any }) => (
    <div
        className="absolute inset-0 flex flex-col items-center justify-center animate-pulse rounded-lg gap-2"
        style={{ background: theme.bgSecondary }}
    >
        {icon}
        <span className="text-xs opacity-40" style={{ color: theme.textMuted }}>{label}</span>
    </div>
);

// Iframe with loading skeleton
export const IframeWithLoader = ({ src, title, theme }: { src: string; title: string; theme: any }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            {!loaded && (
                <MediaSkeleton
                    icon={<Film className="w-8 h-8 opacity-30" style={{ color: theme.textMuted }} />}
                    label="Loading video..."
                    theme={theme}
                />
            )}
            <iframe
                title={title}
                src={src}
                className="w-full h-full rounded-lg"
                allowFullScreen
                onLoad={() => setLoaded(true)}
                style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
            />
        </div>
    );
};

// Image with loading skeleton
export const ImageWithLoader = ({ src, alt, theme }: { src: string; alt: string; theme: any }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden">
            {!loaded && (
                <MediaSkeleton
                    icon={<ImageIcon className="w-8 h-8 opacity-30" style={{ color: theme.textMuted }} />}
                    label="Loading..."
                    theme={theme}
                />
            )}
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover rounded-lg transition-all"
                onLoad={() => setLoaded(true)}
                style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
            />
            
        </div>
    );
};

export const UploadingPlaceholder = ({ src, theme }: { src: string; theme: any }) => (
    <div className="relative aspect-square rounded-lg overflow-hidden">
        <img src={src} alt="uploading" className="w-full h-full object-cover rounded-lg blur-sm scale-105" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg" style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span className="text-xs text-white opacity-70">Uploading...</span>
        </div>
    </div>
);

const MediaSection = ({ setVideoPreview, videoPreview }: MediaSectionProps) => {
    const { state: { currentTheme: theme } } = useAdminThemeCtx();
    const { watch, setValue, draftId } = useProductDataCtx();

    const covers = watch("covers") as Cover[] || [];
    const video = Array.isArray(watch("video")) ? watch("video") : [];

    const [coversPreview, setCoversPreview] = useState<Cover[]>(covers);
    const [isDragging, setIsDragging] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [videoUploading, setVideoUploading] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<{ coverErr?: string; videoErr?: string } | null>(null);
    const [showIframeModal, setShowIframeModal] = useState(false);
    const [newIframeUrl, setNewIframeUrl] = useState("");
    const { deleteMedia, uploadProductFiles } = productFilesUploaderCleaner();

    const handleCoversUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Blob URL shown immediately so upload skeleton appears right when file is picked
        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);
        setImageUploading(true);
        try {
            setUploadError(null);
            const data = await uploadProductFiles(file, "gallery", "product", draftId.current);
            const updated = [...covers, { url: data.media.url, id: data.media.id }];
            setCoversPreview(updated);
            setValue("covers", updated, { shouldValidate: true });
        } catch (err: any) {
            setUploadError({ ...uploadError, coverErr: err instanceof Error ? err.message : "" });
        } finally {
            if (imageInputRef.current) imageInputRef.current.value = "";
            URL.revokeObjectURL(objectUrl);
            setLocalPreview(null);
            setImageUploading(false);
        }
    };

    const handleRemoveCover = async (mediaId: string) => {
        if (!draftId.current || !mediaId) return;
        try {
            await deleteMedia(mediaId);
            const updated = covers.filter((media) => media.id != mediaId);
            setCoversPreview(updated);
            setValue("covers", updated, { shouldValidate: true });
        } catch (err: any) {
            setUploadError({ ...uploadError, coverErr: err instanceof Error ? err.message : "" });
        } finally {
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadError(null);
            setVideoUploading(true);
            const data = await uploadProductFiles(file, "video", "Product", draftId.current);
            if (!draftId.current) draftId.current = data.draft_id;
            setValue("video", [...video, { url: data.media.url, id: data.media.id, media_type: "video" }], { shouldValidate: true });
        } catch (err: any) {
            setUploadError({ ...uploadError, videoErr: err instanceof Error ? err.message : "" });
        } finally {
            if (videoInputRef.current) videoInputRef.current.value = "";
            setVideoUploading(false);
        }
    };

    const handleRemoveVideo = async (mediaId: string | null) => {
        if (!draftId.current || !mediaId) return;
        try {
            await deleteMedia(draftId.current, mediaId);
            setValue("video", video!.filter((media) => media?.id != mediaId), { shouldValidate: true });
        } catch (err: any) {
            setUploadError({ ...uploadError, videoErr: err instanceof Error ? err.message : "" });
        } finally {
            if (videoInputRef.current) videoInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

    return (
        <>
            <input ref={imageInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleCoversUpload} />
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />

            <div className="space-y-6">
                {/* IMAGES */}
                <div
                    className="rounded-lg border-2 border-dashed transition-all p-4"
                    style={{ borderColor: isDragging ? theme.accent : theme.border, background: isDragging ? theme.bgSecondary : theme.bg }}
                >
                    <h4 className="text-sm font-semibold mb-3" style={{ color: theme.textSecondary }}>Images</h4>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4"
                    >
                        {(coversPreview || covers || []).map((media, i) => (
                            <div key={i} className="relative group aspect-square group animate-in fade-in zoom-in duration-200" style={{ boxShadow: theme.shadow }}>
                                <ImageWithLoader
                                    src={getMediaSrcOrDefault(media, "image")}
                                    alt={`cover-${i}`}
                                    theme={theme}
                                />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" style={{ background: theme.overlay }} />
                                {/* Delete button top-left, visible on hover */}
                              
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCover(String(media.id))}
                                    className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 p-1 rounded-full bg-white/70 hover:bg-white shadow-lg transition-all"
                                >
                                    <X className="w-5 h-5 text-black" />
                                </button>
                            </div>
                        ))}

                        {/* Uploading placeholder — appears immediately when file is selected */}
                        {imageUploading && localPreview && (
                            <UploadingPlaceholder src={localPreview} theme={theme} />
                        )}

                        <Button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer"
                            style={{ borderColor: theme.border, background: theme.bgSecondary }}
                        >
                            <Upload className="w-8 h-8 mb-2" style={{ color: theme.textMuted }} />
                            <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>Add Images</p>
                        </Button>
                    </div>
                    {uploadError?.coverErr && <NotifyUser message={uploadError.coverErr} />}
                </div>

                {/* VIDEO SECTION */}
                <div>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: theme.textSecondary }}>Video</h4>
                    <Tabs
                        tabs={[
                            {
                                id: "iframes",
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <span>iFrame</span>
                                        <span className={`w-3 h-3 rounded-full ${video?.some((v) => v?.media_type === "iframe") ? "bg-green-500" : "bg-gray-400"}`} />
                                    </div>
                                ),
                                Icon: Plus,
                                content: (
                                    <div className="space-y-4">
                                        <div className="flex justify-center items-center mb-4">
                                            <Button type="button" onClick={() => setShowIframeModal(true)} className="px-4 py-2 rounded-md">
                                                Add iFrame
                                            </Button>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-4 gap-4">
                                            {video!.filter((v) => v?.media_type === "iframe").map((v, idx) => (
                                                <div key={idx} className="relative group flex-1 min-w-[250px]">
                                                    <IframeWithLoader
                                                        src={convertYoutubeToEmbed(v.url ?? "") ?? ""}
                                                        title={`iframe-${idx}`}
                                                        theme={theme}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue("video", video!.filter((x) => x !== v), { shouldValidate: true })}
                                                        className="absolute top-2 right-2 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 z-10"
                                                        style={{ color: theme.text, background: theme.error }}
                                                    >
                                                        <X className="w-5 h-5" style={{ color: theme.text }} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {showIframeModal && (
                                            <IframeEntryModel
                                                newIframeUrl={newIframeUrl}
                                                onChangeIframeUrl={(newUrl) => setNewIframeUrl(newUrl)}
                                                onValidateUrl={() => {
                                                    if (newIframeUrl.trim()) {
                                                        const exists = video!
                                                            .filter(v => v?.media_type !== "video")
                                                            .find(v => v?.url == convertToYoutubeId(newIframeUrl.trim()));
                                                        if (exists) {
                                                            alert("iframe is already in your list");
                                                            setNewIframeUrl("");
                                                            setShowIframeModal(false);
                                                            return;
                                                        }
                                                        setValue("video", [...video, { media_type: "iframe", url: convertToYoutubeId(newIframeUrl) }], { shouldValidate: true });
                                                        setNewIframeUrl("");
                                                        setShowIframeModal(false);
                                                    }
                                                }}
                                                onCancelUrl={() => { setShowIframeModal(false); setNewIframeUrl(""); }}
                                            />
                                        )}
                                    </div>
                                ),
                            },
                            {
                                id: "device-upload",
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <span>Device Upload</span>
                                        <span className={`w-3 h-3 rounded-full ${video!.some((v) => v?.media_type === "video") ? "bg-green-500" : "bg-gray-400"}`} />
                                    </div>
                                ),
                                Icon: Upload,
                                content: (
                                    <div className="space-y-4">
                                        {video!.some((v) => v?.media_type === "video") && (
                                            <div className="relative group">
                                                <video
                                                    src={getMediaSrcOrDefault(video!.find((v) => v?.media_type === "video") ?? null, "video")}
                                                    controls
                                                    className="w-full max-w-2xl rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => handleRemoveVideo(video!.find((v) => v?.media_type === "video")?.id ?? null)}
                                                    style={{ color: theme.text, background: theme.error }}
                                                    className="absolute top-2 right-2 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                                >
                                                    <X className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => videoInputRef.current?.click()}
                                            className="w-full flex flex-col items-center justify-center p-12 transition-all"
                                            disabled={video!.some((el) => el?.media_type === "video")}
                                        >
                                            <Upload className="w-12 h-12 mb-3" />
                                            Upload Video
                                        </button>
                                        {uploadError?.videoErr && <NotifyUser message={uploadError.videoErr} />}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
};

export default MediaSection;

interface IframeEntryModelProps {
    newIframeUrl: string;
    onChangeIframeUrl: (newUrl: string) => void;
    onValidateUrl: () => void;
    onCancelUrl: () => void;
}

const IframeEntryModel = ({ newIframeUrl, onChangeIframeUrl, onValidateUrl, onCancelUrl }: IframeEntryModelProps) => {
    const { state: { currentTheme } } = useAdminThemeCtx();
    const embedUrl = newIframeUrl ? convertYoutubeToEmbed(newIframeUrl) : "";
    const [previewLoaded, setPreviewLoaded] = useState(false);
    useEffect(() => { setPreviewLoaded(false); }, [embedUrl]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: currentTheme.overlay }}>
            <div className="p-6 rounded-lg w-96" style={{ background: currentTheme.modal, boxShadow: currentTheme.shadowMd, borderRadius: currentTheme.borderRadius }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.text }}>Add YouTube URL</h3>
                <input
                    type="url"
                    placeholder="Paste YouTube URL here"
                    value={newIframeUrl}
                    onChange={(e) => onChangeIframeUrl(e.target.value)}
                    className="w-full p-2 mb-4 rounded-lg border"
                    style={{ background: currentTheme.bgSecondary, borderColor: currentTheme.border, color: currentTheme.text, borderRadius: currentTheme.borderRadius }}
                />
                {embedUrl && (
                    <div className="mb-4 relative w-full aspect-video rounded-md overflow-hidden">
                        {!previewLoaded && (
                            <MediaSkeleton
                                icon={<Film className="w-6 h-6 opacity-30" style={{ color: currentTheme.textMuted }} />}
                                label="Loading preview..."
                                theme={currentTheme}
                            />
                        )}
                        <iframe
                            title="iframe-preview"
                            src={embedUrl}
                            className="w-full h-full"
                            allowFullScreen
                            onLoad={() => setPreviewLoaded(true)}
                            style={{ borderRadius: currentTheme.borderRadius, opacity: previewLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
                        />
                    </div>
                )}
                <div className="flex justify-end space-x-2">
                    <Button type="button" onClick={onCancelUrl} className="px-4 py-2 rounded-md" style={{ background: currentTheme.bgSecondary, color: currentTheme.textSecondary, border: `1px solid ${currentTheme.border}`, borderRadius: currentTheme.borderRadius }}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={onValidateUrl} className="px-4 py-2 rounded-md" style={{ background: currentTheme.primary, color: currentTheme.textInverse, borderRadius: currentTheme.borderRadius }}>
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};

