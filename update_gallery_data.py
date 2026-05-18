#!/usr/bin/env python3
"""
Script to automatically update gallery data files when new images are added.
This script scans image directories and updates the corresponding TypeScript files.
"""

import os
import json
from pathlib import Path

def scan_directory(directory_path, category, year):
    """Scan a directory and return image data."""
    images = []
    path = Path(directory_path)

    if not path.exists():
        print(f"Directory {directory_path} does not exist")
        return images

    # Get all image files
    image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    image_files = []

    for ext in image_extensions:
        image_files.extend(path.glob(f'*{ext}'))
        image_files.extend(path.glob(f'*{ext.upper()}'))

    # Sort files for consistent ordering
    image_files.sort()

    for i, img_file in enumerate(image_files, 1):
        # Skip optimized images
        if '_optimized' in img_file.name:
            continue

        filename = img_file.name
        name_without_ext = img_file.stem

        images.append({
            "id": i,
            "category": category,
            "year": year,
            "src": f"/images/{path.name}/{filename}",
            "alt": f"{category.title()} - {name_without_ext}",
            "description": f"{category.title()} event"
        })

    return images

def generate_typescript_file(images, filename, array_name):
    """Generate TypeScript file content."""
    content = f"export const {array_name} = [\n"

    for img in images:
        content += f"""  {{
    id: {img['id']},
    category: "{img['category']}",
    year: "{img['year']}",
    src: "{img['src']}",
    alt: "{img['alt']}",
    description: "{img['description']}"
  }},\n"""

    content += "];\n"
    return content

def update_gallery_data():
    """Update all gallery data files."""

    # Configuration for different galleries
    galleries = [
        {
            "directory": "public/images/MCL 25",
            "category": "cricket",
            "year": "2024-25",
            "filename": "src/components/Gallery/mclImages.ts",
            "array_name": "mclImages"
        },
        {
            "directory": "public/images/badmintonleague",
            "category": "badminton",
            "year": "2024-25",
            "filename": "src/components/Gallery/badmintonImages.ts",
            "array_name": "badmintonImages"
        },
        {
            "directory": "public/images/daman jpeg",
            "category": "trip",
            "year": "2024-25",
            "filename": "src/components/Gallery/damanImages.ts",
            "array_name": "damanImages"
        }
    ]

    for gallery in galleries:
        print(f"Processing {gallery['directory']}...")

        images = scan_directory(gallery['directory'], gallery['category'], gallery['year'])

        if images:
            content = generate_typescript_file(images, gallery['filename'], gallery['array_name'])

            with open(gallery['filename'], 'w') as f:
                f.write(content)

            print(f"Updated {gallery['filename']} with {len(images)} images")
        else:
            print(f"No images found in {gallery['directory']}")

def main():
    print("Updating gallery data files...")
    update_gallery_data()
    print("Gallery data update complete!")

if __name__ == "__main__":
    main()
