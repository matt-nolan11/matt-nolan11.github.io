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
  caption?: string;
  variant?: string;
  scale?: string;
  orientation?: string;
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
    const loadModelViewer = async () => {
      try {
        // Check if model-viewer is already loaded
        if (customElements.get('model-viewer')) {
          setIsModelViewerLoaded(true);
          return;
        }

        // Dynamically import model-viewer
        await import('@google/model-viewer');
        setIsModelViewerLoaded(true);
      } catch (error) {
        console.error('Failed to load model-viewer:', error);
        setHasError(true);
      }
    };

    loadModelViewer();
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

    // Add event listeners
    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('progress', handleProgress);

    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
        modelViewer.removeEventListener('progress', handleProgress);
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
      // Performance optimizations
      'touch-action': 'pan-y', // Improve touch performance
      // Hide progress bar to prevent flash
      'data-js-focus-visible': '',
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
   * Calculate responsive height based on aspect ratio and container width
   * @param baseHeight - Fallback height if no aspect ratio provided
   * @param desktopAspectRatio - Desktop aspect ratio (e.g., "16:9", "4:3", "1:1")
   * @param mobileAspectRatio - Mobile aspect ratio (e.g., "16:9", "4:3", "1:1")
   * @param windowWidth - Current window width
   * @returns Calculated height based on aspect ratio and container width
   */
  const getResponsiveHeight = (
    baseHeight?: string | number, 
    desktopAspectRatio?: string,
    mobileAspectRatio?: string,
    windowWidth?: number
  ): string => {
    if (!windowWidth) return typeof baseHeight === 'string' ? baseHeight : `${baseHeight}px` || '400px';
    
    // Define breakpoint
    const mobileBreakpoint = 768;
    const isMobile = windowWidth <= mobileBreakpoint;
    
    // Select appropriate aspect ratio
    const activeAspectRatio = isMobile && mobileAspectRatio ? mobileAspectRatio : desktopAspectRatio;
    
    if (!activeAspectRatio) {
      // Fallback to original height if no aspect ratio specified
      return typeof baseHeight === 'string' ? baseHeight : `${baseHeight}px` || '400px';
    }
    
    // Parse aspect ratio (e.g., "16:9" -> [16, 9])
    const [widthRatio, heightRatio] = activeAspectRatio.split(':').map(Number);
    
    if (!widthRatio || !heightRatio) {
      console.warn('Invalid aspect ratio format. Use format like "16:9" or "4:3"');
      return typeof baseHeight === 'string' ? baseHeight : `${baseHeight}px` || '400px';
    }
    
    // Calculate container width (accounting for column width percentage)
    let containerWidth: number;
    
    if (isMobile) {
      // Mobile: typically full width minus padding
      containerWidth = windowWidth * 0.9; // ~90% for mobile padding
    } else {
      // Desktop: estimate based on ModularSection column width
      // For 50% width columns in a ~1200px container = ~600px
      const estimatedContainerWidth = Math.min(windowWidth * 0.8, 1200); // Max container width
      containerWidth = estimatedContainerWidth * 0.5; // Assuming 50% column width
    }
    
    // Calculate height using aspect ratio: height = width * (heightRatio / widthRatio)
    const calculatedHeight = Math.round(containerWidth * (heightRatio / widthRatio));
    
    return `${calculatedHeight}px`;
  };

  // Calculate dimensions with performance considerations
  const responsiveHeight = getResponsiveHeight(height, aspectRatio, mobileAspectRatio, windowWidth);
  
  const modelStyle: React.CSSProperties = {
    width: width || '100%',
    height: responsiveHeight,
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
      <div className={`model-viewer-container ${className}`} style={{ width: '100%' }}>
        <div className="flex items-center justify-center h-64 bg-base-200 rounded-xl border-2 border-dashed border-base-300">
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
      <div className={`model-viewer-container ${className}`} style={{ width: '100%' }}>
        <div className="flex items-center justify-center h-64 bg-base-200 rounded-xl">
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
      style={{ width: '100%' }}
      role="img" 
      aria-label={alt}
    >
      <div className="relative">
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
          className: "w-full rounded-xl bg-base-100", // Theme background class
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

      {/* Controls info */}
      <details className="mt-2 inline-block">
        <summary className="text-xs text-base-content/50 cursor-pointer hover:text-base-content/70">
          3D controls
        </summary>
        <div className="text-xs text-base-content/60 mt-1">
          <p className="hidden sm:block">Mouse: Click and drag to rotate • Scroll to zoom • Right-click and drag to pan</p>
          <p>Touch: Drag to rotate • Pinch to zoom • Two-finger drag to pan</p>
          {ar && canActivateAR && <p className="text-primary">Tap AR button for augmented reality view</p>}
          {ar && !canActivateAR && isLoaded && (
            <p className="text-warning">AR requires mobile device with ARCore (Android) or ARKit (iOS)</p>
          )}
        </div>
      </details>
    </div>
  );
}
