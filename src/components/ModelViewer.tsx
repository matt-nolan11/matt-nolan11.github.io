import React, { useEffect, useRef, useState } from 'react';

// TypeScript declaration for model-viewer custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

// Types for model viewer properties
interface ModelViewerProps {
  src: string;
  alt?: string;
  poster?: string;
  environmentImage?: string;
  skyboxImage?: string;
  exposureCompensation?: number;
  shadowIntensity?: number;
  shadowSoftness?: number;
  cameraControls?: boolean;
  disablePan?: boolean;
  disableTap?: boolean;
  disableZoom?: boolean;
  autoRotate?: boolean;
  autoRotateDelay?: number;
  rotationPerSecond?: string;
  interactionPrompt?: 'auto' | 'when-focused' | 'none';
  interactionPromptStyle?: 'basic' | 'wiggle';
  interactionPromptThreshold?: number;
  /** Desktop camera orbit position (e.g., "0deg 75deg 0.5m") */
  cameraOrbit?: string;
  /** Mobile camera orbit position for optimal mobile viewing (e.g., "0deg 75deg 0.65m") */
  mobileCameraOrbit?: string;
  /** Desktop aspect ratio for responsive height calculation (e.g., "16:9", "4:3", "1:1") */
  aspectRatio?: string;
  /** Mobile aspect ratio for responsive height calculation (e.g., "4:3", "1:1") */
  mobileAspectRatio?: string;
  cameraTarget?: string;
  fieldOfView?: string;
  minCameraOrbit?: string;
  minFieldOfView?: string;
  maxFieldOfView?: string;
  bounds?: 'tight' | 'legacy';
  interpolationDecay?: number;
  width?: string | number;
  height?: string | number;
  mobileHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'auto' | 'lazy' | 'eager';
  reveal?: 'auto' | 'interaction' | 'manual';
  withCredentials?: boolean;
  // Animation controls
  animationName?: string;
  autoplay?: boolean;
  animationCrossfadeDuration?: number;
  // Augmented Reality
  ar?: boolean;
  arModes?: string;
  arScale?: 'auto' | 'fixed';
  arPlacement?: 'floor' | 'wall';
  iosSource?: string;
  xrEnvironment?: boolean;
  // Staging & Scene controls
  toneMapping?: 'aces' | 'commerce' | 'neutral';
  neutralColorSpace?: 'srgb' | 'rec2020';
  // Additional options
  /** Heading rendered above the viewer, styled to match a `###` in MDX */
  title?: string;
  caption?: string;
  variant?: string;
  scale?: string;
  orientation?: string;
}

/**
 * Camera-control hints, pinned inside the viewer's top-right corner.
 *
 * These used to live in a `<details>` below the viewer, which cost a line of
 * dead space under every model and, on open, pushed the rest of the page down —
 * a jarring reflow for a purely informational disclosure. Absolutely positioning
 * both the trigger and the panel takes them out of flow entirely: the hint stays
 * discoverable, but nothing above or below the viewer ever moves.
 *
 * The panel is anchored to the right edge and capped to the container width so
 * it cannot spill past the viewer in a narrow column.
 */
