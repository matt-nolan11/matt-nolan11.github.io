import { useState, useRef, useEffect, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

// CSS for proper gallery behavior
const galleryStyles = `
  .project-gallery .keen-slider {
    display: flex;
  }
  .project-gallery .keen-slider__slide {
    min-width: 100%;
    flex-shrink: 0;
  }
  .project-gallery {
    overflow: hidden;
  }
  .project-gallery button {
    outline: none !important;
  }
  .project-gallery button:focus {
    outline: none !important;
  }
  .project-gallery button:focus:not(:focus-visible) {
    box-shadow: none !important;
  }
  .project-gallery img {
    outline: none !important;
  }
  .project-gallery img:focus {
    outline: none !important;
  }
  .project-gallery *:focus:not(:focus-visible) {
    outline: none !important;
    box-shadow: none !important;
  }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('project-gallery-styles')) {
  const style = document.createElement('style');
  style.id = 'project-gallery-styles';
  style.textContent = galleryStyles;
  document.head.appendChild(style);
}

interface GalleryImage {
  src: string | { src: string; width: number; height: number; format: string };
  alt: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showThumbnails?: boolean;
  loop?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'full' | number; // Support both preset and numeric sizing
}

/**
 * IMPORTANT: Image Optimization Reality Check
 * 
 * The current implementation returns original images because adding query parameters
 * like ?w=800&f=webp doesn't actually optimize images without a backend service.
 * 
 * To get actual WebP optimization, you need one of these approaches:
 * 
 * 1. **Use Astro's Image Component in Astro files**: 
 *    ```astro
 *    import { Image } from 'astro:assets';
 *    import myImage from '../assets/image.png';
 *    <Image src={myImage} alt="..." width={800} height={600} format="webp" />
 *    ```
 * 
 * 2. **Pre-generate optimized images at build time**:
 *    - Use tools like `sharp`, `imagemin`, or `@astrojs/image`
 *    - Generate WebP versions during build process
 *    - Update your content to reference the optimized versions
 * 
 * 3. **Use a CDN/Image Service**:
 *    - Cloudinary: `https://res.cloudinary.com/demo/image/fetch/w_800,f_webp,q_auto/your-image.png`
 *    - ImageKit: `https://ik.imagekit.io/demo/w_800,f_webp,q_80/your-image.png`
 *    - Vercel Image Optimization: `/_next/image?url=image.png&w=800&q=80`
 * 
 * 4. **Configure Astro properly for React components**:
 *    - This is complex and not recommended vs using Astro components directly
 * 
 * For now, this component provides responsive sizing and proper loading behavior.
 */

/**
 * Advanced React image carousel component with swipe support, autoplay, 
 * thumbnails, keyboard navigation, and accessibility features.
 */
export default function ProjectGallery({
  images,
  autoplay = false,
  autoplayInterval = 3000,
  showThumbnails = true,
  loop = true,
  className = '',
  size = 'medium',
}: ProjectGalleryProps) {
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
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userInteractionRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const autoplayIntervalRef = useRef(autoplayInterval);

  // Keep refs in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    autoplayIntervalRef.current = autoplayInterval;
  }, [autoplayInterval]);

  // Detect mobile screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check on mount
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Helper function to reset autoplay timer
  const resetAutoplayTimer = useCallback(() => {
    if (autoplay && isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        if (instanceRef.current && instanceRef.current.track?.details) {
          instanceRef.current.next();
        }
      }, autoplayInterval);
    }
  }, [autoplay, isPlaying, autoplayInterval]);

  // Helper function to start autoplay
  const startAutoplay = useCallback(() => {
    if (autoplay) {
      setIsPlaying(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        if (instanceRef.current && instanceRef.current.track?.details) {
          instanceRef.current.next();
        }
      }, autoplayInterval);
    }
  }, [autoplay, autoplayInterval]);

  // Helper function to restore autoplay after user interaction
  const restoreAutoplayIfNeeded = useCallback((wasPlaying: boolean) => {
    if (wasPlaying) {
      setTimeout(() => {
        startAutoplay();
      }, 100);
    }
  }, [startAutoplay]);

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
      spacing: 0,
      origin: "center"
    },
    renderMode: "precision",
    defaultAnimation: {
      duration: 800 // Increased transition duration (default is 500ms)
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
        // Reset autoplay timer inline to avoid dependency issues
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          if (instanceRef.current && instanceRef.current.track?.details) {
            instanceRef.current.next();
          }
        }, autoplayIntervalRef.current);
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

  // Autoplay functionality with better reliability
  useEffect(() => {
    if (!loaded || !instanceRef.current) return;

    if (isPlaying && autoplay) {
      intervalRef.current = setInterval(() => {
        if (instanceRef.current && instanceRef.current.track?.details) {
          instanceRef.current.next();
        }
      }, autoplayInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, autoplayInterval, loaded, autoplay]);

  // Visibility observer to reinitialize slider when tab becomes visible
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
                // Don't reset slide position here - let the tab change handler do that
                // Resume autoplay if it was enabled
                if (autoplay) {
                  startAutoplay();
                }
              }
            }, 100);
          } else {
            // Component is not visible, pause autoplay
            if (autoplay) {
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          const isVisible = !target.classList.contains('hidden') && 
                           getComputedStyle(target).display !== 'none';
          const wasHidden = (mutation.oldValue || '').includes('hidden');
          
          // Only reset if transitioning from hidden to visible (tab switch)
          if (isVisible && wasHidden && instanceRef.current && instanceRef.current.track?.details) {
            // Give the DOM time to update after class changes
            setTimeout(() => {
              if (instanceRef.current && instanceRef.current.track?.details) {
                instanceRef.current.update();
                // Reset to first slide when switching from hidden to visible
                instanceRef.current.moveToIdx(0, true);
                setCurrentSlide(0);
                // Resume autoplay if it was enabled
                if (autoplay) {
                  startAutoplay();
                }
              }
            }, 50);
          } else if (!isVisible && autoplay) {
            // Tab content is hidden, pause autoplay
            setIsPlaying(false);
          }
        }
      });
    });

    // Watch for class changes on the container and its parent
    const watchElement = containerRef.current.closest('.version-content') || containerRef.current;
    mutationObserver.observe(watchElement, { 
      attributes: true, 
      attributeFilter: ['class'],
      subtree: true,
      attributeOldValue: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [loaded, autoplay, startAutoplay]);

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
  const createOptimizedImage = (src: string | { src: string }, width: number, quality: number = 80): { 
    src: string; 
    srcSet?: string; 
    sizes?: string; 
  } => {
    const baseSrc = typeof src === 'string' ? src : src.src;
    
    // If it's already an optimized Astro asset, return as-is
    if (typeof src === 'object' && src.src) {
      return { src: src.src };
    }
    
    // Check if the image is already optimized (contains _astro in path or is webp)
    if (baseSrc.includes('_astro') || baseSrc.includes('.webp')) {
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
        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max p-1">
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
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-full h-12 sm:h-14 md:h-16 object-cover rounded-lg transition-all duration-300 ${
                        idx === currentSlide
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100'
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
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`} />
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
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
            </>
          )}
        </div>
        <div></div>
      </div>

      {/* Keyboard shortcuts info */}
      {!isMobile && (
        <details className="mt-2 inline-block">
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
