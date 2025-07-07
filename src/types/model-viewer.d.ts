// Type declarations for @google/model-viewer
declare module '@google/model-viewer' {
  export interface ModelViewerElement extends HTMLElement {
    // Model source and loading
    src: string;
    alt: string;
    poster?: string;
    loading: 'auto' | 'lazy' | 'eager';
    reveal: 'auto' | 'interaction' | 'manual';
    
    // Camera controls
    cameraControls: boolean;
    cameraOrbit: string;
    cameraTarget: string;
    fieldOfView: string;
    minCameraOrbit: string;
    maxCameraOrbit: string;
    minFieldOfView: string;
    maxFieldOfView: string;
    
    // Auto-rotation
    autoRotate: boolean;
    autoRotateDelay: number;
    rotationPerSecond: string;
    
    // Interaction
    interactionPrompt: 'auto' | 'when-focused' | 'none';
    interactionPromptStyle: 'basic' | 'wiggle';
    interactionPromptThreshold: number;
    
    // Environment and lighting
    environmentImage?: string;
    skyboxImage?: string;
    shadowIntensity: number;
    shadowSoftness: number;
    exposureCompensation: number;
    
    // Animation
    animationName?: string;
    animationCrossfadeDuration: number;
    autoplay: boolean;
    
    // AR support
    ar: boolean;
    arModes: string;
    arScale: 'auto' | 'fixed';
    arPlacement: 'floor' | 'wall';
    iosSource?: string;
    
    // Other properties
    bounds: 'tight' | 'legacy';
    withCredentials: boolean;
    
    // Methods
    play(options?: { repetitions?: number }): void;
    pause(): void;
    getDimensions(): { x: number; y: number; z: number };
    getCameraOrbit(): { theta: number; phi: number; radius: number };
    jumpCameraToGoal(): void;
    updateFraming(): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    toBlob(options?: { mimeType?: string; qualityArgument?: number; idealAspect?: boolean }): Promise<Blob>;
    
    // AR methods
    canActivateAR: boolean;
    activateAR(): Promise<void>;
    
    // Event handlers
    addEventListener(type: 'load', listener: (event: CustomEvent) => void): void;
    addEventListener(type: 'error', listener: (event: CustomEvent) => void): void;
    addEventListener(type: 'progress', listener: (event: CustomEvent<{ totalProgress: number }>) => void): void;
    addEventListener(type: 'camera-change', listener: (event: CustomEvent) => void): void;
    addEventListener(type: 'ar-status', listener: (event: CustomEvent) => void): void;
  }
}

// Extend JSX elements to include model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': Partial<{
        src: string;
        alt: string;
        poster: string;
        loading: 'auto' | 'lazy' | 'eager';
        reveal: 'auto' | 'interaction' | 'manual';
        'camera-controls': boolean | string;
        'camera-orbit': string;
        'camera-target': string;
        'field-of-view': string;
        'min-camera-orbit': string;
        'max-camera-orbit': string;
        'min-field-of-view': string;
        'max-field-of-view': string;
        'auto-rotate': boolean | string;
        'auto-rotate-delay': number | string;
        'rotation-per-second': string;
        'interaction-prompt': 'auto' | 'when-focused' | 'none';
        'interaction-prompt-style': 'basic' | 'wiggle';
        'interaction-prompt-threshold': number | string;
        'environment-image': string;
        'skybox-image': string;
        'shadow-intensity': number | string;
        'shadow-softness': number | string;
        'exposure-compensation': number | string;
        'animation-name': string;
        'animation-crossfade-duration': number | string;
        autoplay: boolean | string;
        ar: boolean | string;
        'ar-modes': string;
        'ar-scale': 'auto' | 'fixed';
        'ar-placement': 'floor' | 'wall';
        'ios-src': string;
        bounds: 'tight' | 'legacy';
        'with-credentials': boolean | string;
        style?: React.CSSProperties;
        className?: string;
        ref?: React.RefObject<ModelViewerElement>;
        slot?: string;
        [key: string]: any;
      }>;
    }
  }
}

export {};
