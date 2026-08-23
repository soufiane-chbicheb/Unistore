import {
  FolderTree,
  Package,
  Truck,
  Search,
  Users,
  Globe,
  Tag,
} from 'lucide-react';
import { SectionWrapper } from './sectionwrapper';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { HoverInfoLabel } from './HoverInfoLabel';
import { Category } from '@/types/inventoryTypes';
import MultiSelectDropdownForObject, { AllowedObjectsType } from '@/components/ui/MultiSelectDropdownForObject';
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import TagSection from '@/components/TagSection';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import adapters from '@/functions/product/adapters';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import BadgePicker from '../BadgePicker';
import SwitchToggler from '@/components/ui/SwitchToggler';
import { Input } from '@/components/ui/input';
import { ThemedTextarea } from './ThemedInput';
import NotifyUser from '@/components/ui/NotifyUser';

countries.registerLocale(enLocale);
const countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({
  code,
  name,
}));

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const firstVal = (selected: AllowedObjectsType[]) => selected[0]?.value ?? '';

export function RightSectionComponent() {
  const { watch, register, control, setValue, formState: { errors } , shipping_class = []} = useProductDataCtx();
  const { state: { currentTheme } } = useAdminThemeCtx()
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  const category = watch('category_niche_id');
  const sub_categories = watch('sub_categories');
 
  const tags = watch('tags');
  const madeCountry = watch('madeCountry');
  const releaseDate = watch('releaseDate');
  const inventory = watch('inventory');
  const shipping = watch('shipping');
  const meta = watch('meta');
  const vendor = watch('vendor');
  
  useEffect(() => {
    register('sub_categories');
    register('madeCountry');
    register('releaseDate');
    register('inventory.backorderOptions');
    register('inventory.stockStatus');
    register('inventory.weightUnit');
    register('inventory.dimensions.unit');
    register('inventory.fulfillmentType');
    register('shipping.shippingClass');
    register('shipping.returnWindow');
    register('shipping.returnPolicy');
  }, [register]);

  useEffect(() => {
    if (!category) return;
    setValue('sub_categories', []);
    const getSubCategories = async () => {
      try {
        const res = await axios.get(route('get.sub_categories'), {
          params: { 'parent_id': category }
        })
        setSubCategories(res.data)
      } catch (err: any) {
        throw err;
      }
    }
    getSubCategories();
  }, [category]);

  const { toSelectOptionAdapter, toSetterAdapter } = adapters()

  return (
    <div className="w-full lg:w-[35%] space-y-6 py-8 pr-4">

      <SectionWrapper icon={Tag} title='Pick A Gadge'>
        <BadgePicker currentTheme={currentTheme} />
      </SectionWrapper>

      {/* Subcategories */}
      <SectionWrapper title="Subcategories" icon={FolderTree}>
        <div>
          <HoverInfoLabel
            htmlFor="subcategory"
            label="Category"
            tooltip="Select the subcategory this product belongs to"
          />
          <MultiSelectDropdownForObject
            label="Select categories"
            options={subCategories.map(c => ({ label: c.name, value: c.id }))}
            selectedValues={(sub_categories || []).map(c => toSelectOptionAdapter(c)) ?? []}
            onChange={(selected) => setValue('sub_categories', selected.map(item => toSetterAdapter(item)) as Category[], { shouldValidate: true })}
          />
          {errors.sub_categories && (
            <p className="text-red-500 text-xs mt-1">{errors.sub_categories.message as string}</p>
          )}
          {
            (!category && (sub_categories || []).length < 1) ? 
            <NotifyUser message="choose a niche category first" />
            :
            null 
          }
        </div>
      </SectionWrapper>

      {/* Tags */}
      <SectionWrapper title="Tags / Keywords" icon={Tag}>
        <div>
          
          <HoverInfoLabel
            htmlFor="tags / keywords"
            label="tags / keywords"
            tooltip="Add Tags And Keywords for this product this would helps to show related products"
          />
          <div>
            <TagSection tags={tags ?? []} />
          </div>
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags.message as string}</p>
          )}
        </div>
      </SectionWrapper>

      {/* Made Country & Release Date */}
      <SectionWrapper title="Made Country & Release Date" icon={Globe}>
        <HoverInfoLabel
          htmlFor="country of origin"
          label="country of origin"
          tooltip="made origin country of the product (optional)"
        />
        <MultiSelectDropdownForObject
          multiple={false}
          label="country of origin"
          options={countryList.map((c) => ({ label: c.name, value: c.code }))}
          selectedValues={madeCountry ? [{ label: countryList.find(c => c.code === madeCountry)?.name ?? madeCountry, value: madeCountry }] : []}
          onChange={(selected) => setValue('madeCountry', firstVal(selected) as string, { shouldValidate: true })}
        />
        {errors.madeCountry && (
          <p className="text-red-500 text-xs mt-1">{errors.madeCountry.message as string}</p>
        )}

        <HoverInfoLabel
          htmlFor="Release Date"
          label="Release Date"
          tooltip="add a release year for this product (optional)"
        />
        <MultiSelectDropdownForObject
          multiple={false}
          label="release year"
          options={years.map(y => ({ label: String(y), value: y }))}
          selectedValues={releaseDate ? [{ label: String(releaseDate), value: releaseDate }] : []}
          onChange={(selected) => setValue('releaseDate', firstVal(selected) as string, { shouldValidate: true })}
        />
        {errors.releaseDate && (
          <p className="text-red-500 text-xs mt-1">{errors.releaseDate.message as string}</p>
        )}
      </SectionWrapper>

      {/* Inventory */}
      <SectionWrapper title="Inventory / Stock" icon={Package}>

        {/* Track Inventory */}
        <div className="flex items-center justify-between">
          <HoverInfoLabel
            htmlFor="trackInventory"
            label="Track Inventory"
            tooltip="Automatically update stock when orders are placed"
          />
          <SwitchToggler
            id="trackInventory"
            checked={inventory?.trackInventory ?? false}
            onChange={(val : boolean) => setValue('inventory', { ...inventory, trackInventory: !!val }, { shouldValidate: true })}
          />
          {errors.inventory?.trackInventory && (
            <p className="text-red-500 text-xs mt-1">{errors.inventory.trackInventory.message as string}</p>
          )}
        </div>

        {/* Backorder Options */}
        <div>
          <HoverInfoLabel
            htmlFor="backorderOptions"
            label="Backorder Options"
            tooltip="Allow customers to buy even when out of stock"
          />
          <MultiSelectDropdownForObject
            multiple={false}
            label="backorder options"
            options={[
              { label: 'Deny', value: 'deny' },
              { label: 'Allow, but notify customer', value: 'notify' },
              { label: 'Allow', value: 'allow' },
            ]}
            selectedValues={inventory?.backorderOptions
              ? [{ label: inventory.backorderOptions, value: inventory.backorderOptions }]
              : []}
            onChange={(selected) => setValue('inventory', { ...inventory, backorderOptions: firstVal(selected) as 'notify' | 'allow' }, { shouldValidate: true })}
          />
          {errors.inventory?.backorderOptions && (
            <p className="text-red-500 text-xs mt-1">{errors.inventory.backorderOptions.message as string}</p>
          )}
        </div>

        {/* Low Stock Threshold */}
        <div>
          <HoverInfoLabel
            htmlFor="lowStockThreshold"
            label="Low Stock Threshold"
            tooltip="Get alerted when stock drops below this number"
          />
          <Input
            id="lowStockThreshold"
            type="number"
            placeholder="e.g. 5"
            value={inventory?.lowStockThreshold ?? ''}
            onChange={(e) => setValue('inventory', { ...inventory, lowStockThreshold: e.target.value === '' ? null : Number(e.target.value) }, { shouldValidate: true })}
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
          />
          {errors.inventory?.lowStockThreshold && (
            <p className="text-red-500 text-xs mt-1">{errors.inventory.lowStockThreshold.message as string}</p>
          )}
        </div>

        {/* Stock Status */}
        <div>
          <HoverInfoLabel
            htmlFor="stockStatus"
            label="Stock Status"
            tooltip="Override the stock status manually"
          />
          <MultiSelectDropdownForObject
            multiple={false}
            label="stock status"
            options={[
              { label: 'In Stock', value: 'in_stock' },
              { label: 'Out of Stock', value: 'out_of_stock' },
              { label: 'Discontinued', value: 'discontinued' },
            ]}
            selectedValues={inventory?.stockStatus
              ? [{ label: inventory.stockStatus.replace('_', ' '), value: inventory.stockStatus }]
              : []}
            onChange={(selected) => setValue('inventory', { ...inventory, stockStatus: firstVal(selected) as 'in_stock' | 'out_of_stock' | 'discontinued' }, { shouldValidate: true })}
          />
          {errors.inventory?.stockStatus && (
            <p className="text-red-500 text-xs mt-1">{errors.inventory.stockStatus.message as string}</p>
          )}
        </div>

        {/* Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <HoverInfoLabel
              htmlFor="weight"
              label="Weight"
              tooltip="Used for shipping cost calculation"
            />
            <Input
              id="weight"
              type="number"
              placeholder="e.g. 1.5"
              value={inventory?.weight ?? ''}
              onChange={(e) => setValue('inventory', { ...inventory, weight: e.target.value === '' ? null : Number(e.target.value) }, { shouldValidate: true })}
              className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
              style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
            />
            {errors.inventory?.weight && (
              <p className="text-red-500 text-xs mt-1">{errors.inventory.weight.message as string}</p>
            )}
          </div>
          <div>
            <HoverInfoLabel htmlFor="weightUnit" label="Unit" tooltip="" />
            <MultiSelectDropdownForObject
              multiple={false}
              label="unit"
              options={[
                { label: 'kg', value: 'kg' },
                { label: 'g', value: 'g' },
                { label: 'lb', value: 'lb' },
                { label: 'oz', value: 'oz' },
              ]}
              selectedValues={[{ label: inventory?.weightUnit ?? 'kg', value: inventory?.weightUnit ?? 'kg' }]}
              onChange={(selected) => setValue('inventory', { ...inventory, weightUnit: firstVal(selected) as 'kg' | 'g' | 'lb' | 'oz' }, { shouldValidate: true })}
            />
            {errors.inventory?.weightUnit && (
              <p className="text-red-500 text-xs mt-1">{errors.inventory.weightUnit.message as string}</p>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <HoverInfoLabel
            htmlFor="dimensions"
            label="Dimensions (L × W × H)"
            tooltip="Package dimensions for shipping"
          />
          <div className="grid grid-cols-3 gap-3">
            {(['length', 'width', 'height'] as const).map((dim) => (
              <div key={dim}>
                <Input
                  type="number"
                  placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
                  value={inventory?.dimensions?.[dim] ?? ''}
                  onChange={(e) => setValue('inventory', {
                    ...inventory,
                    dimensions: {
                      ...inventory?.dimensions,
                      [dim]: e.target.value === '' ? null : Number(e.target.value),
                    }
                  }, { shouldValidate: true })}
                  className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                  style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                />
                {errors.inventory?.dimensions?.[dim] && (
                  <p className="text-red-500 text-xs mt-1">{errors.inventory.dimensions[dim]?.message as string}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <MultiSelectDropdownForObject
              multiple={false}
              label="unit"
              options={[
                { label: 'cm', value: 'cm' },
                { label: 'in', value: 'in' },
                { label: 'mm', value: 'mm' },
              ]}
              selectedValues={[{ label: inventory?.dimensions?.unit ?? 'cm', value: inventory?.dimensions?.unit ?? 'cm' }]}
              onChange={(selected) => setValue('inventory', {
                ...inventory,
                dimensions: { ...inventory?.dimensions, unit: firstVal(selected) as 'cm' | 'in' | 'mm' }
              }, { shouldValidate: true })}
            />
            {errors.inventory?.dimensions?.unit && (
              <p className="text-red-500 text-xs mt-1">{errors.inventory.dimensions.unit.message as string}</p>
            )}
          </div>
        </div>

        {/* Warehouse Location */}
        <div>
          <HoverInfoLabel
            htmlFor="warehouseLocation"
            label="Warehouse Location"
            tooltip="Shelf or bin code for physical inventory tracking"
          />
          <Input
            id="warehouseLocation"
            type="text"
            placeholder="e.g. A3-B12"
            value={inventory?.warehouseLocation ?? ''}
            onChange={(e) => setValue('inventory', { ...inventory, warehouseLocation: e.target.value }, { shouldValidate: true })}
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
          />
          {errors.inventory?.warehouseLocation && (
            <p className="text-red-500 text-xs mt-1">{errors.inventory.warehouseLocation.message as string}</p>
          )}
        </div>

        {/* Fulfillment Type */}
        <div>
          <HoverInfoLabel
            htmlFor="fulfillmentType"
            label="Fulfillment Type"
            tooltip="Who handles the storage and shipping of this product"
          />
          <MultiSelectDropdownForObject
            multiple={false}
            label="fulfillment type"
            options={[
              { label: 'In-House (Own Stock)', value: 'in_house' },
              { label: 'Dropship',             value: 'dropship' },
              { label: 'Third Party (3PL)',     value: 'third_party' },
            ]}
            selectedValues={inventory?.fulfillmentType
              ? [{ label: inventory.fulfillmentType, value: inventory.fulfillmentType }]
              : []}
            onChange={(selected) => setValue('inventory', { ...inventory, fulfillmentType: firstVal(selected) as string }, { shouldValidate: true })}
          />
          {errors.inventory?.fulfillmentType && (
            <p className="text-red-500 text-xs mt-1">{errors.inventory.fulfillmentType.message as string}</p>
          )}
        </div>

      </SectionWrapper>

      {/* Shipping */}
      <SectionWrapper title="Shipping" icon={Truck}>

        {/* Shipping Class */}
        <div>
          <HoverInfoLabel
            htmlFor="shippingClass"
            label="Shipping Class"
            tooltip="Delivery speed for this product"
          />
          <MultiSelectDropdownForObject
            multiple={false}
            label="shipping class"
            options={shipping_class}
            selectedValues={shipping?.shippingClass
              ? [{ label: shipping.shippingClass, value: shipping.shippingClass }]
              : []}
            onChange={(selected) => setValue('shipping', { ...shipping, shippingClass: firstVal(selected) as string }, { shouldValidate: true })}
          />
          {errors.shipping?.shippingClass && (
            <p className="text-red-500 text-xs mt-1">{errors.shipping.shippingClass.message as string}</p>
          )}
        </div>
        {/* Shipping Cost Override */}
        <div>
          <HoverInfoLabel
            htmlFor="shippingCostOverride"
            label="Shipping Cost Override"
            tooltip="Set a fixed shipping price for this product, leave empty to use global rules"
          />
          <Input
            type="number"
            id="shippingCostOverride"
            value={shipping?.shippingCostOverride ?? ''}
            onChange={(e) => setValue('shipping', {
              ...shipping,
              shippingCostOverride: e.target.value === '' ? null : Number(e.target.value)
            }, { shouldValidate: true })}
            placeholder="Leave empty for default"
          />
          {errors.shipping?.shippingCostOverride && (
            <p className="text-red-500 text-xs mt-1">{errors.shipping.shippingCostOverride.message as string}</p>
          )}
        </div>

        {/* Is Returnable */}
        <div className="flex items-center justify-between">
          <HoverInfoLabel
            htmlFor="isReturnable"
            label="Returnable"
            tooltip="Can this product be returned"
          />
          <SwitchToggler
            id="isReturnable"
            checked={shipping?.isReturnable ?? true}
            onChange={(val) => setValue('shipping', { ...shipping, isReturnable: val }, { shouldValidate: true })}
          />
          {errors.shipping?.isReturnable && (
            <p className="text-red-500 text-xs mt-1">{errors.shipping.isReturnable.message as string}</p>
          )}
        </div>

        {/* Return Window + Policy — only show if returnable */}
        {shipping?.isReturnable && (
          <>
            <div>
              <HoverInfoLabel
                htmlFor="returnWindow"
                label="Return Window (days)"
                tooltip="How many days the customer has to return the product"
              />
              <MultiSelectDropdownForObject
                multiple={false}
                label="return window"
                options={[
                  { label: '7 days', value: 7 },
                  { label: '14 days', value: 14 },
                  { label: '30 days', value: 30 },
                ]}
                selectedValues={shipping?.returnWindow
                  ? [{ label: `${shipping.returnWindow} days`, value: shipping.returnWindow }]
                  : []}
                onChange={(selected) => setValue('shipping', { ...shipping, returnWindow: Number(firstVal(selected)) }, { shouldValidate: true })}
              />
              {errors.shipping?.returnWindow && (
                <p className="text-red-500 text-xs mt-1">{errors.shipping.returnWindow.message as string}</p>
              )}
            </div>

            <div>
              <HoverInfoLabel
                htmlFor="returnPolicy"
                label="Return Policy"
                tooltip="Who pays for the return shipping"
              />
              <MultiSelectDropdownForObject
                multiple={false}
                label="return policy"
                options={[
                  { label: 'Free Return', value: 'free_return' },
                  { label: 'Customer Pays', value: 'customer_pays' },
                ]}
                selectedValues={shipping?.returnPolicy
                  ? [{ label: shipping.returnPolicy === 'free_return' ? 'Free Return' : 'Customer Pays', value: shipping.returnPolicy }]
                  : []}
                onChange={(selected) => setValue('shipping', { ...shipping, returnPolicy: firstVal(selected) as string }, { shouldValidate: true })}
              />
              {errors.shipping?.returnPolicy && (
                <p className="text-red-500 text-xs mt-1">{errors.shipping.returnPolicy.message as string}</p>
              )}
            </div>
          </>
        )}

      </SectionWrapper>

      {/* SEO */}
      <SectionWrapper title="SEO" icon={Search}>
        <div>
          <HoverInfoLabel htmlFor="metaTitle" label="Meta Title" tooltip="Title used in search engines" />
          <Input
            type="text"
            id="metaTitle"
            value={meta?.metaTitle || ''}
            onChange={(e) => setValue('meta', { ...meta, metaTitle: e.target.value }, { shouldValidate: true })}
            placeholder="Product Name - Brand"
            maxLength={60}
          />
          {errors.meta?.metaTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.meta.metaTitle.message as string}</p>
          )}
        </div>

        <div>
          <HoverInfoLabel htmlFor="metaDescription" label="Meta Description" tooltip="Short summary shown in search results" />
          <ThemedTextarea
            id="metaDescription"
            value={meta?.metaDescription || ''}
            onChange={(e) => setValue('meta', { ...meta, metaDescription: e.target.value }, { shouldValidate: true })}
            placeholder="Brief product description for search results..."
            rows={3}
            maxLength={160}
          />
          {errors.meta?.metaDescription && (
            <p className="text-red-500 text-xs mt-1">{errors.meta.metaDescription.message as string}</p>
          )}
        </div>
      </SectionWrapper>

      {/* Vendor */}
      <SectionWrapper title="Vendor / Supplier Info" icon={Users}>
        <div>
          <HoverInfoLabel htmlFor="vendorName" label="Vendor Name" tooltip="Supplier or vendor of this product" />
          <Input
            type="text"
            id="vendorName"
            value={vendor?.vendorName || ''}
            onChange={(e) => setValue('vendor', { ...vendor, vendorName: e.target.value }, { shouldValidate: true })}
            placeholder="Supplier Co."
          />
          {errors.vendor?.vendorName && (
            <p className="text-red-500 text-xs mt-1">{errors.vendor.vendorName.message as string}</p>
          )}
        </div>

        {/* Vendor SKU — was missing entirely, added from schema */}
        <div>
          <HoverInfoLabel htmlFor="vendorSku" label="Vendor SKU" tooltip="The SKU reference from your supplier" />
          <Input
            type="text"
            id="vendorSku"
            value={vendor?.vendorSku || ''}
            onChange={(e) => setValue('vendor', { ...vendor, vendorSku: e.target.value }, { shouldValidate: true })}
            placeholder="e.g. SUP-12345"
          />
          {errors.vendor?.vendorSku && (
            <p className="text-red-500 text-xs mt-1">{errors.vendor.vendorSku.message as string}</p>
          )}
        </div>

        <div>
          <HoverInfoLabel htmlFor="vendorNotes" label="Optional Notes" tooltip="Additional notes about this vendor or product" />
          <ThemedTextarea
            id="vendorNotes"
            value={vendor?.vendorNotes || ''}
            onChange={(e) => setValue('vendor', { ...vendor, vendorNotes: e.target.value }, { shouldValidate: true })}
            placeholder="Additional vendor information..."
            rows={3}
          />
          {errors.vendor?.vendorNotes && (
            <p className="text-red-500 text-xs mt-1">{errors.vendor.vendorNotes.message as string}</p>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}

