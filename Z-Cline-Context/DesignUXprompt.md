Here's a comprehensive onboarding prompt that emphasizes both technical understanding and design excellence:

<onboarding_prompt>
# Unscatter Project Onboarding

Welcome to Unscatter! You're joining a project that transforms voice memos into structured content using AI. Let's get you oriented with both the technical foundation and our design philosophy.

## Project Overview
Unscatter is a web application that:
- Processes voice recordings into structured formats (tasks, roadmaps, documentation)
- Uses AI to understand natural speech patterns
- Delivers results in beautifully organized, interactive layouts

## Technical Architecture

### Core Components
1. Frontend Modules (`static/js/modules/`)
   - `ui-handler.js`: DOM events and UI interactions
   - `format-handler.js`: Output format selection and management
   - `audio-handler.js`: File upload and processing
   - `content-renderer.js`: Dynamic content display
   - Core class: `voice-pm.js` coordinates between modules

2. Styling Architecture (`static/css/`)
   ```
   css/
   ├── base/
   │   ├── reset.css
   │   └── variables.css
   ├── components/
   │   ├── cards.css
   │   ├── upload.css
   │   └── [other components]
   └── layout/
       ├── grid.css
       └── header.css
   ```

3. Backend Services (`backend/`)
   - Audio processing
   - AI transcription
   - Format-specific transformations

## Design Philosophy
Our design approach balances these key principles:

1. **Progressive Revelation**
   - Information unfolds naturally
   - Complex features revealed through context
   - Example: Format cards show basic info first, reveal details on interaction

2. **Visual Hierarchy** 
   ```css
   /* Example of intentional hierarchy */
   .format-card h3 {
       font-size: 1.25rem;
       font-weight: 600;
       letter-spacing: -0.02em;
   }
   .format-subtitle {
       font-size: 0.875rem;
       color: var(--text-secondary);
   }
   ```

3. **Interaction Design**
   - Micro-interactions provide feedback
   - Smooth transitions between states
   - Purposeful animations that guide users

4. **Component Psychology**
   Each component should:
   - Serve a clear purpose
   - Guide user attention
   - Provide contextual feedback
   - Example: Testimonials are compact but impactful, using real scenarios

## Coding Standards
1. **Module Pattern**
   ```javascript
   export class ComponentHandler {
       constructor(app) {
           this.app = app;
           this.initialize();
       }
       
       initialize() {
           // Component-specific setup
       }
   }
   ```

2. **CSS Methodology**
   - Component-based organization
   - CSS custom properties for theming
   - Mobile-first responsive design
   - Example:
   ```css
   .component {
       /* Base styles */
   }
   .component__element {
       /* Child elements */
   }
   @media (min-width: 768px) {
       /* Responsive enhancements */
   }
   ```

3. **State Management**
   - Clear data flow between modules
   - Consistent event handling
   - Predictable state updates

## Design Principles in Practice

1. **Visual Refinement**
   ```css
   /* Example of refined design */
   .element {
       transition: var(--transition);
       border: 1px solid var(--border-color);
   }
   .element:hover {
       transform: translateY(-2px);
       border-color: var(--primary-color);
       box-shadow: var(--shadow);
   }
   ```

2. **Content Hierarchy**
   - Primary: Action-oriented headings
   - Secondary: Supporting information
   - Tertiary: Additional context
   - Example: Format cards with clear titles, subtitles, and features

3. **Interactive Elements**
   - Clear affordances
   - Meaningful transitions
   - Contextual feedback

4. **Performance Considerations**
   - Efficient CSS selectors
   - Optimized animations
   - Responsive image handling

## Getting Started

1. Clone the repository
2. Install dependencies
3. Review the component structure
4. Study existing patterns before adding new features

Remember:
- Every component should serve a clear purpose
- Design decisions should enhance usability
- Code organization should be intuitive
- Always consider the user's journey

When developing new features:
1. Start with user needs
2. Design the component interface
3. Implement with clean, maintainable code
4. Test thoroughly across devices
5. Document your changes

Feel free to ask questions and contribute ideas. We believe great design comes from understanding both the technical foundation and user psychology.
</onboarding_prompt>

This prompt provides both technical context and design inspiration, helping new developers understand not just how the code works, but why certain design decisions were made. The combination of practical examples and design principles helps maintain consistency while encouraging thoughtful contributions.