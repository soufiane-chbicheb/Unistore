import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Link, usePage } from '@inertiajs/react';

/**
 * Product card component with hover effects and quick actions
 * Supports multiple variants for different layout contexts
 */
export const ProductCard= ({ 
  product, 
  variant = 'default' 
}) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const { storeCurrency } = usePage().props;
  // const { state, dispatch } = useCart();
  // const isInCart = state.cartItems.some(item => item.product.id === product.id);

  // Handle adding/removing from wishlist
  // Handle adding to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1 }
    });
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Variant-specific styles
  const cardStyles = {
    default: 'rounded-xl overflow-hidden',
    compact: 'rounded-lg overflow-hidden',
    featured: 'rounded-2xl overflow-hidden'
  };

  return (
      // <motion.div
      //   initial={{ opacity: 0, y: 20 }}
      //   animate={{ opacity: 1, y: 0 }}
      //   whileHover={{ y: -5 }}
      //   transition={{ duration: 0.3 }}
      //   className="group relative"
      // >
      // instale motion and replace this div
      <div className="group relative">
          <Link href={`/products/${product.id}`} className="block">
              <div 
                style={{ 
                  backgroundColor: theme.card, 
                  borderColor: theme.border,
                  boxShadow: theme.shadow
                }}
                className={`${cardStyles[variant]} border transition-all duration-300`}
              >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-square">
                      <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                          <div 
                            style={{ backgroundColor: theme.error, color: theme.textInverse }}
                            className="absolute top-3 left-3 px-2 py-1 rounded-lg text-sm font-medium"
                          >
                              -{discountPercentage}%
                          </div>
                      )}

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 space-x-2">
                              <button
                                  style={{ 
                                    backgroundColor: theme.card, 
                                    color: theme.textSecondary 
                                  }}
                                  className="p-2 rounded-full transition-colors hover:text-red-500"
                              >
                                  <Heart
                                      size={20}
                                      fill="none"
                                  />
                              </button>

                              <button 
                                style={{ 
                                  backgroundColor: theme.card, 
                                  color: theme.textSecondary 
                                }}
                                className="p-2 rounded-full transition-colors hover:opacity-80"
                              >
                                  <Eye size={20} />
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                          <h3 
                            style={{ color: theme.text }}
                            className="font-semibold line-clamp-2 transition-colors group-hover:opacity-80"
                          >
                              {product.name}
                          </h3>
                          <div className="flex items-center ml-2">
                              <Star
                                  size={16}
                                  style={{ color: theme.starColor || '#fbbf24' }}
                                  className="fill-current"
                              />
                              <span style={{ color: theme.textSecondary }} className="text-sm ml-1">
                                  {product.rating}
                              </span>
                          </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-2">
                          <span style={{ color: theme.primary }} className="text-lg font-bold">
                              {product.price.toFixed(2)} {storeCurrency}
                          </span>
                          {product.originalPrice && (
                              <span style={{ color: theme.textMuted }} className="text-sm line-through">
                                  {product.originalPrice.toFixed(2)} {storeCurrency}
                              </span>
                          )}
                      </div>

                      {/* Additional Info */}
                      <div style={{ color: theme.textMuted }} className="flex items-center justify-between text-sm mb-3">
                          <span>{product.reviews} reviews</span>
                          <span>In Stock</span>
                      </div>

                      {/* Seller */}
                      <p className="text-sm text-gray-600 mb-3">
                          Sold by{" some one"}
                          <span className="text-blue-600 font-medium">
                              {/* {product.seller} */}
                          </span>
                      </p>

                      {/* Add to Cart Button */}
                      <button
                          style={{ 
                            backgroundColor: theme.primary, 
                            color: theme.textInverse,
                            borderRadius: theme.borderRadius 
                          }}
                          className="w-full py-2 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                          <ShoppingCart size={16} />
                          Add to Cart
                      </button>
                  </div>
              </div>
          </Link>
      </div>
      // </motion.div>
  );
};
