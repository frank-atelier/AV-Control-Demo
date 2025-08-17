# Assets Directory

This directory contains all graphics and images for the AV Control System interface.

## Directory Structure

```
assets/
├── room-background.png     # Axonometric room view background
├── devices/                # Individual device graphics
│   ├── tv.png             # Television displays
│   ├── amplifier.png      # Audio amplifiers
│   ├── qsys-core.png      # Q-SYS Core processor
│   ├── encoder.png        # Video encoders
│   ├── receiver.png       # Video receivers
│   ├── cable-box.png      # Cable/satellite boxes
│   ├── bluray-player.png  # Blu-ray players
│   ├── laptop-input.png   # Laptop input devices
│   └── streaming-box.png  # Streaming devices
└── README.md              # This file
```

## Graphics Requirements

### File Format
- **Format**: PNG with transparency
- **Color Space**: RGB
- **Resolution**: 72 DPI (for web)

### Device Graphics Specifications

#### Television Displays (tv.png)
- **Size**: 120x80px minimum
- **Style**: Modern flat-screen TV appearance
- **Features**: Screen area, bezel, stand/base
- **Colors**: Dark bezel, screen area for content indication

#### Audio Amplifiers (amplifier.png)
- **Size**: 80x60px minimum
- **Style**: Rack-mount or standalone amplifier
- **Features**: Ventilation grills, control knobs, status LEDs
- **Colors**: Black/silver case, colored status indicators

#### Q-SYS Core (qsys-core.png)
- **Size**: 80x60px minimum
- **Style**: Professional audio processor
- **Features**: Rack ears, display panel, control buttons
- **Colors**: Black case, blue/white display elements

#### Video Encoders (encoder.png)
- **Size**: 60x40px minimum
- **Style**: Compact network device
- **Features**: Ethernet ports, status LEDs, mounting brackets
- **Colors**: Black case, green/amber status lights

#### Video Receivers (receiver.png)
- **Size**: 60x40px minimum
- **Style**: Compact network device
- **Features**: Ethernet ports, HDMI outputs, status LEDs
- **Colors**: Black case, blue/white status indicators

#### Source Devices
- **Cable Box**: 70x50px, set-top box appearance
- **Blu-ray Player**: 70x50px, disc player with display
- **Laptop Input**: 70x50px, laptop or input panel
- **Streaming Box**: 70x50px, modern streaming device

### Room Background (room-background.png)
- **Size**: 1920x1080px (16:9 aspect ratio)
- **Style**: Axonometric/isometric view of the venue
- **Content**: Room layout, furniture, architectural elements
- **Colors**: Neutral tones, subtle details
- **Purpose**: Provides spatial context for device positioning

## Design Guidelines

### Visual Style
- **Consistent**: Maintain uniform visual language across all devices
- **Professional**: Clean, modern appearance suitable for commercial use
- **Scalable**: Graphics should look good at various sizes
- **Accessible**: Good contrast and clear visual hierarchy

### Color Palette
- **Primary**: Dark grays and blacks for device cases
- **Accent**: Blue/white for displays and status indicators
- **Status**: Green (online), amber (standby), red (offline/error)
- **Background**: Transparent or very light gray

### Technical Considerations
- **Transparency**: Use alpha channel for clean integration
- **Anti-aliasing**: Smooth edges for professional appearance
- **File Size**: Optimize for web delivery (under 50KB per device)
- **Layering**: Design for potential animation and state changes

## Creating Custom Graphics

### Software Recommendations
- **Adobe Illustrator**: Vector-based, scalable graphics
- **Adobe Photoshop**: Raster graphics with advanced effects
- **Figma**: Collaborative design with web export
- **Sketch**: Mac-based design tool
- **Inkscape**: Free vector graphics editor

### Workflow
1. **Research**: Study actual device appearances
2. **Sketch**: Create rough layouts and proportions
3. **Design**: Build vector or high-resolution raster graphics
4. **Export**: Save as PNG with transparency
5. **Test**: Verify appearance in the interface
6. **Optimize**: Compress for web delivery

### Naming Convention
- Use lowercase with hyphens: `device-type.png`
- Be descriptive but concise
- Include size variants if needed: `tv-large.png`, `tv-small.png`

## Integration

### CSS Integration
Graphics are referenced in `css/devices.css`:

```css
.device[data-device-type="tv"] .device-image {
    background-image: url('../assets/devices/tv.png');
}
```

### JavaScript Integration
Device types are defined in `js/config.js`:

```javascript
devices: {
    tv_main: {
        type: "tv",
        // ... other properties
    }
}
```

## Maintenance

### Version Control
- Keep original source files (AI, PSD, etc.) in separate directory
- Version graphics when making significant changes
- Document changes in commit messages

### Updates
- Test graphics across different screen sizes
- Verify transparency and layering effects
- Check performance impact of new graphics
- Update documentation when adding new device types

## Troubleshooting

### Common Issues
1. **Graphics not appearing**: Check file paths and case sensitivity
2. **Poor quality**: Ensure adequate resolution and anti-aliasing
3. **Wrong colors**: Verify color space and transparency settings
4. **Performance issues**: Optimize file sizes and use appropriate formats

### Best Practices
- Use consistent naming conventions
- Maintain organized file structure
- Test graphics in actual interface
- Keep backups of original source files
- Document design decisions and specifications 