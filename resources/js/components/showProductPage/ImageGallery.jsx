import React, { useState, useEffect } from "react";
const ImageGallery = ({ images, product, productName }) => {
    const [selectedImage, setSelectedImage] = useState(product?.thumbnail);

    useEffect(() => {
    //     setSelectedImage(0);
    console.log(images);
    }, [images]);
    const backendURl = 'http://localhost:8000/'
    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={`${backendURl}${selectedImage}`}
                    alt={productName}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                selectedImage === index
                                    ? "border-blue-500 shadow-md"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <img
                                src={`${backendURl}${image[0].path}`}
                                alt={`${productName} view ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
