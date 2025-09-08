import React from 'react';

export default function AffiliateProductCard({ product }) {
  const { title, image, price, link } = product;

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-4 w-64 transition-transform hover:scale-105">
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-contain mb-4 rounded"
      />
      <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
      <p className="text-indigo-600 font-bold mt-2">{price}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold"
      >
        Buy on Amazon
      </a>
    </div>
  );
}
