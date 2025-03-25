import { useState, useRef } from 'react';
import { Box, Button, CssBaseline, Typography } from '@mui/material';
import { Add, CloudUpload } from '@mui/icons-material';
import AssetGallery from './components/AssetGallery';
import AssetUploadDrawer from './components/AssetUploadDrawer';

function App() {
  const [assets, setAssets] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [initialImage, setInitialImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddAsset = () => {
    setCurrentAsset(null);
    setInitialImage(null);
    setIsDrawerOpen(true);
  };

  const handleEditAsset = (asset) => {
    setCurrentAsset(asset);
    setInitialImage(null);
    setIsDrawerOpen(true);
  };

  const handleSaveAsset = (asset) => {
    if (currentAsset) {
      // Update existing asset
      setAssets(assets.map(a => a.id === asset.id ? asset : a));
    } else {
      // Add new asset
      setAssets([...assets, { ...asset, id: Date.now() }]);
    }
    setIsDrawerOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setInitialImage(reader.result);
        setIsDrawerOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {assets.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Box
              onClick={handleUploadClick}
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'background.default',
                width: '100%',
                height: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Click to select an image
              </Typography>
              <Typography variant="body2" color="text.disabled" mt={1}>
                Supports: JPEG, PNG, WEBP
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleUploadClick}
            >
              Add Asset
            </Button>
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddAsset}
              sx={{ mb: 3 }}
            >
              Add Asset
            </Button>
            <AssetGallery 
              assets={assets} 
              onEdit={handleEditAsset}
            />
          </>
        )}

        <AssetUploadDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveAsset}
          asset={currentAsset}
          initialImage={initialImage}
        />
      </Box>
    </>
  );
}

export default App;