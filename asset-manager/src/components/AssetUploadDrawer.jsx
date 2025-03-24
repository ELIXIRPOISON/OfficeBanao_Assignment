import { useState, useRef } from 'react';
import { 
  Drawer, 
  Box, 
  Button, 
  TextField, 
  IconButton, 
  Stack, 
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent
} from '@mui/material';
import { 
  Close, 
  Rotate90DegreesCw, 
  Flip, 
  Crop, 
  SwapHoriz,
  CloudUpload,
  Check,
  Clear
} from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AssetUploadDrawer = ({ open, onClose, onSave, asset }) => {
  const [description, setDescription] = useState(asset?.description || '');
  const [image, setImage] = useState(asset?.image || null);
  const [crop, setCrop] = useState();
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempCrop, setTempCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        // Reset transformations when new image is selected
        setCrop(undefined);
        setRotation(0);
        setFlipHorizontal(false);
        setFlipVertical(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAssetClick = () => {
    fileInputRef.current.click();
  };

  const handleReplaceImage = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    onSave({
      id: asset?.id || Date.now(),
      description,
      image,
      crop,
      rotation,
      flipHorizontal,
      flipVertical
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleStartCropping = () => {
    setTempCrop(crop || { unit: '%', width: 100, height: 100 });
    setIsCropping(true);
  };

  const handleApplyCrop = () => {
    setCrop(tempCrop);
    setIsCropping(false);
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
  };

  return (
    <>
      {/* Crop Editor Dialog */}
      <Dialog open={isCropping} onClose={handleCancelCrop} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ReactCrop
              crop={tempCrop}
              onChange={setTempCrop}
              onComplete={setTempCrop}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={image}
                alt="Crop Preview"
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  display: 'block'
                }}
              />
            </ReactCrop>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button 
            onClick={handleCancelCrop} 
            variant="outlined" 
            color="error"
            startIcon={<Clear />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApplyCrop} 
            variant="contained" 
            color="success"
            startIcon={<Check />}
          >
            Apply Crop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Drawer */}
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={onClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 1150 } } }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {asset ? 'Edit Asset' : 'Add Asset'}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {!image ? (
            <Box
              onClick={handleAddAssetClick}
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'background.paper',
                flexGrow: 1,
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
          ) : (
            <>
              <Box sx={{ mb: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                {crop ? (
                  <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                    aspect={1}
                  >
                    <img
                      ref={imgRef}
                      src={image}
                      alt="Preview"
                      style={{
                        transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                        maxWidth: '100%',
                        display: 'block'
                      }}
                    />
                  </ReactCrop>
                ) : (
                  <img
                    src={image}
                    alt="Preview"
                    style={{
                      transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                      width: '100%',
                      display: 'block'
                    }}
                  />
                )}
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <IconButton 
                  onClick={handleRotate}
                  color="primary"
                  title="Rotate 90°"
                >
                  <Rotate90DegreesCw />
                </IconButton>
                <IconButton 
                  onClick={() => setFlipHorizontal((prev) => !prev)}
                  color={flipHorizontal ? 'primary' : 'default'}
                  title="Flip horizontal"
                >
                  <Flip />
                </IconButton>
                <IconButton 
                  onClick={() => setFlipVertical((prev) => !prev)}
                  color={flipVertical ? 'primary' : 'default'}
                  title="Flip vertical"
                >
                  <SwapHoriz />
                </IconButton>
                <IconButton
                  onClick={handleStartCropping}
                  color={crop ? 'primary' : 'default'}
                  title="Crop Image"
                >
                  <Crop />
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={handleReplaceImage}
                  sx={{ ml: 'auto' }}
                >
                  Replace Image
                </Button>
              </Stack>
            </>
          )}

          <TextField
            label="Asset Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Enter a description for this asset"
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSave}
            disabled={!image}
          >
            {asset ? 'Update Asset' : 'Upload Image'}
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default AssetUploadDrawer;