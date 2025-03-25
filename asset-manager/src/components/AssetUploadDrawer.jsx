import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  Button, 
  TextField, 
  IconButton, 
  Stack, 
  Typography,
  Divider,
} from '@mui/material';
import { 
  Close, 
  Rotate90DegreesCw, 
  Flip, 
  Crop, 
  SwapVert,
  CloudUpload,
  Check,
  KeyboardArrowDown,
  Edit
} from '@mui/icons-material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AssetUploadDrawer = ({ open, onClose, onSave, asset, initialImage }) => {
  const [description, setDescription] = useState(asset?.description || '');
  const [image, setImage] = useState(asset?.image || initialImage || null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showEditTools, setShowEditTools] = useState(false);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
      setDescription('');
    }
  }, [initialImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setCrop(undefined);
        setCompletedCrop(null);
        setRotation(0);
        setFlipHorizontal(false);
        setFlipVertical(false);
        setDisabled(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return image;
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
      const croppedImage = await generateCroppedImage();
      if (croppedImage) {
        setImage(croppedImage);
        setCrop(undefined);
        setCompletedCrop(null);
      }
    }
    setDisabled(!disabled);
    setShowEditTools(false);
  };

  const toggleEditTools = () => {
    setShowEditTools(!showEditTools);
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { width: '100%' } }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {asset ? 'Edit Asset' : 'Add Asset'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>

        <Divider />

        <Box sx={{ display: 'flex', gap: 4, flexGrow: 1 }}>
          {/* Image Area (70% width) */}
          <Box sx={{ flex: 1, position: 'relative', maxWidth: '70%' }}>
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
                  backgroundColor: 'background.default',
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
            ) : (
              <Box sx={{ position: 'relative', height: '60vh' }}>
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  disabled={disabled}
                  style={{ maxHeight: '100%' }}
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Preview"
                    style={{
                      transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                      maxHeight: '60vh',
                      display: 'block'
                    }}
                    onLoad={() => {
                      setCrop(undefined);
                      setCompletedCrop(null);
                    }}
                  />
                </ReactCrop>

                {!disabled ? (
                  <Button
                    variant="contained"
                    onClick={handleStartCropping}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1
                    }}
                    startIcon={<Check />}
                  >
                    Apply Crop
                  </Button>
                ) : (
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    borderRadius: 1,
                    boxShadow: 1,
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    <IconButton
                      onClick={toggleEditTools}
                      sx={{
                        backgroundColor: 'action.hover',
                        '&:hover': {
                          backgroundColor: 'background.default'
                        }
                      }}
                    >
                      {showEditTools ? <Close /> : <Edit />}
                    </IconButton>

                    {showEditTools && (
                      <>
                        <IconButton 
                          onClick={handleRotate}
                          color="primary"
                          title="Rotate 90°"
                          size="small"
                          sx={{
                            backgroundColor: 'action.hover',
                            '&:hover': {
                              backgroundColor: 'background.default'
                            }
                          }}
                        >
                          <Rotate90DegreesCw fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => setFlipHorizontal((prev) => !prev)}
                          color={flipHorizontal ? 'primary' : 'default'}
                          title="Flip horizontal"
                          size="small"
                          sx={{
                            backgroundColor: 'action.hover',
                            '&:hover': {
                              backgroundColor: 'background.default'
                            }
                          }}
                        >
                          <Flip fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => setFlipVertical((prev) => !prev)}
                          color={flipVertical ? 'primary' : 'default'}
                          title="Flip vertical"
                          size="small"
                          sx={{
                            backgroundColor: 'action.hover',
                            '&:hover': {
                              backgroundColor: 'background.default'
                            }
                          }}
                        >
                          <SwapVert fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setDisabled(false);
                            setShowEditTools(false);
                          }}
                          color={crop ? 'primary' : 'default'}
                          title="Crop Image"
                          size="small"
                          sx={{
                            backgroundColor: 'action.hover',
                            '&:hover': {
                              backgroundColor: 'background.default'
                            }
                          }}
                        >
                          <Crop fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={handleReplaceImage}
                          color="default"
                          title="Replace Image"
                          size="small"
                          sx={{
                            backgroundColor: 'action.hover',
                            '&:hover': {
                              backgroundColor: 'background.default'
                            }
                          }}
                        >
                          <CloudUpload fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Form Area (30% width) */}
          <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              value={description}
              placeholder='Enter Description'
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={8}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '200px',
                  alignItems: 'flex-start'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Space', 'Style', 'Package', 'Elements'].map((category) => (
                <Button
                  key={category}
                  variant="outlined"
                  size="small"
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: 'action.hover',
                    borderColor: 'divider'
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ alignSelf: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!image}
            sx={{ width: 200 }}
          >
            {asset ? 'Update Asset' : 'Upload Image'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AssetUploadDrawer;