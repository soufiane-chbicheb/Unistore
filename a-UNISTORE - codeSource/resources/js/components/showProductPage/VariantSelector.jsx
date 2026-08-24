import React from "react";

const VariantSelector = ({
    product,
    variants,
    selectedColor,
    selectedSize,
    selectedMaterial,
    selectedFit,
    onColorChange,
    onSizeChange,
    onMaterialChange,
    onFitChange,
    availableSizes,
    availableMaterials,
    availableFits,
    availableColors,
}) => {


    return (
        <div className="space-y-6">
            {/* Color Selection */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Color
                </h3>
                <div className="flex flex-wrap gap-3">
                    {availableColors.map((color, index) => (
                        <button
                            key={index}
                            onClick={() => onColorChange(color.id)}
                            className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                                selectedColor === color.id
                                    ? "border-gray-900 shadow-lg scale-110"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                            title={color.name}
                        >
                            <span
                                className="absolute inset-1 rounded-full"
                                style={{ backgroundColor: color.hex }}
                            />
                            {selectedColor === color.id && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                                    <span className="w-2 h-2 bg-white rounded-full" />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {availableColors.find((c) => c.id === selectedColor)?.name}
                </p>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Size
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => onSizeChange(size.id)}
                                className={`px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                                    selectedSize === size.id
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Material Selection */}
            {availableMaterials.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Material
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {availableMaterials.map((material) => (
                            <button
                                key={material.id}
                                onClick={() => onMaterialChange(material.id)}
                                className={`px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                                    selectedMaterial === material.id
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                {material.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Fit Selection */}
            {availableFits.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Fit
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {availableFits.map((fit) => (
                            <button
                                key={fit.id}
                                onClick={() => onFitChange(fit.id)}
                                className={`px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${
                                    selectedFit === fit.id
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                {fit.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantSelector;
