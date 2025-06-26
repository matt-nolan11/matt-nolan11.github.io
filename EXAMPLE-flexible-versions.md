---
title: "Simple Project Example"
description: "Demonstrating flexible version structure with both minimal and detailed versions."
cover: "./cover.png"
startDate: "2024-01"
status: "in-progress"
tags: ["example", "flexible-versions"]

versions:
  # Minimal version - just the essentials
  - version: "v1.0"
    title: "Basic Implementation"
    description: "Initial working prototype with core functionality."
    startDate: "2024-01"
    endDate: "2024-02"
    status: "completed"
    # No content, achievements, learnings, or githubUrl - all optional!

  # Moderate version - some extras
  - version: "v2.0"
    title: "Feature Enhancement"
    description: "Added key features and improved performance."
    startDate: "2024-03"
    endDate: "2024-04"
    status: "completed"
    githubUrl: "https://github.com/example/project/tree/v2.0"
    achievements:
      - "Improved performance by 50%"
      - "Added user authentication"
    # No content or learnings - still optional!

  # Full version - rich documentation
  - version: "v3.0"
    title: "Complete Redesign"
    description: "Full system architecture overhaul with modern technologies."
    startDate: "2024-05"
    status: "in-progress"
    githubUrl: "https://github.com/example/project/tree/v3.0-dev"
    achievements:
      - "Migrated to microservices architecture"
      - "Implemented real-time features"
    learnings:
      - "Microservices add complexity but improve scalability"
      - "Real-time features require careful state management"
    content: |
      This version represents a complete architectural overhaul of the system.
      
      ## Architecture Changes
      
      The move to microservices brought several benefits:
      - **Independent scaling** of different components
      - **Technology diversity** - each service can use optimal tools
      - **Fault isolation** - issues in one service don't crash the system
      
      ## Implementation Details
      
      ```typescript
      // Example service communication
      class UserService {
        async getUser(id: string): Promise<User> {
          return await this.database.findUser(id);
        }
      }
      ```
      
      ## Current Status
      
      The migration is 70% complete with core services operational.
---

# Simple Project Example

This project demonstrates the flexible version structure where you can mix minimal and detailed versions based on your needs.

## Key Benefits

- **Start simple**: Add just version, title, description, and dates
- **Enhance gradually**: Add achievements and learnings as projects evolve  
- **Document thoroughly**: Include rich markdown content for complex versions
- **Link resources**: Add GitHub URLs when repositories are available

## Use Cases

- **Early projects**: Minimal documentation while still tracking progress
- **Learning projects**: Focus on achievements and learnings
- **Professional projects**: Full documentation with technical details
- **Open source**: Include repository links and comprehensive guides
