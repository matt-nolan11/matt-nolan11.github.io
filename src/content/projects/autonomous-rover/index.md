---
title: 'Autonomous Rover Project'
description: 'Solar-powered autonomous rover with computer vision and obstacle avoidance capabilities.'
cover: './cover.png'
gallery:
  - src: './cover.png'
    alt: 'Autonomous Rover - Full Assembly'
    caption: 'Complete rover showing solar panels, LIDAR, and camera systems'
  - src: './cover.png'
    alt: 'Rover Control System'
    caption: 'Raspberry Pi-based control system with sensor integration'
  - src: './cover.png'
    alt: 'Solar Power Array'
    caption: 'Flexible 100W solar panel configuration for extended autonomy'
  - src: './cover.png'
    alt: 'Computer Vision System'
    caption: 'Stereo camera setup for depth perception and object detection'
  - src: './cover.png'
    alt: 'Field Testing'
    caption: 'Rover navigating outdoor terrain during autonomous testing phase'
galleryPosition: 'dedicated-section'
galleryTitle: 'Project Highlights'
galleryOptions:
    size: 800
startDate: '2024-08'
endDate: '2024-12'
status: 'completed'
tags: ['robotics', 'autonomous', 'computer-vision', 'solar', 'outdoor', 'raspberry-pi', 'python', 'opencv', 'ros', 'lidar']
githubUrl: 'https://github.com/matt-nolan11/autonomous-rover'
draft: false
sections:
  - columns:
    - type: "content"
      title: "System Architecture"
      content: |
        The rover's architecture follows a modular design approach, enabling easy maintenance and upgrades. The system is divided into three main subsystems, each handling specific aspects of autonomous operation.
        
    - type: "sections"
      sections:
        - columns:
          - type: "content"
            title: "Control Layer"
            content: |
              **Primary Control Unit:**
              - Raspberry Pi 4B (8GB RAM)
              - Ubuntu 20.04 with ROS Noetic
              - Real-time task scheduling
              - Sensor fusion algorithms
              
          - type: "content"
            title: "Sensor Layer"
            content: |
              **Perception Systems:**
              - RPLIDAR A1M8 (12m range)
              - Intel RealSense D435i cameras
              - BNO085 9-axis IMU
              - GPS module with RTK capability
              
        - columns:
          - type: "content"
            title: "Power Management"
            content: |
              Advanced power management ensures continuous operation:
              
              - **Solar Charging**: MPPT controller optimizes energy harvest
              - **Battery Monitoring**: Real-time voltage and current sensing
              - **Load Balancing**: Dynamic power allocation based on mission priorities
              
          - type: "content"
            title: "Communication"
            content: |
              Multi-protocol communication system:
              
              - **LoRa**: Long-range telemetry (up to 10km)
              - **WiFi**: High-bandwidth data transfer when in range
              - **Emergency Beacon**: Satellite communication backup

  - columns:
    - type: "content"
      title: "Field Testing Results"
      content: |
        Extensive field testing was conducted over 6 weeks in varied terrain conditions to validate the rover's autonomous capabilities and endurance.
        
        ## Test Scenarios
        
        ### Urban Environment Testing
        - **Duration**: 2 weeks
        - **Conditions**: Sidewalks, parks, light traffic areas
        - **Results**: 98% navigation success rate
        
        ### Off-road Terrain Testing  
        - **Duration**: 3 weeks
        - **Conditions**: Grass, gravel, moderate slopes (up to 15°)
        - **Results**: 92% obstacle avoidance success
        
        ### Extended Autonomy Testing
        - **Duration**: 1 week continuous operation
        - **Conditions**: Mixed terrain with weather variations
        - **Results**: Successfully maintained operation through rain and varying light conditions

    - type: "gallery"
      gallery:
        - src: "./cover.png"
          alt: "Field Testing Setup"
          caption: "Rover configured for extended field testing with monitoring equipment"
        - src: "./cover.png"
          alt: "Terrain Navigation"
          caption: "Successfully navigating varied outdoor terrain autonomously"
        - src: "./cover.png"
          alt: "Data Collection"
          caption: "Real-time telemetry and sensor data during testing phase"
      galleryOptions:
        size: "medium"
        autoplay: true
        autoplayInterval: 5000
        showThumbnails: true
---

# Autonomous Rover Project

An exploration into autonomous outdoor robotics, featuring solar power, computer vision, and advanced navigation systems.

## Project Overview

This rover was designed to operate independently in outdoor environments for extended periods, using solar power and intelligent navigation to explore and map terrain.

## Key Features

### Autonomous Navigation
- **LIDAR-based mapping**: Real-time environment mapping
- **Computer vision**: Object detection and path planning
- **GPS integration**: Long-range navigation and positioning
- **Obstacle avoidance**: Dynamic path adjustment

### Power Systems
- **Solar panel array**: 100W flexible panels
- **Battery management**: LiFePO4 battery pack with smart charging
- **Power optimization**: Intelligent sleep/wake cycles

### Sensor Suite
- **LIDAR scanner**: 360-degree environmental sensing
- **RGB cameras**: Stereo vision setup for depth perception
- **IMU**: 9-axis motion tracking
- **Environmental sensors**: Temperature, humidity, UV index

## Technical Implementation

The rover runs on ROS (Robot Operating System) with custom Python nodes for:
- Sensor fusion and state estimation
- Path planning and navigation
- Power management
- Remote monitoring and control

## Performance Results

- **Operational time**: 8+ hours continuous operation
- **Navigation accuracy**: Sub-meter positioning
- **Obstacle detection**: 95% success rate in varied terrain
- **Power efficiency**: Maintained operation through 3-day field test

## Challenges Overcome

- **Weather resistance**: Sealed electronics and water-resistant design
- **Power optimization**: Balancing performance with energy consumption
- **Terrain handling**: Robust suspension and traction systems
- **Communication**: Long-range telemetry in remote areas

This project demonstrated the viability of long-term autonomous operation in challenging outdoor environments and served as a foundation for further research into planetary exploration robotics.

---

*Project duration approximately 5 months, including design, construction, and field testing phases.*