import { useState } from 'react'
import { Box, Button, CssBaseline } from '@mui/material'
import { Add } from '@mui/icons-material'
import AssetGallery from './components/AssetGallery'
import AssetUploadDrawer from './components/AssetUploadDrawer'

function App() {
  const [assets, setAssets] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentAsset, setCurrentAsset] = useState(null)

  const handleAddAsset = () => {
    setCurrentAsset(null)
    setIsDrawerOpen(true)
  }

  const handleSaveAsset = (asset) => {
    if (currentAsset) {
      // Update existing asset
      setAssets(assets.map(a => a.id === asset.id ? asset : a))
    } else {
      // Add new asset
      setAssets([...assets, { ...asset, id: Date.now() }])
    }
    setIsDrawerOpen(false)
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
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
          onEdit={(asset) => {
            setCurrentAsset(asset)
            setIsDrawerOpen(true)
          }}
        />

        <AssetUploadDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveAsset}
          asset={currentAsset}
        />
      </Box>
    </>
  )
}

export default App