import Masonry from 'react-masonry-css';
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

const AssetGallery = ({ assets, onEdit }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {assets.map((asset) => (
        <Card key={asset.id} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={asset.image}
            alt={asset.description}
            sx={{ height: 200, objectFit: 'cover' }}
          />
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" noWrap sx={{ maxWidth: '80%' }}>
                {asset.description || 'Untitled Asset'}
              </Typography>
              <IconButton 
                onClick={() => onEdit(asset)}
                size="small"
                sx={{ ml: 1 }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  );
};

export default AssetGallery;