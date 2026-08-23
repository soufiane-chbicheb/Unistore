import { Input } from "@/components/ui/input";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Search, Loader2, Tag, Ticket, Check, Plus, X, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { route } from "ziggy-js";

interface Promotion {
  id: number;
  name: string;
  discount: string;
  expiry: string | null;
}

interface Coupon {
  id: number;
  code: string;
  discount: string;
  expiry: string | null;
}
 
export default function MarketingSection() {
  const { watch, setValue } = useProductDataCtx();
  const { state: { currentTheme } } = useAdminThemeCtx();

  const promotionIds = watch('promotion_ids') || [];
  const couponIds    = watch('coupon_ids')    || [];

  const [promoSearch,  setPromoSearch]  = useState('');
  const [couponSearch, setCouponSearch] = useState('');

  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [allCoupons,    setAllCoupons]    = useState<Coupon[]>([]);
  const [promoLoading,  setPromoLoading]  = useState(true);
  const [couponLoading, setCouponLoading] = useState(true);


  // get promotions fro backend 
  
  useEffect(() => {
    setPromoLoading(true);
    axios.get(route('get.promotions'))
      .then(res => setAllPromotions(res.data))
      .catch(() => setAllPromotions([]))
      .finally(() => setPromoLoading(false));
  }, []);

  useEffect(() => {
    setCouponLoading(true);
    axios.get(route('get.coupons'))
      .then(res => setAllCoupons(res.data))
      .catch(() => setAllCoupons([]))
      .finally(() => setCouponLoading(false));
  }, []);

  const togglePromo = (id: number) => {
    setValue('promotion_ids',
      promotionIds.includes(id)
        ? promotionIds.filter((p: number) => p !== id)
        : [...promotionIds, id],
      { shouldValidate: true }
    );
  };

  const toggleCoupon = (id: number) => {
    setValue('coupon_ids',
      couponIds.includes(id)
        ? couponIds.filter((c: number) => c !== id)
        : [...couponIds, id],
      { shouldValidate: true }
    );
  };

  const filteredPromos  = allPromotions.filter(p => p.name.toLowerCase().includes(promoSearch.toLowerCase()));
  const filteredCoupons = allCoupons.filter(c => c.code.toLowerCase().includes(couponSearch.toLowerCase()));

  const appliedPromos  = allPromotions.filter(p => promotionIds.includes(p.id));
  const appliedCoupons = allCoupons.filter(c => couponIds.includes(c.id));

  const br = currentTheme.borderRadius;

  const inputStyle = {
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    borderWidth: '1px',
    borderColor: currentTheme.border,
    borderRadius: br,
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-10">
      <Loader2 size={18} className="animate-spin" style={{ color: currentTheme.textMuted }} />
    </div>
  );

  const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <Megaphone size={20} style={{ color: currentTheme.textMuted }} />
      <p className="text-xs" style={{ color: currentTheme.textMuted }}>No {label} found</p>
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-4">

      {/* ── Two columns ── */}
      <div className="grid grid-cols-2 gap-4" style={{ height: 380 }}>

        {/* ── Promotions ── */}
        <div className="flex flex-col gap-2 min-h-0">

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center justify-center w-7 h-7"
              style={{ background: currentTheme.primary + '15', borderRadius: br }}
            >
              <Tag size={13} style={{ color: currentTheme.primary }} />
            </div>
            <p className="text-sm font-bold" style={{ color: currentTheme.text }}>Promotions</p>
            {promotionIds.length > 0 && (
              <span
                className="text-xs font-semibold px-2 py-0.5 ml-auto"
                style={{ background: currentTheme.primary + '15', color: currentTheme.primary, borderRadius: 999 }}
              >
                {promotionIds.length} applied
              </span>
            )}
          </div>

          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
            <Input
              type="text"
              placeholder="Search promotions..."
              value={promoSearch}
              onChange={(e) => setPromoSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm"
              style={inputStyle}
            >
                <Search  size={16}/>
            </Input>
          </div>

          <div
            className="flex flex-col overflow-y-auto flex-1 min-h-0 themed-scroll"
            style={{ border: `1px solid ${currentTheme.border}`, borderRadius: br  , '--scroll-color': currentTheme.primary } as React.CSSProperties}
           
   
          >
            {promoLoading ? <LoadingState /> : filteredPromos.length === 0 ? <EmptyState label="promotions" /> : (
              (filteredPromos || []).map((promo, i) => {
                const applied = promotionIds.includes(promo.id);
                return (
                  <div
                    key={promo?.id}
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{
                      borderTop: i !== 0 ? `1px solid ${currentTheme.border}` : 'none',
                      background: applied ? currentTheme.primary + '0d' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="flex items-center justify-center w-7 h-7 shrink-0"
                        style={{
                          background: applied ? currentTheme.primary + '20' : currentTheme.bgSecondary,
                          borderRadius: br,
                        }}
                      >
                        <Tag size={12} style={{ color: applied ? currentTheme.primary : currentTheme.textMuted }} />
                      </div>
                     <div className="flex flex-col min-w-0">
                        <span
                          className="text-xs font-bold truncate"
                          style={{ color: currentTheme.text }}
                        >
                          {promo?.name}
                        </span>
                        <span className="text-[11px] truncate" style={{ color: currentTheme.accent }}>
                          {promo?.type === 'percentage'
                            ? `${promo?.value}% off`
                            : promo?.type === 'fixed'
                              ? `${promo?.value} MAD off`
                              : 'Free Shipping'}
                          <span style={{ color: currentTheme.textMuted }}>
                            {' · '}
                            {promo?.valid_until
                              ? `Ends ${new Date(promo?.valid_until).toLocaleDateString('en', { day: '2-digit', month: 'short' })}`
                              : 'No expiry'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePromo(promo?.id)}
                      className="flex items-center justify-center w-7 h-7 shrink-0 ml-2"
                      style={{
                        background: applied ? currentTheme.primary : 'transparent',
                        border: `1.5px solid ${applied ? currentTheme.primary : currentTheme.border}`,
                        borderRadius: br,
                        cursor: 'pointer',
                      }}
                    >
                      {applied
                        ? <Check size={12} color={currentTheme.textInverse} />
                        : <Plus size={12} style={{ color: currentTheme.textMuted }} />
                      }
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Coupons ── */}
        <div className="flex flex-col gap-2 min-h-0">

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center justify-center w-7 h-7"
              style={{ background: currentTheme.success + '15', borderRadius: br }}
            >
              <Ticket size={13} style={{ color: currentTheme.success }} />
            </div>
            <p className="text-sm font-bold" style={{ color: currentTheme.text }}>Coupons</p>
            {couponIds.length > 0 && (
              <span
                className="text-xs font-semibold px-2 py-0.5 ml-auto"
                style={{ background: currentTheme.success + '15', color: currentTheme.success, borderRadius: 999 }}
              >
                {couponIds.length} applied
              </span>
            )}
          </div>

          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
            <Input
              type="text"
              placeholder="Search coupons..."
              value={couponSearch}
              onChange={(e) => setCouponSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm"
              style={inputStyle}
            >
                <Search  size={16}/>
            </Input>
          </div>

          <div
            className="flex flex-col overflow-y-auto flex-1 min-h-0  themed-scroll"
            style={{ border: `1px solid ${currentTheme.border}`, borderRadius: br  , '--scroll-color': currentTheme.primary } as React.CSSProperties}
          >
            {couponLoading ? <LoadingState /> : filteredCoupons.length === 0 ? <EmptyState label="coupons" /> : (
              (filteredCoupons || [] ).map((coupon, i) => {
                const applied = couponIds.includes(coupon.id);
                return (
                  <div
                    key={`${coupon?.id}-${i}`}
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{
                      borderTop: i !== 0 ? `1px solid ${currentTheme.border}` : 'none',
                      background: applied ? currentTheme.success + '0d' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="flex items-center justify-center w-7 h-7 shrink-0"
                        style={{
                          background: applied ? currentTheme.success + '20' : currentTheme.bgSecondary,
                          borderRadius: br,
                        }}
                      >
                        <Ticket size={12} style={{ color: applied ? currentTheme.success : currentTheme.textMuted }} />
                      </div>
                      <div className="flex flex-col min-w-0">
                          <span
                            className="text-xs font-black font-mono tracking-wider truncate"
                            style={{ color: currentTheme.text }}
                          >
                            {coupon?.code}
                          </span>
                          <span className="text-[11px] truncate" style={{ color: currentTheme.accent }}>
                            {coupon?.type === 'percentage' ? `${coupon?.value}% off` : `${coupon?.value} MAD off`}
                            <span style={{ color: currentTheme.textMuted }}>
                              {' · '}
                              {coupon?.valid_until
                                ? `Exp ${new Date(coupon?.valid_until).toLocaleDateString('en', { day: '2-digit', month: 'short' })}`
                                : 'No expiry'}
                            </span>
                          </span>
                        </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCoupon(coupon?.id)}
                      className="flex items-center justify-center w-7 h-7 shrink-0 ml-2"
                      style={{
                        background: applied ? currentTheme.success : 'transparent',
                        border: `1.5px solid ${applied ? currentTheme.success : currentTheme.border}`,
                        borderRadius: br,
                        cursor: 'pointer',
                      }}
                    >
                      {applied
                        ? <Check size={12} color={currentTheme.textInverse} />
                        : <Plus size={12} style={{ color: currentTheme.textMuted }} />
                      }
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Applied summary ── */}
      {(appliedPromos.length > 0 || appliedCoupons.length > 0) && (
        <div
          className="p-3 flex flex-wrap gap-2"
          style={{ border: `1px solid ${currentTheme.border}`, background: currentTheme.bgSecondary, borderRadius: br }}
        >
          <p className="w-full text-xs font-bold uppercase tracking-widest mb-1" style={{ color: currentTheme.textMuted }}>
            Applied to this product
          </p>

          {appliedPromos.map(p => (
            <span
              key={p?.id}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1"
              style={{
                background: currentTheme.primary + '15',
                color: currentTheme.primary,
                border: `1px solid ${currentTheme.primary}30`,
                borderRadius: 999,
              }}
            >
              <Tag size={10} />
              {p?.name}
              <button
                type="button"
                onClick={() => togglePromo(p?.id)}
                className="flex items-center justify-center"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentTheme.primary, padding: 0 }}
              >
                <X size={10} />
              </button>
            </span>
          ))}

          {appliedCoupons.map(c => (
            <span
              key={c?.id}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 font-mono"
              style={{
                background: currentTheme.success + '15',
                color: currentTheme.success,
                border: `1px solid ${currentTheme.success}30`,
                borderRadius: 999,
              }}
            >
              <Ticket size={10} />
              {c?.code}
              <button
                type="button"
                onClick={() => toggleCoupon(c?.id)}
                className="flex items-center justify-center"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentTheme.success, padding: 0 }}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

    </div>
  );
}

