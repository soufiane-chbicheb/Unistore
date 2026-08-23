import React, { useEffect, useRef, useState } from 'react';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Button } from '@/components/ui/button';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { route } from 'ziggy-js';
import axios from 'axios';
import { ProductSchemaType } from '@/shemas/productSchema';
import { router } from '@inertiajs/react';
import LeaveModal from '@/components/ui/LeaveModel';
import { useBackendInteraction } from '@/functions/product/useBackendInteractions';
import { toBackendDataCleaners } from '@/functions/product/toBackendDataCleaners';
import { isEmpty } from 'lodash';
import AppLoading from '@/components/AppLoading';
import { useToast } from '@/contextHooks/useToasts';

const ProductFormMaster: React.FC = () => {
  const { state: { currentTheme } } = useAdminThemeCtx();
  const {
    modeForm,
    draftId,
    handleSubmit: formHandleSubmit,
    watch,
    getValues,
    formState: { isSubmitting, isDirty, errors },
  } = useProductDataCtx();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingVisit, setPendingVisit] = useState<string | null>(null);
  const { addToast } = useToast();
  const { cleanObjectToIids } = toBackendDataCleaners();
  const { save, destroyDraftProduct, loading, loadingMessage } = useBackendInteraction();
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const isLeavingRef = useRef(false);

  // ─── Init draft ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (draftId.current || modeForm === 'edit') return;
    const draftInit = async () => {
      setIsDraftLoading(true);
      try {
        const res = await axios.post(route('products.storeDraft'));
        draftId.current = res.data.id;
      } catch (error) {
        console.error('Failed to create draft:', error);
        addToast({
          title: "Failed to initialize product storage",
          type: "error",
          description: "Please refresh the page and try again."
        });
      } finally {
        setIsDraftLoading(false);
      }
    };
    draftInit();
  }, []);

  // ─── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: ProductSchemaType) => {
    const payload: ProductSchemaType = {
      ...data,
      sub_categories: cleanObjectToIids(data.sub_categories)
    };

    // FIX — must be true BEFORE save so backend redirect isn't blocked by nav guard
    // if save fails we reset it back to false so the guard works again
    isLeavingRef.current = true;
    try {
      await save('draft.save.submit', payload, draftId.current);
    } catch (err: any) {
      isLeavingRef.current = false; // FIX — reset on failure so user can retry
      addToast({
        title: "Error while submitting!",
        type: "error",
        description: err.message
      });
    }
  };

  // ─── Unload guard ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLeavingRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ─── Inertia nav guard ─────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = router.on('before', (event) => {
      // FIX — also check isDirty so clean forms are never blocked
      if (!isLeavingRef.current && isDirty) {
        setShowLeaveModal(true);
        setPendingVisit(event.detail.visit.url.toString());
        event.preventDefault();
      }
    });
    return () => unsubscribe();
  }, [isDirty]);

  // ─── Leave modal handlers ──────────────────────────────────────────────────

  const handleConfirmLeave = () => {
    const data = getValues();
    const payload = {
      ...data,
      product_attributes: cleanObjectToIids(data.product_attributes),
    };

    // fire — Inertia router.put, not a promise, backend redirects
    save('draft.save.leave', payload, draftId.current);

    isLeavingRef.current = true;
    setShowLeaveModal(false);
    if (pendingVisit) router.visit(pendingVisit);
  };

  const handleCancelLeave = () => {
    // guard against null draftId before calling destroy
    if (draftId.current) {
      // fire — Inertia router, not a promise
      destroyDraftProduct(draftId.current);
    }
    isLeavingRef.current = true;
    setShowLeaveModal(false);
    if (pendingVisit) router.visit(pendingVisit);
    setPendingVisit(null);
  };

  const handleCancel = () => {
    setShowLeaveModal(false);
    setPendingVisit(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* App-wide loading overlay */}
      {loading && <AppLoading message={loadingMessage} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          formHandleSubmit(onSubmit, (errors) => {
            console.log('errors', errors);
          })();
        }}
      >
        {showLeaveModal && (
          <LeaveModal
            theme={currentTheme}
            onClose={handleCancel}
            onLeave={handleCancelLeave}
            onSaveDraft={handleConfirmLeave}
          />
        )}

        <div className="flex">
          {/* <pre style={{ 
              color: '#00ff00', 
              background: '#1e1e1e', 
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '13px',
              overflow: 'auto',
              maxHeight: '400px'
          }}>
              {JSON.stringify(getValues(), null, 2)}
          </pre> */}
          <ProductCrEdForm />
          <RightSectionComponent />
        </div>

        {/* Submit bar */}
        <div
          className="sticky bottom-0 z-30 flex justify-end px-6 py-4 border-t backdrop-blur"
          style={{
            background: currentTheme.bgSecondary,
            borderColor: currentTheme.border,
          }}
        >
          <Button
            type="submit"
            // FIX — was isLoading (undefined), correct variable is loading
            disabled={loading || isSubmitting || isDraftLoading}
            className="min-w-[220px] text-sm font-semibold rounded-lg shadow-lg transition hover:opacity-90 active:scale-[0.98]"
            style={{
              background: currentTheme.primary,
              color: currentTheme.textInverse,
            }}
          >
            <Save className="mr-2" size={16} />
            {/* FIX — was isLoading (undefined), correct variable is loading */}
            {isDraftLoading
              ? 'Initializing...'
              : (loading || isSubmitting)
                ? 'Submitting...'
                : modeForm === 'create'
                  ? 'Create Product'
                  : 'Update Product'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductFormMaster;

