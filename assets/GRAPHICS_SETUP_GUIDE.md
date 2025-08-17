# Graphics Setup Guide for iPad Integration

## 📱 iPad-Optimized Setup (1620 x 2160px)

Your graphics have been designed for iPad screens. Follow this guide to integrate them properly.

## 📁 File Placement Instructions

### 1. Background Image
**File to place:** `room-background.png`
**Location:** `assets/room-background.png`
**Size:** 1620 x 2160px (iPad portrait orientation)

### 2. Device Graphics
Place your device graphics in the `assets/devices/` folder:

| Device Type | Filename | Recommended Size | Description |
|-------------|----------|------------------|-------------|
| Television | `tv.png` | 120x80px | Flat-screen TV displays |
| Amplifier | `amplifier.png` | 80x60px | Audio amplifiers |
| Q-SYS Core | `qsys-core.png` | 80x60px | Q-SYS processor |
| Encoder | `encoder.png` | 60x40px | Video encoders |
| Receiver | `receiver.png` | 60x40px | Video receivers |
| Cable Box | `cable-box.png` | 70x50px | Cable/satellite boxes |
| Blu-ray | `bluray-player.png` | 70x50px | Blu-ray players |
| Laptop | `laptop-input.png` | 70x50px | Laptop inputs |
| Streaming | `streaming-box.png` | 70x50px | Streaming devices |

## 🎯 Quick Setup Steps

1. **Copy your background image** to `assets/room-background.png`
2. **Create device graphics** for each device type listed above
3. **Place device graphics** in `assets/devices/` folder
4. **Test the interface** by opening `index.html` in a browser

## 🔧 Configuration Already Updated

The system has been configured for your iPad dimensions:
- Room size: 1620 x 2160px
- Responsive design for iPad portrait orientation
- Optimized touch targets for tablet use

## 📱 iPad-Specific Features

- **Touch-friendly buttons** - Larger touch targets
- **Portrait orientation** - Optimized for iPad vertical layout
- **Responsive scaling** - Automatically adjusts to screen size
- **Smooth animations** - Optimized for tablet performance

## 🎨 Graphics Requirements

### Format
- **File type:** PNG with transparency
- **Color space:** RGB
- **Resolution:** 72 DPI (web standard)

### Design Guidelines
- **Transparent backgrounds** for clean layering
- **Consistent sizing** within each device type
- **Professional appearance** suitable for commercial use
- **Good contrast** for visibility on various backgrounds

## 🚀 Testing Your Setup

1. **Open `index.html`** in a web browser
2. **Check device positioning** - devices should appear in the room view
3. **Test interactions** - click devices to see if they respond
4. **Verify graphics** - ensure all images load correctly

## 🔍 Troubleshooting

### Graphics Not Appearing?
- Check file names match exactly (case-sensitive)
- Verify PNG format with transparency
- Ensure files are in correct directories

### Wrong Sizing?
- The system automatically scales graphics
- Adjust device sizes in `js/config.js` if needed
- Check CSS device specifications in `css/devices.css`

### iPad Layout Issues?
- The system is optimized for iPad portrait (1620 x 2160px)
- Test on actual iPad or iPad simulator
- Check responsive design in browser dev tools

## 📞 Next Steps

Once your graphics are in place:
1. **Test the interface** on your target device
2. **Adjust device positions** in `js/config.js` if needed
3. **Customize colors** in `css/main.css` to match your brand
4. **Deploy to your control system**

Your AV control system is ready to go! 🎉 