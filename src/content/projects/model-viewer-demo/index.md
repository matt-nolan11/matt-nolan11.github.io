---
title: "Model Viewer Demo"
description: "Demonstration of the new 3D model viewer functionality"
cover: "./cover.png"
startDate: "2025-01"
status: "completed"
tags: ["demo", "3d-models", "interactive"]
sections:
  - columns:
    - type: "content"
      title: "3D Model Integration"
      content: |
        This page demonstrates the new interactive 3D model viewer functionality
        that has been integrated into the modular content system.
        
        **Features:**
        - Interactive camera controls (orbit, zoom, pan)
        - Auto-rotation option
        - Augmented Reality support on mobile devices
        - Progressive loading with poster images
        - Responsive sizing options
        - Environmental lighting and shadows
        
        The 3D model viewer uses Google's model-viewer web component and supports
        industry-standard GLTF and GLB 3D model formats.
        
        **Performance optimizations:**
        - Hardware acceleration for smooth rotation
        - Adaptive quality based on device capabilities
        - Optimized rendering pipeline for reduced stuttering
        - Smooth animation timing and reduced rotation speed
        
    - type: "model"
      title: "Sample 3D Model"
      modelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
      alt: "Interactive 3D model of an astronaut"
      poster: "https://modelviewer.dev/shared-assets/models/Astronaut.webp"
      caption: "Demo 3D model using default <model-viewer> astronaut"
      modelOptions:
        autoRotate: true
        cameraControls: true
        ar: true
        size: "medium"
        exposureCompensation: 1
        shadowIntensity: 0.8
        shadowSoftness: 1.2
        interactionPrompt: "auto"
        loading: "lazy"
        
  - columns:
    - type: "model"
      title: "Different Size Example"
      modelSrc: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb"
      alt: "Interactive 3D model of an expressive robot"
      modelOptions:
        autoRotate: false
        cameraControls: true
        size: "small"
        exposureCompensation: 0.8
        shadowIntensity: 0.5
        
    - type: "content"
      title: "Usage in Projects"
      content: |
        ### Adding 3D Models to Your Content
        
        To add a 3D model to any modular section, use the `model` column type:
        
        ```yaml
        - type: "model"
          title: "Your Model Title"
          modelSrc: "./path/to/model.glb"
          alt: "Description for accessibility"
          poster: "./loading-image.jpg"
          caption: "Optional caption"
          modelOptions:
            autoRotate: true
            cameraControls: true
            ar: true
            size: "large"
        ```
        
        **Supported formats:**
        - GLTF (.gltf) - Text-based format
        - GLB (.glb) - Binary format (recommended)
        
        **Best practices:**
        - Optimize models for web (under 10MB recommended)
        - Include poster images for faster loading
        - Use descriptive alt text for accessibility
        - Test AR functionality on mobile devices
        
        **AR Requirements:**
        - iOS devices with ARKit support (iPhone 6s and newer)
        - Android devices with ARCore support
        - HTTPS connection (required for AR)
        - Compatible browser (Chrome, Safari, Firefox)
        
        **AR Troubleshooting for Android/Pixel 6:**
        - **Install Google Play Services for AR** from Play Store
        - **Update Chrome** to latest version (88+ required)
        - **Check ARCore support**: Visit [ar-check.com](https://ar-check.com) to verify
        - **Enable camera permissions** for the browser
        - **Try clearing browser cache** and cookies
        - **Restart Chrome** after installing/updating ARCore
        
        **Note:** AR button only appears when device/browser supports it!
        Check browser console for AR debug information.
        
  - columns:
    - type: "content"
      title: "Technical Implementation"
      content: |
        The 3D model viewer integration includes:
        
        **Schema Updates:**
        - Added `model` as a new column type in content schemas
        - Comprehensive `modelOptions` configuration object
        - Support for all major model-viewer features
        
        **Components:**
        - `ModelViewer.tsx` - React wrapper for Google's model-viewer
        - TypeScript definitions for better development experience
        - Responsive sizing and accessibility features
        
        **Documentation:**
        - Updated quick reference guide
        - Comprehensive usage examples
        - Best practices for 3D content
        
        **AR Debug Features:**
        - Console logging for AR capability detection
        - Detailed error messages for AR issues
        - Browser and device compatibility checking
        - Real-time AR support status updates
        
        This implementation provides a professional-grade 3D viewing
        experience that integrates seamlessly with the existing
        modular content architecture.

  - columns:
    - type: "content"
      title: "AR Debugging Guide"
      content: |
        ### For Pixel 6 Users Having AR Issues:
        
        **Step 1: Check Prerequisites**
        - Ensure you're on **HTTPS** (check URL starts with https://)
        - Update **Chrome to version 88+**
        - Install **Google Play Services for AR** from Play Store
        
        **Step 2: Verify ARCore**
        - Visit [developers.google.com/ar/discover/supported-devices](https://developers.google.com/ar/discover/supported-devices)
        - Pixel 6 is definitely supported, so ARCore should work
        - Try the **ARCore sample apps** from Play Store to test
        
        **Step 3: Browser Debugging**
        - Open **Chrome DevTools** (F12)
        - Check the **Console** tab for AR debug messages
        - Look for any error messages about WebXR or AR
        
        **Step 4: Common Fixes**
        - **Clear browser data** (cache, cookies, site data)
        - **Restart Chrome** completely
        - **Check camera permissions** are granted
        - **Try incognito mode** to rule out extensions
        
        **Step 5: Alternative Test**
        - Visit [modelviewer.dev](https://modelviewer.dev) directly
        - Try their AR examples to isolate the issue
        
        If AR still doesn't work, the issue might be ARCore installation
        or Chrome's WebXR implementation on your specific device.
---

# 3D Model Viewer Integration

This project demonstrates the successful integration of interactive 3D model viewing capabilities into the portfolio's modular content system. The implementation supports modern web standards and provides an engaging way to showcase 3D designs, CAD models, and interactive prototypes.

## Key Benefits

- **Interactive Experience**: Users can examine models from all angles
- **Mobile AR Support**: View models in real-world environments
- **Performance Optimized**: Progressive loading and efficient rendering
- **Accessibility Compliant**: Screen reader support and keyboard navigation
- **Responsive Design**: Adapts to all screen sizes and devices

The model viewer uses industry-standard GLTF/GLB formats and integrates with the existing Astro, React, and TailwindCSS stack while maintaining the site's performance and accessibility standards.
