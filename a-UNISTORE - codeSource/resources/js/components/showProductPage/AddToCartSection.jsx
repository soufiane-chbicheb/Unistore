import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const AddToCartSection = ({ stock, price, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const { storeCurrency } = usePage().props;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const isOutOfStock = stock === 0;

  return (
    <div className="space-y-4 bg-red-500" >
      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isOutOfStock ? 'bg-red-500' : stock < 10 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        />
        <span
          className={`text-sm ${
            isOutOfStock ? 'text-red-600' : stock < 10 ? 'text-yellow-600' : 'text-green-600'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : stock < 10 ? `Only ${stock} left` : 'In Stock'}
        </span>
      </div>

      {/* Price */}
      <div className="text-3xl font-bold text-gray-900">
        {price.toFixed(2)} {storeCurrency}
      </div>

      {/* Quantity and Add to Cart */}
      {!isOutOfStock && (
        <div className="flex items-center space-x-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= stock}
              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      )}

      {isOutOfStock && (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-md cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
    </div>
  );
};

export default AddToCartSection;
