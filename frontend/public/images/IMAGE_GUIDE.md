# Image Requirements for MicroPropiedad Frontend

## Required Images

### Building Images (`public/images/buildings/`)

1. **hero-building.jpg** (1920x1080px)
   - Modern apartment or commercial building
   - High quality, professional photography
   - Will be used as hero background with overlay
   - **Sources**:
     - [Unsplash](https://unsplash.com/s/photos/modern-apartment-building)
     - [Pexels](https://www.pexels.com/search/modern%20real%20estate/)
   - **Recommended search**: "modern apartment building exterior"

2. **building-1.jpg, building-2.jpg, building-3.jpg** (800x600px)
   - Property images for marketplace demo
   - Diverse types (residential, commercial, mixed-use)
   - **Sources**: Same as above
   - **Recommended searches**:
     - "apartment building facade"
     - "commercial real estate"
     - "mixed use building"

### Wallet Icons (`public/images/wallets/`)

These are optional since we're using emoji placeholders. If you want actual wallet logos:

1. **xverse.svg** - Xverse wallet logo
2. **leather.svg** - Leather wallet logo
3. **hiro.svg** - Hiro wallet logo

**Note**: Currently using emoji placeholders (💼, 🎒, 🔐) to avoid licensing issues.

## Quick Setup

### Option 1: Use Unsplash API (Recommended for Demo)
```bash
# Download hero image
curl -L "https://source.unsplash.com/1920x1080/?modern-building,architecture" -o public/images/buildings/hero-building.jpg

# Download property images
curl -L "https://source.unsplash.com/800x600/?apartment-building" -o public/images/buildings/building-1.jpg
curl -L "https://source.unsplash.com/800x600/?commercial-building" -o public/images/buildings/building-2.jpg
curl -L "https://source.unsplash.com/800x600/?real-estate-building" -o public/images/buildings/building-3.jpg
```

### Option 2: Manual Download
1. Visit [Unsplash](https://unsplash.com) or [Pexels](https://www.pexels.com)
2. Search for "modern apartment building"
3. Download high-quality images (free license)
4. Rename and place in `public/images/buildings/`

### Option 3: Use Placeholders
For quick testing, we can use placeholder services:
- https://placehold.co/1920x1080/0066CC/white
- https://picsum.photos/1920/1080

## Image Optimization

Images are automatically optimized by Next.js Image component:
- Responsive sizing
- Lazy loading
- WebP format conversion
- Automatic quality adjustment

## License Compliance

Make sure any images you use are:
- ✅ Free for commercial use
- ✅ No attribution required (or attribution provided)
- ✅ High resolution and professional quality

**Recommended platforms**:
- Unsplash: Free, no attribution required
- Pexels: Free, no attribution required
- Pixabay: Free, no attribution required

## Current Status

- ✅ Logo created (SVG)
- ⏳ Building images needed
- ✅ Wallet icons (using emoji placeholders)
