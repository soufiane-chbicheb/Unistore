import { router } from "@inertiajs/react"
import { useState } from "react"
import { route } from "ziggy-js"

export const useBackendInteraction = () => {
    const [loading, setLoading] = useState(false)  
    const [loadingMessage, setLoadingMessage] = useState("")  
    const [backendErrors, setBackendErrors] = useState<any>([]);
    const startLoading = (message: string) => {
        setLoading(true)
        setLoadingMessage(message)
    }

    const stopLoading = () => {
        setLoading(false)
        setLoadingMessage("")
    }

    const destroyDraftProduct = (id: string) => {
        if (!id) return
        router.delete(route('product.destroy', { product: id }), {
             onStart:  () => startLoading("Deleting product..."),
             onFinish:  () => stopLoading(),
             onSuccess: () => router.reload({ only: ['drafts'] })
        })
    }

    const save = (url: "draft.save.leave" | "draft.save.submit", payload: any, id?: string) => {
        if (!id) {
            console.error("Attempted to save without a product ID");
            return;
        }
        router.put(route(url, { product: id }), { ...payload }, {
            onStart:  () => startLoading("Saving draft..."),
            onFinish: () => stopLoading(),
            onError: (Errors) => {
                console.log(Errors)
                setBackendErrors(Errors)}
        })
    }


    const publishDraftProduct = (id: string | number, payload: any) => {
        if (!id) return
        router.patch(route('product.publish', { product: id }), payload, {
            onStart:  () => startLoading("Publishing product..."),
            onFinish: () => stopLoading(),
        })
    }

    const duplicateDraft = (id: string | number) => {
        if (!id) return
        router.post(route('draft.duplicate' , { product: id }),{} , {
            preserveScroll: true,
            onStart:  () => startLoading("Duplicating draft..."),
            onFinish: () => stopLoading(),
            onSuccess: () => router.reload({ only: ['drafts'] })
      
        })
    }

    return {
        publishDraftProduct,
        destroyDraftProduct,
        save,
        duplicateDraft,
        loading,
        loadingMessage , 
        backendErrors
    }
}