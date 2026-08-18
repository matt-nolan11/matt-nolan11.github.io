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

import { useState, useRef, useEffect, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

/**
 * A gallery image, already resolved by ModularSection.
 *
 * The `src` object is the output of Astro's `getImage()`, not a raw
 * `ImageMetadata`: this component is a React island and cannot reach the image
 * pipeline itself, so every URL here is built at build time against assets the
 * build actually emits. A plain string is passed through untouched.
 */
interface ResolvedImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  /** Pre-sized thumbnail; falls back to the full slide if absent. */
  thumbSrc?: string;
  /** Source dimensions, kept for aspect-ratio derivation. */
  width?: number;
  height?: number;
}

interface GalleryImage {
  src: string | ResolvedImage;
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
  /**
   * Force the gallery's shape, as "16:9" / "4:3" or a number (width / height).
   * Without this the ratio is derived from the widest image, so one unusually
   * wide photo reshapes the whole gallery — and makes it inconsistent with
   * other galleries on the same page.
   */
  aspectRatio?: string | number;
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
  aspectRatio,
}: ProjectGalleryProps) {
  /**
   * Resolve the gallery's aspect ratio as width / height (e.g. 1.333 for 4:3).
   *
   * An explicit `aspectRatio` wins. Otherwise it is derived from the widest
   * image, so that landscape shots are not cropped — but note that a single
   * unusually wide image then dictates the shape of the whole gallery, which
   * is the usual reason to set it explicitly.
   */
  const calculateGalleryAspectRatio = (images: GalleryImage[]): number => {
    if (typeof aspectRatio === 'number' && aspectRatio > 0) {
      return aspectRatio;
    }

    if (typeof aspectRatio === 'string') {
      const [w, h] = aspectRatio.split(':').map(Number);
      if (w > 0 && h > 0) return w / h;

      const single = Number(aspectRatio);
      if (single > 0) return single;
    }

    const ratios: number[] = [];

    for (const image of images) {
      if (typeof image.src === 'object' && image.src.width && image.src.height) {
        ratios.push(image.src.width / image.src.height);
      }
    }

    // Use the widest (largest) aspect ratio so landscape images fit well
    if (ratios.length > 0) {
      return Math.max(...ratios);
    }

    // Fallback: 5:3 landscape ratio
    return 5 / 3;
  };

  /**
   * Calculate gallery container styling based on size prop
   * @param size - Either a preset size string or a numeric pixel width
   * @returns Object with className and style properties
   */

  // Compute aspect ratio once from image metadata (stable across renders)
  const galleryAspectRatio = calculateGalleryAspectRatio(images);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
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

  // Re-measure when our container resizes.
  //
  // renderMode: "precision" makes keen-slider write inline pixel widths and
  // transform offsets onto each slide, measured once at init. keen-slider only
  // re-measures on *window* resize, so anything that changes our width without
  // resizing the window (the ModularSection height balancer, a version tab
  // becoming visible) leaves those pixel values stale: the active image renders
  // at the wrong scale and the edge of the next slide bleeds in.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !loaded) return;

    let lastWidth = container.getBoundingClientRect().width;
    let frame = 0;

    const observer = new ResizeObserver(() => {
      const width = container.getBoundingClientRect().width;
      if (!width || Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slider = instanceRef.current;
        if (!slider?.track?.details) return;
        // Pass the current index so re-measuring doesn't jump back to slide 0.
        slider.update(undefined, slider.track.details.rel);
      });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [loaded]);

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

  /**
   * Unwrap a resolved image into `<img>` attributes.
   *
   * Deliberately does no URL building. ModularSection resolves every gallery
   * image through `getImage()` at build time, so there is nothing left to
   * optimise here — an earlier version of this function reconstructed
   * `/_image?…` URLs from the raw metadata, which only matched the dev server's
   * URL shape and silently served full-size originals in production.
   */
  const slideAttrs = (src: GalleryImage['src']) =>
    typeof src === 'string'
      ? { src }
      : { src: src.src, srcSet: src.srcSet, sizes: src.sizes };

  const thumbAttrs = (src: GalleryImage['src']) =>
    typeof src === 'string' ? { src } : { src: src.thumbSrc ?? src.src };

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
      {/* Main carousel.
          No opacity gate on `loaded`: the base CSS (flex row, overflow hidden,
          100%-width slides) already shows exactly slide 1 before keen-slider
          initialises, so the first image paints without waiting for JS. Gating
          it would flash an empty gallery now that the balancer reveals the page
          before hydration completes. */}
      <div className="relative group">
        <div
          ref={sliderRef}
          className="keen-slider main-carousel rounded-xl overflow-hidden shadow-lg"
          style={{
            aspectRatio: `${galleryAspectRatio}`,
            width: '100%',
          }}
        >
          {images.map((image, idx) => {
            const optimizedImage = slideAttrs(image.src);
            return (
            <div
              key={idx}
              className="keen-slider__slide relative"
            >
              <img
                {...optimizedImage}
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

        {/* Navigation arrows.
            Rendered during SSR rather than gated behind `loaded`: the handlers
            below already no-op until the slider exists, and keeping the markup
            stable across hydration means the layout never shifts. */}
        {images.length > 1 && (
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

      {/* Thumbnails.
          These must server-render. They are the only part of the gallery that
          affects the column's HEIGHT, so gating them behind `loaded` made the
          column grow at hydration — which kept the ModularSection balancer's
          settle poll re-triggering until it hit its timeout, delaying the
          page-load reveal for every section on the page. */}
      {showThumbnails && images.length > 1 && (
  <div className="mt-4 thumbnails-row" style={{ padding: '2px' }}>
          <div className="flex flex-wrap gap-3 sm:gap-4 thumbnails-row">
            {images.map((image, idx) => (
              <div
                key={idx}
                className={`cursor-pointer flex-shrink-0 rounded-lg transition-all duration-300 ${
                  idx === currentSlide
                    ? 'ring-2 ring-white'
                    : 'opacity-60 hover:opacity-90'
                }`}
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
                <img
                  {...thumbAttrs(image.src)}
                  alt={`Thumbnail: ${image.alt || image.caption || `Image ${idx + 1}`}`}
                  className="gallery-thumb-img w-full h-12 sm:h-14 md:h-16 object-cover rounded-lg block"
                  loading="lazy"
                />
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

    </div>
  );
}
