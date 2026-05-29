#!/usr/bin/env python3

import os
import glob

def generate_images_from_directory(directory_path, category, year, description, start_id=1):
    """Generate image objects from a directory"""
    images = []
    
    if os.path.exists(directory_path):
        # Get all image files, sorted
        image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp']
        files = []
        for ext in image_extensions:
            files.extend(glob.glob(os.path.join(directory_path, ext)))
            files.extend(glob.glob(os.path.join(directory_path, ext.upper())))
        
        files = sorted(files)
        
        for i, filepath in enumerate(files):
            filename = os.path.basename(filepath)
            # Skip zip files and other non-image files
            if filename.lower().endswith('.zip'):
                continue
                
            # Create relative path for src
            relative_path = os.path.relpath(filepath, 'public')
            src_path = f"/{relative_path.replace(os.sep, '/')}"
            
            # Clean filename for alt text
            clean_name = filename.replace('.jpg', '').replace('.jpeg', '').replace('.png', '').replace('.webp', '').replace('-Enhanced-NR', '')
            
            images.append({
                "id": start_id + i,
                "category": category,
                "year": year,
                "src": src_path,
                "alt": f"{description} - {clean_name}",
                "description": description
            })
    
    return images

def generate_ts_module(images, export_name):
    """Generate TypeScript module from image array"""
    ts_code = f"export const {export_name} = [\n"
    for img in images:
        ts_code += f"  {{\n"
        ts_code += f"    id: {img['id']},\n"
        ts_code += f"    category: \"{img['category']}\",\n"
        ts_code += f"    year: \"{img['year']}\",\n"
        ts_code += f"    src: \"{img['src']}\",\n"
        ts_code += f"    alt: \"{img['alt']}\",\n"
        ts_code += f"    description: \"{img['description']}\"\n"
        ts_code += f"  }},\n"
    ts_code += "];\n"
    return ts_code

def update_gallery_modules():
    """Update all gallery image modules"""
    
    # Define all image directories and their configurations
    image_configs = [
        {
            "directory": "public/images/MCL 25",
            "category": "cricket",
            "year": "2024-25",
            "description": "Mixed Cricket League 2025",
            "export_name": "mclImages",
            "output_file": "src/components/Gallery/mclImages.ts"
        },
        {
            "directory": "public/images/badmintonleague",
            "category": "badminton",
            "year": "2024-25",
            "description": "Badminton League",
            "export_name": "badmintonImages",
            "output_file": "src/components/Gallery/badmintonImages.ts"
        },
        {
            "directory": "public/images/daman jpeg",
            "category": "trip",
            "year": "2024-25",
            "description": "Daman Trip",
            "export_name": "damanImages",
            "output_file": "src/components/Gallery/damanImages.ts"
        }
    ]
    
    total_images = 0
    
    print("🔄 Updating all gallery image modules...")
    print("=" * 50)
    
    for config in image_configs:
        print(f"\n📁 Processing: {config['directory']}")
        
        images = generate_images_from_directory(
            config['directory'],
            config['category'],
            config['year'],
            config['description']
        )
        
        if images:
            ts_module = generate_ts_module(images, config['export_name'])
            
            # Ensure the directory exists
            os.makedirs(os.path.dirname(config['output_file']), exist_ok=True)
            
            # Write the TypeScript module
            with open(config['output_file'], 'w') as f:
                f.write(ts_module)
            
            print(f"✅ Generated {config['output_file']} with {len(images)} images")
            print(f"   Category: {config['category']}")
            print(f"   Year: {config['year']}")
            print(f"   Description: {config['description']}")
            
            total_images += len(images)
        else:
            print(f"⚠️  No images found in {config['directory']}")
    
    print("\n" + "=" * 50)
    print(f"🎉 Total images processed: {total_images}")
    print("✅ All gallery modules updated successfully!")
    print("\n📝 Next steps:")
    print("   1. The TypeScript modules have been regenerated")
    print("   2. GalleryGrid.tsx will automatically use the updated images")
    print("   3. Run your development server to see the changes")

def main():
    try:
        update_gallery_modules()
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please check that all directories exist and have proper permissions.")

if __name__ == "__main__":
    main()