function ViewerControlsHint({
  canZoom,
  canPan,
  notes,
}: {
  canZoom: boolean;
  canPan: boolean;
  notes: { text: string; className: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = React.useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Only advertise the gestures this viewer actually accepts.
  const join = (...parts: (string | false)[]) => parts.filter(Boolean).join(' • ');
  const mouseHint = join('Drag to rotate', canZoom && 'Scroll to zoom', canPan && 'Right-drag to pan');
  const touchHint = join('Drag to rotate', canZoom && 'Pinch to zoom', canPan && 'Two-finger drag to pan');

  return (
    // The wrapper spans the viewer's width so the panel's `max-w-full` resolves
    // against the viewer rather than the button, keeping it over the model in a
    // narrow column. It is click-through so the strip it covers still orbits it;
    // only the button and panel themselves take pointer events.
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-2 top-2 z-30 flex flex-col items-end"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label="3D controls"
        title="3D controls"
        className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-base-content/10 bg-base-100/70 shadow-sm backdrop-blur-sm transition-colors hover:bg-base-100 hover:text-base-content focus-visible:ring-2 focus-visible:ring-primary/60 ${
          isOpen ? 'bg-base-100 text-base-content' : 'text-base-content/60'
        }`}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9a3.001 3.001 0 015.83 1c0 2-3 3-3 3m.058 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="pointer-events-auto mt-2 w-64 max-w-full rounded-lg border border-base-content/10 bg-base-100/95 p-3 text-xs shadow-lg backdrop-blur-sm"
        >
          <dl className="m-0 space-y-2">
            <div className="hidden sm:block">
              <dt className="font-medium text-base-content/80">Mouse</dt>
              {/* p-0 as well as m-0: a global rule indents `dd` with padding. */}
              <dd className="m-0 p-0 text-base-content/60">{mouseHint}</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content/80">Touch</dt>
              {/* p-0 as well as m-0: a global rule indents `dd` with padding. */}
              <dd className="m-0 p-0 text-base-content/60">{touchHint}</dd>
            </div>
          </dl>
          {notes.map((note) => (
            <p key={note.text} className={`m-0 mt-2 ${note.className}`}>
              {note.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Advanced 3D model viewer component using Google's model-viewer web component.
 * Provides interactive 3D model display with camera controls, animations, and AR support.
 * 
 * Features:
 * - Interactive camera controls (orbit, zoom, pan) with fine-grained control
 * - Responsive camera positioning with separate desktop and mobile camera orbits
 * - Automatic max camera orbit generation (uses "auto auto [distance]" format)
 * - Aspect ratio-based responsive sizing for consistent proportions across devices
 * - Automatic rotation and animations with customizable timing
 * - Environmental lighting, shadows, and tone mapping
 * - Progressive loading with poster images
 * - Augmented Reality support (iOS/Android)
 * - Accessibility support
 * - Performance optimizations for smooth rendering
 * - Advanced staging controls (exposure, tone mapping, color space)
 * - Multiple interaction modes and prompts
 * - Model variants and scaling support
 * 
 * Camera System:
 * - `cameraOrbit`: Desktop camera position (e.g., "0deg 75deg 0.5m")
 * - `mobileCameraOrbit`: Mobile-specific camera position for optimal viewing on small screens
 * - `maxCameraOrbit`: Automatically generated as "auto auto [distance]" from active camera orbit
 * - Breakpoint: 768px (mobile ≤768px, desktop >768px)
 * 
 * Responsive Sizing:
 * - `aspectRatio`: Desktop aspect ratio (e.g., "16:9", "4:3", "1:1")
 * - `mobileAspectRatio`: Mobile aspect ratio for different proportions on mobile devices
 * - Height automatically calculated: containerWidth × (heightRatio / widthRatio)
 * - Fallback to `height` prop if no aspect ratios specified
 * - Container width estimated based on viewport and column layout
 * 
 * @example
 * ```jsx
 * <ModelViewer
 *   src="/path/to/model.glb"
 *   alt="3D Model Description"
 *   title="Drivetrain assembly"
 *   cameraOrbit="0deg 75deg 0.5m"
 *   mobileCameraOrbit="0deg 75deg 0.65m"
 *   aspectRatio="3:2"
 *   mobileAspectRatio="4:3"
 *   autoRotate={true}
 *   cameraControls={true}
 *   ar={true}
 * />
 * ```
 */
export default function ModelViewer({
  src,
  alt = '3D Model',
  poster,
  environmentImage,
  skyboxImage,
  exposureCompensation = 1,
  shadowIntensity = 1,
  shadowSoftness = 1,
  cameraControls = true,
  disablePan = false,
  disableTap = false,
  disableZoom = false,
  autoRotate = false,
  autoRotateDelay = 3000,
  rotationPerSecond = '20deg', // Reduced from 30deg for smoother rotation
  interactionPrompt = 'auto',
  interactionPromptStyle = 'wiggle',
  interactionPromptThreshold = 3000,
  cameraOrbit,
  mobileCameraOrbit,
  aspectRatio,
  mobileAspectRatio,
  cameraTarget,
  fieldOfView,
  minCameraOrbit,
  minFieldOfView,
  maxFieldOfView,
  bounds = 'tight',
  interpolationDecay = 100,
  width,
  height,
  className = '',
  style,
  loading = 'lazy',
  reveal = 'auto', // Revert to auto but with better background handling
  withCredentials = false,
  animationName,
  autoplay = false,
  animationCrossfadeDuration = 300,
  ar = false,
  arModes = 'webxr scene-viewer quick-look',
  arScale = 'auto',
  arPlacement = 'floor',
  iosSource,
  xrEnvironment = false,
  toneMapping = 'neutral',
  neutralColorSpace = 'srgb',
  title,
  caption,
  variant,
  scale,
  orientation,
}: ModelViewerProps) {
  const modelViewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [canActivateAR, setCanActivateAR] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window width for responsive camera orbit
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  /**
   * Calculate responsive camera orbit based on device type and screen size
   * Uses mobileCameraOrbit for mobile devices if provided, otherwise uses desktop orbit
   * @param desktopCameraOrbit - The desktop camera orbit string (e.g., "0deg 75deg 0.45m")
   * @param mobileCameraOrbit - Optional mobile-specific camera orbit string
   * @param windowWidth - Current window width in pixels
   * @returns Appropriate camera orbit string for the current device
   */
  const getResponsiveCameraOrbit = (
    desktopCameraOrbit?: string, 
    mobileCameraOrbit?: string, 
    windowWidth?: number
  ): string | undefined => {
    if (!desktopCameraOrbit || !windowWidth) return desktopCameraOrbit;
    
    // Define mobile breakpoint
    const mobileBreakpoint = 768; // md breakpoint
    
    // Use mobile-specific orbit if provided and on mobile device
    if (windowWidth <= mobileBreakpoint && mobileCameraOrbit) {
      return mobileCameraOrbit;
    }
    
    // For devices without a specific mobile orbit, use desktop orbit
    return desktopCameraOrbit;
  };

  /**
   * Generate max camera orbit with "auto auto" for azimuth/polar and distance from active orbit
   * @param activeCameraOrbit - The currently active camera orbit string
   * @returns Max camera orbit string with auto positioning and inherited distance
   */
  const generateMaxCameraOrbit = (activeCameraOrbit?: string): string | undefined => {
    if (!activeCameraOrbit) return undefined;
    
    // Parse the active orbit to extract distance
    const orbitMatch = activeCameraOrbit.match(/^(-?\d+(?:\.\d+)?)deg\s+(-?\d+(?:\.\d+)?)deg\s+(-?\d+(?:\.\d+)?)([a-z]+)$/);
    if (!orbitMatch) return activeCameraOrbit;
    
    const [, , , distance, unit] = orbitMatch;
    
    // Return "auto auto [distance][unit]" format
    return `auto auto ${distance}${unit}`;
  };

  // Calculate responsive camera orbit and auto-generate max camera orbit
  const responsiveCameraOrbit = getResponsiveCameraOrbit(cameraOrbit, mobileCameraOrbit, windowWidth);
  
  // Auto-generate max camera orbit with "auto auto" format and distance from active orbit
  const responsiveMaxCameraOrbit = generateMaxCameraOrbit(responsiveCameraOrbit);

  // Load model-viewer web component
  useEffect(() => {
    const load = async () => {
      try {
        if (customElements.get('model-viewer')) {
          setIsModelViewerLoaded(true);
          return;
        }
        await import('@google/model-viewer');
        setIsModelViewerLoaded(true);
      } catch (error) {
        console.error('Failed to load model-viewer:', error);
        setHasError(true);
      }
    };
    // Defer to idle time if available, otherwise microtask
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => load());
    } else {
      setTimeout(() => load(), 0);
    }
  }, []);

  // Set up event listeners for model loading states
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !isModelViewerLoaded) return;

    const handleLoad = () => {
      setIsLoaded(true);
      setIsLoading(false);
      
      // Enhanced AR capability detection
      if (ar && modelViewer) {
        // Ensure AR attributes are set correctly
        if (!modelViewer.hasAttribute('ar')) {
          modelViewer.setAttribute('ar', '');
          modelViewer.setAttribute('ar-modes', arModes);
          modelViewer.setAttribute('ar-scale', arScale);
          modelViewer.setAttribute('ar-placement', arPlacement);
        }
        
        // Check AR capability
        const isARSupported = modelViewer.canActivateAR === true;
        
        // Verify HTTPS requirement
        if (window.location.protocol !== 'https:') {
          setCanActivateAR(false);
          return;
        }
        
        // Set initial AR capability state
        setCanActivateAR(isARSupported);
        
        // Recheck AR capability after delay (AR detection can be slow)
        setTimeout(() => {
          const updatedCanActivateAR = modelViewer.canActivateAR === true;
          if (updatedCanActivateAR !== isARSupported) {
            setCanActivateAR(updatedCanActivateAR);
          }
        }, 1000);
        
        // Final check after extended delay
        setTimeout(() => {
          const finalCanActivateAR = modelViewer.canActivateAR === true;
          if (finalCanActivateAR !== canActivateAR) {
            setCanActivateAR(finalCanActivateAR);
          }
        }, 3000);
      }
    };

    const handleError = (event: any) => {
      console.error('Model loading error:', event);
      setHasError(true);
      setIsLoading(false);
    };

    const handleProgress = (event: any) => {
      const { totalProgress } = event.detail;
      // You could add a progress bar here if needed
      if (totalProgress === 1) {
        setIsLoading(false);
      }
    };

    // Only perform heavier AR checks when element is visible in viewport
    let visibilityObserver: IntersectionObserver | null = null;

    const startVisibilityWatch = () => {
      visibilityObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          // Trigger a minimal check which will set timers if AR is on
          if (ar && modelViewer) {
            // noop: handleLoad did AR checks
          }
        }
      }, { threshold: 0.01 });
      visibilityObserver.observe(modelViewer);
    };

    // Add event listeners
    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('progress', handleProgress);
    startVisibilityWatch();

    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
        modelViewer.removeEventListener('progress', handleProgress);
      }
      if (visibilityObserver) {
        visibilityObserver.disconnect();
        visibilityObserver = null;
      }
    };
  }, [isModelViewerLoaded]);

  // Performance optimization: reduce stuttering and improve smoothness
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !isModelViewerLoaded || !isLoaded) return;

    // Optimize rendering performance
    const optimizePerformance = () => {
      try {
        // Reduce shadow quality on lower-end devices for smoother rotation
        const canvas = modelViewer.shadowRoot?.querySelector('canvas');
        if (canvas) {
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (gl) {
            // Enable hardware acceleration optimizations
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            
            // Check if device has limited performance
            const renderer = gl.getParameter(gl.RENDERER);
            const isLowPerformance = renderer.includes('Intel') || 
                                   renderer.includes('Mali') || 
                                   renderer.includes('Adreno 4') ||
                                   renderer.includes('PowerVR');
            
            if (isLowPerformance && autoRotate) {
              // Use a slower, smoother rotation on low-performance devices
              modelViewer.setAttribute('rotation-per-second', '15deg');
            }
          }
        }

        // Set CSS for smoother animations
        modelViewer.style.willChange = autoRotate ? 'transform' : 'auto';
        modelViewer.style.backfaceVisibility = 'hidden';
        modelViewer.style.perspective = '1000px';
        
      } catch (error) {
        console.warn('Performance optimization failed:', error);
      }
    };

    // Apply optimizations after a short delay to ensure model is fully loaded
    const optimizationTimer = setTimeout(optimizePerformance, 500);

    return () => clearTimeout(optimizationTimer);
  }, [isModelViewerLoaded, isLoaded, autoRotate]);

  // Stop a stray keypress from lighting up the viewer's edge.
  //
  // model-viewer's shadow root holds `<div class="userInput" tabindex="0">`,
  // styled `outline-offset: -1px`, so its focus ring draws *inside* the box and
  // reads as the whole border igniting rather than as a normal focus outline.
  // Chrome re-arms :focus-visible on any keydown, including bare modifiers, so
  // once a mouse drag has left that div focused, pressing Shift makes the ring
  // appear with nothing having been navigated.
  //
  // Blanket `outline: none` is the wrong fix: the viewer is genuinely keyboard
  // operable (arrows orbit the camera), so that would strip the only focus
  // indicator it has. Track input modality instead — pointer focus suppresses
  // the ring, Tab restores it. The rule has to be injected into the shadow root
  // because `.userInput` is unreachable from page CSS and is not exposed as a
  // ::part.
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !isModelViewerLoaded) return;

    const shadowRoot = modelViewer.shadowRoot;
    if (!shadowRoot) return;

    const style = document.createElement('style');
    style.textContent =
      ':host([data-pointer-focus]) .userInput:focus-visible { outline: none; }';
    shadowRoot.appendChild(style);

    const handlePointerDown = () => {
      modelViewer.setAttribute('data-pointer-focus', '');
    };

    // Tab is pressed while focus is still on the *previous* element, so this
    // has to listen at the document in the capture phase to clear the flag
    // before focus lands on the viewer.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') modelViewer.removeAttribute('data-pointer-focus');
    };

    modelViewer.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      style.remove();
      modelViewer.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isModelViewerLoaded]);

  // Build model-viewer attributes with performance optimizations
  const buildAttributes = () => {
    const attrs: Record<string, any> = {
      src,
      alt,
      loading,
      reveal,
      bounds,
      'exposure': exposureCompensation,
      'shadow-intensity': shadowIntensity,
      'shadow-softness': shadowSoftness,
      'interpolation-decay': interpolationDecay,
    };

    if (poster) attrs.poster = poster;
    if (environmentImage) attrs['environment-image'] = environmentImage;
    if (skyboxImage) attrs['skybox-image'] = skyboxImage;
    if (cameraControls) attrs['camera-controls'] = '';
    if (disablePan) attrs['disable-pan'] = '';
    if (disableTap) attrs['disable-tap'] = '';
    if (disableZoom) attrs['disable-zoom'] = '';
    if (autoRotate) {
      attrs['auto-rotate'] = '';
      attrs['auto-rotate-delay'] = autoRotateDelay;
      attrs['rotation-per-second'] = rotationPerSecond;
    }
    if (interactionPrompt !== 'none') {
      attrs['interaction-prompt'] = interactionPrompt;
      attrs['interaction-prompt-style'] = interactionPromptStyle;
      attrs['interaction-prompt-threshold'] = interactionPromptThreshold;
    }
    if (responsiveCameraOrbit) attrs['camera-orbit'] = responsiveCameraOrbit;
    if (cameraTarget) attrs['camera-target'] = cameraTarget;
    if (fieldOfView) attrs['field-of-view'] = fieldOfView;
    if (minCameraOrbit) attrs['min-camera-orbit'] = minCameraOrbit;
    if (responsiveMaxCameraOrbit) attrs['max-camera-orbit'] = responsiveMaxCameraOrbit;
    if (minFieldOfView) attrs['min-field-of-view'] = minFieldOfView;
    if (maxFieldOfView) attrs['max-field-of-view'] = maxFieldOfView;
    if (withCredentials) attrs['with-credentials'] = '';
    if (animationName) {
      attrs['animation-name'] = animationName;
      attrs['animation-crossfade-duration'] = animationCrossfadeDuration;
    }
    if (autoplay) attrs.autoplay = '';
    if (ar) {
      attrs.ar = '';
      attrs['ar-modes'] = arModes;
      attrs['ar-scale'] = arScale;
      attrs['ar-placement'] = arPlacement;
    }
    if (iosSource) attrs['ios-src'] = iosSource;
    if (xrEnvironment) attrs['xr-environment'] = '';
    if (toneMapping !== 'neutral') attrs['tone-mapping'] = toneMapping;
    if (neutralColorSpace !== 'srgb') attrs['neutral-color-space'] = neutralColorSpace;
    if (variant) attrs.variant = variant;
    if (scale) attrs.scale = scale;
    if (orientation) attrs.orientation = orientation;

    return attrs;
  };

  const attributes = buildAttributes();

  /**
   * Get the CSS aspect ratio string for responsive sizing
   * @param desktopAspectRatio - Desktop aspect ratio (e.g., "16:9", "4:3", "1:1")
   * @param mobileAspectRatio - Mobile aspect ratio (e.g., "16:9", "4:3", "1:1")
   * @param windowWidth - Current window width
   * @returns CSS aspect-ratio value or undefined if no aspect ratio specified
   */
  const getResponsiveAspectRatio = (
    desktopAspectRatio?: string,
    mobileAspectRatio?: string,
    windowWidth?: number
  ): string | undefined => {
    // Define breakpoint
    const mobileBreakpoint = 768;
    // windowWidth is 0 during SSR and on the first client render. Returning
    // undefined there left the element with no aspect-ratio, so it collapsed
    // to the placeholder height and then jumped to full size once mounted —
    // a visible two-step resize, and a stale height for anything measuring the
    // column (the ModularSection balancer solves long before this settles).
    // Assume desktop until we know better; that is also the only case where
    // side-by-side columns exist.
    const isMobile = windowWidth ? windowWidth <= mobileBreakpoint : false;
    
    // Select appropriate aspect ratio
    const activeAspectRatio = isMobile && mobileAspectRatio ? mobileAspectRatio : desktopAspectRatio;
    
    if (!activeAspectRatio) {
      return undefined;
    }
    
    // Parse aspect ratio (e.g., "16:9" -> [16, 9])
    const [widthRatio, heightRatio] = activeAspectRatio.split(':').map(Number);
    
    if (!widthRatio || !heightRatio) {
      console.warn('Invalid aspect ratio format. Use format like "16:9" or "4:3"');
      return undefined;
    }
    
    // Return CSS aspect-ratio value
    return `${widthRatio} / ${heightRatio}`;
  };

  // Calculate responsive aspect ratio for CSS
  const responsiveAspectRatio = getResponsiveAspectRatio(aspectRatio, mobileAspectRatio, windowWidth);

  // One box for every state. The loading and error placeholders must occupy
  // exactly the box the loaded viewer will, otherwise the column resizes when
  // the model arrives — visible as a jump, and enough to invalidate the
  // balancer's height measurement.
  //
  // The `16rem` branch is what makes the box self-supporting. model-viewer's
  // own `:host` height is overridden by the inline height below, so an
  // aspect-ratio-less viewer laid out at `auto` collapses to zero and draws
  // nothing. That used to be papered over by a 400px min-height on the
  // container, which held an empty box open — dead space under every viewer
  // whose real content came in shorter than 400px, which is most of them in a
  // narrow column. Sizing the element itself means the container can just wrap
  // its content.
  const boxStyle: React.CSSProperties = responsiveAspectRatio
    ? { aspectRatio: responsiveAspectRatio, height: height ?? 'auto' }
    : { height: height ?? '16rem' };

  // Borrows the prose typography rather than hand-picking a size, so a model's
  // title matches a `###` written in MDX or a content column's title sitting
  // beside it. `.prose > :first-child { margin-top: 0 }` cancels the h3's top
  // margin, so it needs to stay the direct first child of the wrapper.
  // Rendered in every branch — loading, error, loaded — so the title does not
  // pop in and shift the column once the model arrives.
  const titleNode = title ? (
    <div className="prose prose-lg max-w-none">
      <h3>{title}</h3>
    </div>
  ) : null;


  const modelStyle: React.CSSProperties = {
    width: width || '100%',
    ...boxStyle,
    // Performance optimizations for smoother rendering
    transform: 'translateZ(0)', // Force hardware acceleration
    backfaceVisibility: 'hidden',
    perspective: '1000px',
    willChange: autoRotate ? 'transform' : 'auto',
    // Ensure smooth animations and prevent flash
    transition: 'none', // Disable transitions that might interfere with model-viewer
    backgroundColor: 'transparent', // Prevent background color flash
    // Additional properties to prevent flash
    '--progress-bar-color': 'transparent', // Hide progress bar color
    '--progress-bar-height': '0px', // Completely remove progress bar height
    '--progress-mask-base': 'transparent', // Hide progress mask
    ...style,
  } as React.CSSProperties;

  if (hasError) {
    return (
      <div className={`model-viewer-container ${className}`}>
        {titleNode}
        <div
          className="flex items-center justify-center w-full bg-base-200 rounded-xl border-2 border-dashed border-base-300"
          style={boxStyle}
        >
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-base-content/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base-content/60 font-medium">Failed to load 3D model</p>
            <p className="text-base-content/40 text-sm mt-1">Check the model file format and path</p>
          </div>
        </div>
        {caption && (
          <p className="text-sm text-base-content/60 mt-2 text-center">{caption}</p>
        )}
      </div>
    );
  }

  if (!isModelViewerLoaded) {
    return (
      <div className={`model-viewer-container ${className}`}>
        {titleNode}
        <div
          className="flex items-center justify-center w-full bg-base-200 rounded-xl"
          style={boxStyle}
        >
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-base-content/60">Loading 3D viewer...</p>
          </div>
        </div>
        {caption && (
          <p className="text-sm text-base-content/60 mt-2 text-center">{caption}</p>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`model-viewer-container ${className}`}
      style={{
        position: 'relative',
        zIndex: 15
      }}
    >
      {titleNode}

      <div className="relative">
        {/* role="img" scoped to the canvas rather than the whole container: an
            img role is a leaf, so anything inside it is dropped from the
            accessibility tree. On the container it was swallowing the title,
            caption and controls text along with the model — which is also why
            the overlay controls below sit outside this element rather than in
            it, despite being painted over the same box. */}
        <div className="relative" role="img" aria-label={alt}>
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200 rounded-xl z-10">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                <p className="text-base-content/60">Loading 3D model...</p>
              </div>
            </div>
          )}

          {/* Model viewer */}
          {React.createElement('model-viewer', {
            ref: modelViewerRef,
            style: {
              ...modelStyle,
              '--poster-color': 'transparent', // Prevent poster background flash
              '--progress-bar-color': 'transparent', // Hide progress bar completely
              '--progress-bar-height': '0px', // Remove progress bar height
              '--progress-mask-base': 'transparent', // Hide progress mask
            },
            className: "rounded-xl bg-base-100", // Remove w-full to respect parent container constraints
            // Explicitly set AR attributes
            ...(ar ? { 'ar': '', 'ar-modes': arModes, 'ar-scale': arScale, 'ar-placement': arPlacement } : {}),
            ...attributes
          },
          // AR button as child with slot attribute
          ar ? React.createElement('button', {
            slot: 'ar-button',
            className: "btn btn-primary btn-sm absolute bottom-4 right-4 z-20",
            'aria-label': "View in AR",
            style: {
              display: canActivateAR ? 'flex' : 'none',
              alignItems: 'center',
              gap: '0.5rem'
            }
          }, [
            React.createElement('svg', {
              key: 'ar-icon',
              className: "w-4 h-4",
              fill: "currentColor",
              viewBox: "0 0 24 24"
            }, React.createElement('path', {
              d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            })),
            React.createElement('span', { key: 'ar-text' }, 'View in AR')
          ]) : null)}
        </div>

        {/* Camera-control hints, overlaid in the corner. Suppressed while the
            model is still loading so it never sits on top of the spinner. */}
        {cameraControls && !isLoading && (
          <ViewerControlsHint
            canZoom={!disableZoom}
            canPan={!disablePan}
            notes={[
              ...(ar && canActivateAR
                ? [{ text: 'Tap the AR button for an augmented reality view', className: 'text-primary' }]
                : []),
              ...(ar && !canActivateAR && isLoaded
                ? [{ text: 'AR requires a mobile device with ARCore (Android) or ARKit (iOS)', className: 'text-warning' }]
                : []),
            ]}
          />
        )}

        {/* Fallback AR button for when AR is not available */}
        {ar && !canActivateAR && isLoaded && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="tooltip tooltip-left" data-tip={
              window.location.protocol !== 'https:' ? 
                'AR requires HTTPS' :
                !('xr' in navigator) ?
                  'AR not supported in this browser' :
                  'AR requires mobile device with ARCore or ARKit'
            }>
              <button 
                className="btn btn-disabled btn-sm"
                disabled
                aria-label="AR not supported"
                onClick={() => {
                  // Show user-friendly message based on issue
                  if (window.location.protocol !== 'https:') {
                    alert('AR requires HTTPS.\n\nFor development: Run "npm run dev:https" and accept the certificate.\nFor production: Deploy to an HTTPS server.');
                  } else if (!('xr' in navigator)) {
                    alert('AR requires a compatible browser and device.\n\nAndroid: Chrome + ARCore from Play Store\niOS: Safari + ARKit support');
                  } else {
                    alert('AR is not available on this device.\n\nCheck: developers.google.com/ar/devices');
                  }
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                AR
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className="text-sm text-base-content/60 mt-2 text-center">{caption}</p>
      )}
    </div>
  );
}
