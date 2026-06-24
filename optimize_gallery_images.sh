#!/bin/bash

# Image optimization script for gallery images
# This script creates optimized versions of gallery images

echo "Starting gallery image optimization..."

# Create optimized directory
mkdir -p public/images/optimized

# Function to optimize a single image
optimize_image() {
    local input="$1"
    local output="$2"
    local max_width="${3:-1200}"
    local quality="${4:-85}"

    if command -v convert >/dev/null 2>&1; then
        # Use ImageMagick if available
        convert "$input" -resize "${max_width}x${max_width}>" -quality "$quality" "$output"
        echo "Optimized (ImageMagick): $input -> $output"
    elif command -v ffmpeg >/dev/null 2>&1; then
        # Use FFmpeg as fallback
        ffmpeg -i "$input" -vf "scale='min($max_width,iw)':'min($max_width,ih)':force_original_aspect_ratio=decrease" -q:v "$((100-quality/5))" "$output" -y >/dev/null 2>&1
        echo "Optimized (FFmpeg): $input -> $output"
    else
        # Copy file if no optimization tools available
        cp "$input" "$output"
        echo "Copied (no optimization tools): $input -> $output"
    fi
}

# Optimize images from each directory
for dir in "badmintonleague" "daman jpeg" "MCL 25"; do
    if [ -d "public/images/$dir" ]; then
        echo "Processing $dir..."
        mkdir -p "public/images/optimized/$dir"

        for img in "public/images/$dir"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
            if [ -f "$img" ]; then
                filename=$(basename "$img")
                optimize_image "$img" "public/images/optimized/$dir/${filename%.*}_optimized.jpg" 1200 85
            fi
        done
    fi
done

# Also optimize lovable-uploads images
if [ -d "public/lovable-uploads" ]; then
    echo "Processing lovable-uploads..."
    mkdir -p "public/images/optimized/lovable-uploads"

    for img in public/lovable-uploads/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            optimize_image "$img" "public/images/optimized/lovable-uploads/${filename%.*}_optimized.jpg" 800 85
        fi
    done
fi

echo "Gallery image optimization completed!"
echo "Optimized images are available in public/images/optimized/"
