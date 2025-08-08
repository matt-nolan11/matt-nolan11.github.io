/**
 * ProjectGallery - Responsive image carousel component
 * 
 * Features:
 * - Responsive height calculation based on actual container width
 * - Image optimization with WebP support for Astro assets
 * - Swipe navigation, autoplay, thumbnails, keyboard controls
 * - Accessibility features and proper loading behavior
 * - Mobile-responsive design with optimized performance
 */

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface GalleryImage {
  src: string | { src: string; width?: number; height?: number; format?: string };
  alt?: string; // Made optional - will fallback to caption if not provided
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showThumbnails?: boolean;
  loop?: boolean;
  className?: string;
}

/**
 * ProjectGallery - Responsive image carousel with optimized loading
 * 
 * Features: Swipe navigation, autoplay, thumbnails, keyboard controls,
 * responsive sizing, image optimization, and accessibility support.
 */
export default function ProjectGallery({
  images,
  autoplay = false,
  autoplayInterval = 3000,
  showThumbnails = true,
  loop = true,
  className = '',
}: ProjectGalleryProps) {
  /**
   * Calculate optimal gallery height based on the shortest image in the collection
   * @param images - Array of gallery images with potential width/height metadata
   * @param galleryWidth - Target width of the gallery (actual display width)
   * @returns Calculated height in pixels
   */
  const calculateOptimalHeight = (images: GalleryImage[], galleryWidth: number): number => {
    const scaledHeights: number[] = [];
    
    // Scale all images to fit the gallery width and find the shortest
    for (const image of images) {
      // Check if we have Astro image metadata with dimensions
      if (typeof image.src === 'object' && image.src.width && image.src.height) {
        // Scale this image to fit the gallery width and calculate its height
        const aspectRatio = image.src.width / image.src.height;
        const scaledHeight = galleryWidth / aspectRatio;
        scaledHeights.push(scaledHeight);
      }
    }
    
    // Use the shortest scaled image height (if we have any)
    if (scaledHeights.length > 0) {
      return Math.round(Math.min(...scaledHeights));
    }
    
    // Fallback: use standard aspect ratio
    return Math.round(galleryWidth * 0.6); // 3:5 aspect ratio fallback
  };

  /**
   * Calculate gallery container styling based on size prop
   * @param size - Either a preset size string or a numeric pixel width
   * @returns Object with className and style properties
   */

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMobile, setIsMobile] = useState(false);
  const [calculatedHeight, setCalculatedHeight] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userInteractionRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const autoplayIntervalRef = useRef(autoplayInterval);

  // Function to calculate height based on actual container width
  const updateCalculatedHeight = useCallback(() => {
    if (containerRef.current) {
      const actualWidth = containerRef.current.offsetWidth;
      if (actualWidth > 0) {
        const height = calculateOptimalHeight(images, actualWidth);
        setCalculatedHeight(height);
        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    }
  }, [images, isInitialized]);

  // Update height when container changes
  useEffect(() => {
    updateCalculatedHeight();
  }, [updateCalculatedHeight]);

  // Calculate height immediately on mount to prevent layout shift
  useLayoutEffect(() => {
    if (containerRef.current) {
      updateCalculatedHeight();
      
      // Also try again after a small delay to catch any CSS layout settling
      const timeoutId = setTimeout(() => {
        updateCalculatedHeight();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [updateCalculatedHeight]);

  // Function to get initial height estimation
  const getInitialHeight = useCallback(() => {
    if (calculatedHeight) return calculatedHeight;
    
    // Fallback calculation for initial render - use a reasonable default
    let estimatedWidth = 700;
    
    // On mobile, use screen width minus padding
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      estimatedWidth = Math.min(estimatedWidth, window.innerWidth - 32);
    }
    
    return calculateOptimalHeight(images, estimatedWidth);
  }, [calculatedHeight, images]);

  // Detect mobile screens and update layout on resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 640);
      
      // Debounce height calculation during resize
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateCalculatedHeight();
      }, 150);
    };

    // Check on mount
    if (typeof window !== 'undefined') {
      updateLayout();
      window.addEventListener('resize', updateLayout);
      return () => {
        window.removeEventListener('resize', updateLayout);
        clearTimeout(timeoutId);
      };
    }
  }, [updateCalculatedHeight]); // Re-run when update function changes

  // ResizeObserver to track container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          // Container size changed, update height calculation
          updateCalculatedHeight();
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCalculatedHeight]);

  // Keep refs in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    autoplayIntervalRef.current = autoplayInterval;
  }, [autoplayInterval]);

  // Helper function to clear and set autoplay interval
  const setAutoplayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (autoplay && isPlaying) {
      const intervalMs = autoplayIntervalRef.current;
      intervalRef.current = setInterval(() => {
        if (instanceRef.current?.track?.details) {
          instanceRef.current.next();
        }
      }, intervalMs);
    }
  }, [autoplay, isPlaying]);

  // Helper function to reset autoplay timer
  const resetAutoplayTimer = useCallback(() => {
    if (autoplay && isPlaying) {
      setAutoplayInterval();
    }
  }, [autoplay, isPlaying, setAutoplayInterval]);

  // Helper function to start autoplay
  const startAutoplay = useCallback(() => {
    if (autoplay) {
      setIsPlaying(true);
      // Let the effect handle the interval setup
    }
  }, [autoplay]);

  // Helper function to restore autoplay after user interaction
  const restoreAutoplayIfNeeded = useCallback((wasPlaying: boolean) => {
    if (wasPlaying) {
      setTimeout(() => {
        resetAutoplayTimer(); // Reset the timer to give users a full interval
      }, 100);
    }
  }, [resetAutoplayTimer]);

  // Helper function to clear focus from active element
  const clearFocus = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  // Main slider with proper configuration
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop,
    slides: { 
      perView: 1,
      spacing: 0
    },
    mode: "snap",
    renderMode: "precision",
    defaultAnimation: {
      duration: 800
    },
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      const newSlide = slider.track.details.rel;
      setCurrentSlide(newSlide);
      
      // If this was a user interaction (touch swipe), reset autoplay timer
      if (userInteractionRef.current && autoplay && isPlayingRef.current) {
        userInteractionRef.current = false; // Reset the flag
        resetAutoplayTimer();
      }
    },
    dragStarted() {
      // Mark that user is interacting with the slider
      userInteractionRef.current = true;
    },
    destroyed() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
  });

  // Autoplay functionality
  useEffect(() => {
    if (!loaded || !instanceRef.current) return;

    setAutoplayInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, autoplayInterval, loaded, autoplay, setAutoplayInterval]);

  // Visibility observer to pause/resume when scrolled out of view
  useEffect(() => {
    if (!containerRef.current || !instanceRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            // Component is visible, reinitialize if needed
            setTimeout(() => {
              if (instanceRef.current && instanceRef.current.track?.details) {
                instanceRef.current.update();
                if (autoplay) startAutoplay();
              }
            }, 100);
          } else if (autoplay) {
            // Component is not visible, pause autoplay
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loaded, autoplay, startAutoplay]);

  // Pause autoplay when document/tab is hidden; resume when visible
  useEffect(() => {
    if (!autoplay) return;
    const onVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else {
        startAutoplay();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [autoplay, startAutoplay]);

  // Listen for tab changes to reinitialize the slider
  useEffect(() => {
    const handleTabChange = () => {
      if (instanceRef.current && containerRef.current) {
        // Give the DOM time to update after tab change
        setTimeout(() => {
          if (instanceRef.current && instanceRef.current.track?.details) {
            instanceRef.current.update();
            // Reset to first slide when tab becomes active
            instanceRef.current.moveToIdx(0, true);
            setCurrentSlide(0);
          }
        }, 100);
      }
    };

    window.addEventListener('versionTabChanged', handleTabChange);
    
    return () => {
      window.removeEventListener('versionTabChanged', handleTabChange);
    };
  }, [loaded]);

  const goToSlide = useCallback((idx: number) => {
    if (!instanceRef.current || !loaded || !instanceRef.current.track?.details) return;
    if (idx < 0 || idx >= images.length) return;
    
    clearFocus();
    const wasAutoplayActive = autoplay && isPlaying;
    
    instanceRef.current.moveToIdx(idx);
    setCurrentSlide(idx);
    
    restoreAutoplayIfNeeded(wasAutoplayActive);
  }, [loaded, images.length, isPlaying, autoplay, clearFocus, restoreAutoplayIfNeeded]);

  const handleNext = useCallback(() => {
    if (!instanceRef.current || !loaded || !instanceRef.current.track?.details) return;
    
    clearFocus();
    const wasAutoplayActive = autoplay && isPlaying;
    
    instanceRef.current.next();
    restoreAutoplayIfNeeded(wasAutoplayActive);
  }, [loaded, isPlaying, autoplay, clearFocus, restoreAutoplayIfNeeded]);

  const handlePrev = useCallback(() => {
    if (!instanceRef.current || !loaded || !instanceRef.current.track?.details) return;
    
    clearFocus();
    const wasAutoplayActive = autoplay && isPlaying;
    
    instanceRef.current.prev();
    restoreAutoplayIfNeeded(wasAutoplayActive);
  }, [loaded, isPlaying, autoplay, clearFocus, restoreAutoplayIfNeeded]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!instanceRef.current || !loaded || !instanceRef.current.track?.details) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(images.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loaded, isPlaying, images.length, handlePrev, handleNext, goToSlide]);

  // Enhanced image optimization with realistic fallback support
  const createOptimizedImage = (src: string | { src: string; width?: number; height?: number; format?: string }, width: number, quality: number = 80): { 
    src: string; 
    srcSet?: string; 
    sizes?: string; 
  } => {
    // Handle Astro raw image objects (from content collections)
    if (typeof src === 'object' && src.src) {
      const astroSrc = src.src;
      
      // If it's a raw Astro object, we need to optimize it manually by creating an optimized URL
      if (astroSrc.includes('/@fs/') && astroSrc.includes('?orig')) {
        // Extract the base path and create an optimized version
        const baseUrl = astroSrc.split('?')[0];
        const optimizedUrl = `/_image?href=${encodeURIComponent(astroSrc)}&w=${width}&h=${Math.round((width * (src.height || 600)) / (src.width || 800))}&q=${quality}&f=webp`;
        return { src: optimizedUrl };
      }
      
      // Already optimized Astro URL
      return { src: src.src };
    }
    
    const baseSrc = typeof src === 'string' ? src : src.src;
    
    // Check if the image is already optimized (contains _image in path or is webp)
    if (baseSrc.includes('/_image') || baseSrc.includes('.webp')) {
      return { src: baseSrc };
    }
    
    // For regular images, provide responsive sizing hints
    const sizes = width <= 400 ? '(max-width: 768px) 100vw, 400px' : 
                 width <= 800 ? '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px' :
                 '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px';
    
    return {
      src: baseSrc,
      sizes
    };
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
      ref={containerRef}
      className={`project-gallery ${className}`} 
      style={{ width: '100%' }} // Always use full width of column
      role="region" 
      aria-label="Project image gallery"
    >
      {/* Main carousel */}
      <div className="relative group">
        <div 
          ref={sliderRef} 
          className={`keen-slider main-carousel rounded-xl overflow-hidden shadow-lg ${
            isInitialized ? 'transition-[height] duration-200 ease-out' : ''
          }`}
          style={{ 
            height: `${calculatedHeight || getInitialHeight()}px`,
            opacity: loaded ? 1 : 0,
            transition: loaded ? 'opacity 0.3s ease-in-out' : 'none'
          }}
        >
          {images.map((image, idx) => {
            const optimizedImage = createOptimizedImage(image.src, 800, 80);
            return (
            <div 
              key={idx} 
              className="keen-slider__slide relative"
            >
              <img
                src={optimizedImage.src}
                srcSet={optimizedImage.srcSet}
                sizes={optimizedImage.sizes}
                alt={image.alt || image.caption || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover block"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-0">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && loaded && instanceRef.current && (
          <>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handlePrev();
              }}
              className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 bg-base-100/80 border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 bg-base-100/80 border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && loaded && instanceRef.current && (
  <div className="mt-4 overflow-x-auto thumbnails-row">
          <div className="flex gap-3 sm:gap-4 min-w-max thumbnails-row">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="cursor-pointer flex-shrink-0 rounded-lg"
                style={{ width: '64px' }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  goToSlide(idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(idx);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Go to image ${idx + 1}`}
              >
                {(() => {
                  const optimizedThumbnail = createOptimizedImage(image.src, 120, 70);
                  return (
                    <img
                      src={optimizedThumbnail.src}
                      alt={`Thumbnail: ${image.alt || image.caption || `Image ${idx + 1}`}`}
            className={`w-full h-12 sm:h-14 md:h-16 object-cover rounded-lg transition-all duration-300 ${
                        idx === currentSlide
              ? 'ring-2 ring-primary'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      loading="lazy"
                    />
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery info with controls */}
  <div className="flex justify-between items-center mt-2 text-sm text-base-content/60">
        <div className="flex items-center gap-5">
          <span>{currentSlide + 1} of {images.length}</span>
          {autoplay && (
            <>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  clearFocus();
                  setIsPlaying(!isPlaying);
                }}
                className="btn btn-circle btn-sm bg-base-100/80 border-none hover:bg-base-100"
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`} />
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </>
          )}
        </div>
        <div></div>
      </div>

      {/* Keyboard shortcuts info */}
      {!isMobile && (
        <details className="mt-1 inline-block">
          <summary className="text-xs text-base-content/50 cursor-pointer hover:text-base-content/70">
            Keyboard shortcuts
          </summary>
          <div className="text-xs text-base-content/60 mt-1">
            <p>← → : Navigate | Space: Play/Pause | Home/End: First/Last image</p>
          </div>
        </details>
      )}
    </div>
  );
}
