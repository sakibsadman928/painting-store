import React, { useState } from 'react';

export default function Footer() {
    const [imageError, setImageError] = useState(false);

    return (
        <footer className="w-full bg-gradient-to-b from-[#e8d5ff] to-[#f5f0ff] text-gray-800 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-3">
                    {!imageError ? (
                        <img 
                            alt="Palette Play Logo" 
                            className="h-8" 
                            src="/art_15353520.png"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                        />
                    ) : (
                        <div className="h-8 w-8 bg-[#bb86fc] rounded flex items-center justify-center text-white font-bold text-sm">
                            PP
                        </div>
                    )}
                    <span className="text-xl font-bold text-[#6b46c1]">Palette Play</span>
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    Make walls speak with our premium paint collection. Transform your space with colors that inspire.
                </p>
            </div>
            <div className="border-t border-[#bb86fc]/20">
                <div className="max-w-7xl mx-auto px-6 py-3 text-center text-sm font-normal">
                    Palette Play ©2025. All rights reserved.
                </div>
            </div>
        </footer>
    );
};