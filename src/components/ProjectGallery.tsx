import { useState, useRef, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface GalleryImage {
  src: string | { src: string; width: number; height: number; format: string };
  alt: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  title?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showThumbnails?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'full' | number; // Support both preset and numeric sizing
}

/**
 * Advanced React image carousel component with swipe support, autoplay, 
 * thumbnails, keyboard navigation, and accessibility features.
 */
export default function ProjectGallery({
  images,
  autoplay = false,
  autoplayInterval = 3000,
  showThumbnails = true,
  showIndicators = true,
  loop = true,
  className = '',
  size = 'medium',
}: ProjectGalleryProps) {
  // Helper function to extract src string from image object
  const getImageSrc = (src: string | { src: string; width: number; height: number; format: string }): string => {
    if (typeof src === 'string') {
      return src;
    }
    // Handle Astro image objects
    if (src && typeof src === 'object' && 'src' in src) {
      return src.src;
    }
    // Fallback
    return String(src);
  };

  /**
   * Calculate gallery container styling based on size prop
   * @param size - Either a preset size string or a numeric pixel width
   * @returns Object with className and style properties
   */
  const getGallerySize = (size: 'small' | 'medium' | 'large' | 'full' | number) => {
    if (typeof size === 'number') {
      return {
        className: 'mx-auto',
        style: { maxWidth: `${size}px` }
      };
    }
    
    // Preset size mappings
    const sizeMap = {
      small: { className: 'max-w-md mx-auto', style: {} },
      medium: { className: 'max-w-2xl mx-auto', style: {} },
      large: { className: 'max-w-4xl mx-auto', style: {} },
      full: { className: 'w-full', style: {} }
    };
    
    return sizeMap[size] || sizeMap.medium;
  };

  const gallerySize = getGallerySize(size);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simple CSS injection for proper slide behavior
  useEffect(() => {
    const styleId = 'project-gallery-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .project-gallery .main-carousel .keen-slider__slide {
          min-width: 100% !important;
          flex-shrink: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Main slider
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop,
    slides: { 
      perView: 1, 
      spacing: 0
    },
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    destroyed() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
  });

  // Thumbnail slider
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 4,
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 6, spacing: 15 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 8, spacing: 15 },
      },
    },
  });

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && instanceRef.current) {
      intervalRef.current = setInterval(() => {
        instanceRef.current?.next();
      }, autoplayInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoplayInterval, instanceRef]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!instanceRef.current) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          instanceRef.current.prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          instanceRef.current.next();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'Home':
          e.preventDefault();
          instanceRef.current.moveToIdx(0);
          break;
        case 'End':
          e.preventDefault();
          instanceRef.current.moveToIdx(images.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [instanceRef, isPlaying, images.length]);

  const goToSlide = (idx: number) => {
    instanceRef.current?.moveToIdx(idx);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-base-200 rounded-xl">
        <p className="text-base-content/60">No images to display</p>
      </div>
    );
  }

  return (
    <div 
      className={`project-gallery ${gallerySize.className} ${className}`} 
      style={gallerySize.style}
      role="region" 
      aria-label="Project image gallery"
    >
      {/* Main carousel */}
      <div className="relative group">
        <div 
          ref={sliderRef} 
          className="keen-slider main-carousel rounded-xl overflow-hidden shadow-lg"
        >
          {images.map((image, idx) => (
            <div 
              key={idx} 
              className="keen-slider__slide relative"
            >
              <img
                src={getImageSrc(image.src)}
                alt={image.alt}
                className="w-full h-auto object-cover block"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {loaded && instanceRef.current && images.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 bg-base-100/80 border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 bg-base-100/80 border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Play/Pause button */}
        {autoplay && loaded && (
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100/80 border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && loaded && images.length > 1 && (
        <div className="flex justify-center mt-4 gap-2" role="tablist" aria-label="Image indicators">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'bg-primary scale-110'
                  : 'bg-base-content/30 hover:bg-base-content/50'
              }`}
              role="tab"
              aria-selected={idx === currentSlide}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && loaded && images.length > 1 && (
        <div className="mt-4">
          <div ref={thumbnailRef} className="keen-slider thumbnail-carousel">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="keen-slider__slide cursor-pointer"
                onClick={() => goToSlide(idx)}
              >
                <img
                  src={getImageSrc(image.src)}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-full h-16 object-cover rounded-lg transition-all duration-300 ${
                    idx === currentSlide
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery info */}
      <div className="flex justify-between items-center mt-2 text-sm text-base-content/60">
        <span>{currentSlide + 1} of {images.length}</span>
        {autoplay && (
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`} />
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <details className="mt-2">
        <summary className="text-xs text-base-content/50 cursor-pointer hover:text-base-content/70">
          Keyboard shortcuts
        </summary>
        <div className="text-xs text-base-content/60 mt-1">
          <p>← → : Navigate | Space: Play/Pause | Home/End: First/Last image</p>
        </div>
      </details>
    </div>
  );
}
