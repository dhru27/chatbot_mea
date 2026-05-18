#!/usr/bin/env python3
"""
Image optimization script for gallery images.
This script compresses images and creates responsive versions.
"""

import os
import sys
from PIL import Image
import concurrent.futures
from pathlib import Path
import shutil

def optimize_image(input_path, output_path, max_size=(1200, 1200), quality=85):
    """Optimize a single image by resizing and compressing."""
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (for JPEG compatibility)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # Resize if larger than max_size
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Save with compression
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            print(f"Optimized: {input_path} -> {output_path}")

    except Exception as e:
        print(f"Error optimizing {input_path}: {e}")

def create_responsive_versions(input_path, output_dir):
    """Create multiple sizes for responsive images."""
    sizes = [
        (400, 400, 'small'),
        (800, 800, 'medium'),
        (1200, 1200, 'large')
    ]

    base_name = Path(input_path).stem
    extension = Path(input_path).suffix

    for width, height, size_name in sizes:
        output_path = output_dir / f"{base_name}_{size_name}{extension}"
        optimize_image(input_path, output_path, (width, height), quality=85)

def process_directory(input_dir, output_dir):
    """Process all images in a directory."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}

    image_files = [
        f for f in input_path.iterdir()
        if f.is_file() and f.suffix.lower() in image_extensions
    ]

    print(f"Found {len(image_files)} images in {input_dir}")

    # Process images in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        for img_file in image_files:
            output_file = output_path / f"{img_file.stem}_optimized{img_file.suffix}"
            futures.append(
                executor.submit(optimize_image, img_file, output_file)
            )

        # Wait for all to complete
        for future in concurrent.futures.as_completed(futures):
            pass

def main():
    """Main function to run the optimization."""
    if len(sys.argv) != 3:
        print("Usage: python optimize_images.py <input_dir> <output_dir>")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(input_dir):
        print(f"Input directory {input_dir} does not exist")
        sys.exit(1)

    print("Starting image optimization...")
    process_directory(input_dir, output_dir)
    print("Image optimization completed!")

if __name__ == "__main__":
    main()
