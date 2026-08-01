# Neural Stress Core

> **A cinematic, interactive digital stress ball built with Three.js, WebGL, and native browser APIs.**

Neural Stress Core is an immersive browser experience that transforms a simple stress ball into a futuristic energy core. Users can press, drag, and compress a glowing soft-body object while dynamic lighting, procedural audio, particle effects, and live telemetry respond in real time.

Unlike traditional stress-relief apps, Neural Stress Core is designed as a tactile visual experience that emphasizes interaction, atmosphere, and responsive feedback rather than gameplay or scoring.

---

# Overview

Neural Stress Core combines modern WebGL rendering with lightweight vanilla JavaScript to create a high-performance interactive simulation.

The project focuses on:

- Responsive 3D interaction
- Real-time visual feedback
- Dynamic lighting
- Procedural animation
- Ambient sound generation
- Futuristic interface design
- Smooth performance across desktop and mobile

Everything runs directly in the browser without frameworks or build tools.

---

# Philosophy

The experience is built around a single interaction:

> **Apply pressure. Release tension. Repeat.**

Every visual element supports this idea.

As the user compresses the energy core:

- geometry deforms
- lighting intensifies
- telemetry updates
- audio evolves
- the environment reacts

The result feels more like manipulating a living energy source than clicking a traditional UI element.

---

# Core Features

## Interactive Energy Core

The centerpiece of the application is a deformable glowing sphere rendered with layered geometry.

Users can:

- Click and drag
- Press and hold
- Compress the core
- Release accumulated pressure

The object reacts continuously while maintaining smooth animation.

---

## Real-Time Telemetry

A futuristic telemetry panel displays live system information including:

- Pressure level
- Core state
- Release counter

The interface updates instantly as users interact with the core.

---

## Dynamic Theme System

The experience includes three visual modes:

- **Ion** (cyan)
- **Void** (violet)
- **Solar** (amber)

Changing themes updates:

- Material colors
- Glow effects
- Lighting
- Interface accents
- Environmental highlights

All transitions occur seamlessly without reloading the scene.

---

## Procedural Audio

Rather than relying on prerecorded sound effects, Neural Stress Core generates ambient tones using the browser's Web Audio API.

The sound evolves based on pressure applied to the core.

Users can enable or disable sound at any time.

---

## Responsive Interface

The interface automatically adapts to:

- Desktop
- Tablets
- Mobile devices

Layout changes preserve usability while maintaining the immersive presentation.

---

# User Experience

The interaction loop is intentionally minimal.

```
User presses core
        ↓
Pressure increases
        ↓
Core compresses
        ↓
Lighting intensifies
        ↓
Audio changes
        ↓
Telemetry updates
        ↓
Release animation
        ↓
Counter increases
```

This creates a satisfying tactile rhythm without requiring instructions or tutorials.

---

# Project Structure

```
/
│
├── index.html
├── package.json
├── netlify.toml
├── README.md
│
└── src/
    ├── main.js
    └── style.css
```

---

# File Breakdown

## index.html

Provides the application's structure.

Major interface sections include:

- Fullscreen WebGL canvas
- Branding
- Sound controls
- Hero content
- Telemetry display
- Theme selector
- FPS indicator
- Flash overlay

The HTML remains intentionally lightweight because nearly all visuals are rendered dynamically through Three.js.

---

## main.js

The heart of the application.

This file contains:

- Three.js scene setup
- Camera configuration
- Lighting system
- Material creation
- Particle field generation
- Energy core construction
- Interaction handling
- Raycasting
- Theme switching
- Procedural audio
- Pressure simulation
- Animation loop
- Responsive resizing

Nearly every visual and interactive feature originates here.

---

## style.css

Defines the complete visual identity of the project.

It includes:

- Layout
- Typography
- Glassmorphism panels
- Responsive design
- Theme variables
- Interface animations
- Neon effects
- Mobile optimizations
- Accessibility improvements

The styling complements the 3D scene without distracting from it.

---

# Rendering Architecture

The application initializes in several stages.

```
Create renderer
        ↓
Create scene
        ↓
Configure camera
        ↓
Build lighting
        ↓
Generate particle field
        ↓
Construct energy core
        ↓
Initialize interface
        ↓
Start animation loop
```

Once initialized, rendering occurs continuously using `requestAnimationFrame`.

---

