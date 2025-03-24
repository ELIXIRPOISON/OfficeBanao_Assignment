import { useState, useCallback, useRef } from 'react';
import { 
  Drawer, 
  Box, 
  Button, 
  TextField, 
  IconButton, 
  Stack, 
  Typography,
  Divider
} from '@mui/material';
import { 
  Close, 
  Rotate90DegreesCw, 
  Flip, 
  Crop, 
  SwapHoriz,
  CloudUpload
} from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AssetUploadDrawer = ({ open, onClose, onSave, asset }) => {
  const [description, setDescription] = useState(asset?.description || '');
  const [image, setImage] = useState(asset?.image || null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return image; // Return original if no crop
    }

    const imageElement = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;
    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    ctx.drawImage(
      imageElement,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop, rotation, flipHorizontal, flipVertical, image]);

  const handleReplaceImage = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    const finalImage = await generateCroppedImage();
    onSave({
      id: asset?.id || Date.now(),
      description,
      image: finalImage || image
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleStartCropping = async () => {
    if (!disabled) {
      // When finishing cropping
      const croppedImage = await generateCroppedImage();
      if (croppedImage) {
        setImage(croppedImage);
        setCrop(undefined);
        setCompletedCrop(null);
      }
    }
    setDisabled(!disabled);
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 450 } } }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {!image ? (
          <Box
            onClick={handleReplaceImage}
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
            <Box sx={{ 
              mb: 3, 
              position: 'relative', 
              overflow: 'hidden', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                disabled={disabled}
                style={{ maxHeight: '400px' }}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Preview"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                    maxWidth: '100%',
                    maxHeight: '400px',
                    display: 'block'
                  }}
                  onLoad={() => {
                    setCrop(undefined);
                    setCompletedCrop(null);
                  }}
                />
              </ReactCrop>
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
                color={!disabled ? 'primary' : 'default'}
                title={disabled ? 'Start Cropping' : 'Apply Crop'}
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
          sx={{ mt: 'auto' }}
        >
          {asset ? 'Update Asset' : 'Save Asset'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AssetUploadDrawer;