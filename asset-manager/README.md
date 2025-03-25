# Asset Management System

A responsive asset management system built with React and Material UI that allows users to:

- Upload images (JPEG, PNG, WEBP)
- Edit images with cropping, rotation, and flipping tools
- Add descriptions to assets
- View assets in a responsive masonry grid
- Edit existing assets

## Key Features

### 1. Image Upload and Management
- Drag-and-drop upload interface for easy image selection
- Initial upload state when no assets exist
- Gallery view that automatically appears after the first upload
- Responsive masonry grid that adapts to different screen sizes

### 2. Image Editing Tools
- Crop functionality with interactive crop selection
- Rotation (90° increments)
- Flip horizontal/vertical
- Real-time preview of all edits
- Image replacement option

### 3. Asset Management
- Add new assets with descriptions
- Edit existing assets (image and description)
- Responsive design works on all device sizes
- Material UI components for consistent styling

## Component Structure

### 1. `App.jsx`
The main component that manages the application state and flow.

#### Key Functions:
- `handleAddAsset()` - Opens the upload drawer for new assets
- `handleEditAsset(asset)` - Opens the upload drawer with existing asset data
- `handleSaveAsset(asset)` - Saves new or updated assets
- `handleFileChange(e)` - Handles file selection and prepares for editing
- `handleUploadClick()` - Triggers the file input dialog

### 2. `AssetGallery.jsx`
Displays all assets in a responsive masonry grid.

#### Props:
- `assets` - Array of asset objects to display
- `onEdit` - Function to call when the edit button is clicked

### 3. `AssetUploadDrawer.jsx`
The editing interface that slides in from the right.

#### Key Functions:
- `generateCroppedImage()` - Creates the final cropped/edited image
- `handleFileChange(e)` - Handles new image selection
- `handleSave()` - Prepares and saves the edited asset
- `handleRotate()` - Rotates the image 90°
- `handleStartCropping()` - Applies or cancels crop mode
- `toggleEditTools()` - Shows/hides the editing toolbar

#### Props:
- `open` - Boolean to control drawer visibility
- `onClose` - Function to close the drawer
- `onSave` - Function to save the asset
- `asset` - Existing asset data when editing
- `initialImage` - New image data when creating

## Installation

### Clone the repository:
```bash
git clone https://github.com/yourusername/asset-management-system.git
cd asset-management-system
```

### Install dependencies:
```bash
npm install
```

### Start the development server:
```bash
npm run dev
```

## Dependencies
- React 18+
- Material UI 5+
- react-image-crop
- react-masonry-css

## Available Scripts
- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint
- `npm run preview` - Previews the production build

## License
This project is licensed under the MIT License.

---
Feel free to contribute and enhance this project!