# Scene Composition

The energy core is built from multiple independent layers.

## Core

The primary deformable object rendered using a highly detailed icosahedron geometry.

Responsible for:

- Compression
- Emissive glow
- Physical material appearance

---

## Outer Shell

A transparent physical mesh surrounding the core.

Provides:

- Glass-like appearance
- Depth
- Refraction
- Energy containment effect

---

## Wireframe Layer

A low-opacity wireframe overlay that reinforces the futuristic aesthetic.

---

## Orbit Rings

Multiple torus meshes rotate around the core to create a sense of motion and energy.

---

## Glow Sprite

A procedurally generated radial glow that softens the scene and enhances the emissive effect.

---

## Ground Ring

A subtle illuminated ring anchors the object visually within the environment.

---

## Particle Field

Hundreds of floating particles surround the scene, creating a space-like atmosphere.

---

# Lighting System

The environment combines multiple light sources.

Including:

- Ambient light
- Key point light
- Rim light

Together they produce:

- High contrast
- Soft reflections
- Bright emissive highlights
- Depth perception

Tone mapping is configured using ACES Filmic rendering for cinematic color response.

---

# Interaction System

User input is handled through pointer interaction.

Internally the application tracks:

```
Pointer
    ↓
Raycaster
    ↓
Intersection
    ↓
Pressure value
    ↓
Geometry deformation
    ↓
Visual response
```

The interaction remains fluid regardless of frame rate.

---

# Telemetry System

The telemetry interface provides continuous feedback.

Metrics include:

### Pressure

Current compression level shown numerically and visually.

---

### State

Displays the current operational status of the energy core.

Examples include stable and compressed states.

---

### Releases

Counts the number of completed release cycles during the session.

---

# Theme Engine

Each theme consists of a shared configuration object.

Example properties include:

```javascript
{
    color,
    css,
    rgb
}
```

These values automatically propagate throughout the application.

Affected components include:

- Materials
- Lighting
- Glow
- Interface
- Particle colors
- CSS variables

This centralized approach makes adding future themes straightforward.

---

# Procedural Audio

Audio is generated dynamically using:

- Oscillators
- Gain nodes
- Frequency modulation

Pressure influences:

- Volume
- Pitch
- Intensity

Because the audio is synthesized in real time, no external audio assets are required.

---

# Visual Design

The interface blends modern UI trends with science-fiction aesthetics.

Design elements include:

- Glassmorphism
- Neon illumination
- Monospaced telemetry
- Cinematic typography
- Soft gradients
- Volumetric glow
- Space-inspired color palettes
- Minimalist controls

The goal is to feel more like a futuristic operating system than a conventional web page.

---

# Performance

Neural Stress Core is optimized for real-time rendering.

Performance techniques include:

- Hardware-accelerated WebGL rendering
- Efficient animation loop
- Additive blending
- Lightweight geometry
- Device pixel ratio scaling
- Responsive renderer resizing

The interface is designed to remain smooth across a wide range of devices.

---

# Responsive Design

The experience adapts automatically to different screen sizes.

Desktop prioritizes:

- Large cinematic presentation
- Side telemetry
- Spacious layout

Mobile adjusts:

- Telemetry positioning
- Typography scaling
- Touch interaction
- Interface spacing

Touch devices are fully supported.

---

# Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Three.js
- WebGL
- Canvas API
- Web Audio API
- Pointer Events
- RequestAnimationFrame

No frontend frameworks are used.

---

# Design Goals

Neural Stress Core was created around several guiding principles.

- **Immersive** — every interaction should feel tactile and responsive.
- **Minimal** — one core interaction, refined to feel satisfying.
- **Performant** — smooth rendering without unnecessary overhead.
- **Atmospheric** — visuals, lighting, and audio work together as a cohesive experience.
- **Maintainable** — clean separation between rendering, styling, and interface logic.

---

# Extensibility

Although intentionally focused, the architecture can support significant expansion.

Potential future enhancements include:

- Additional energy core designs
- Physics-based soft-body simulation
- Custom user themes
- Dynamic particle presets
- Haptic feedback profiles
- Breathing and meditation modes
- Interactive soundscapes
- Session tracking
- Ambient environments
- Multiplayer synchronized interactions
- VR or WebXR support

The current codebase provides a strong foundation for evolving the project into a larger interactive wellness or visualization platform.
