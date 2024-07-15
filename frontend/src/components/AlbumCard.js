import React from 'react';
import { Card, CardActionArea, CardMedia, Typography, Box } from '@mui/material';

function AlbumCard({ album, onSelect }) {
    const { title, artist, coverUrl } = album;

    const handleSelect = () => {
        onSelect(album);
    };

    return (
        <Box sx={{ maxWidth: 280, m: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ width: '100%', backgroundColor: 'transparent', boxShadow: 'none', borderRadius: '16px' }}>
                <CardActionArea onClick={handleSelect}>
                    <CardMedia
                        component="img"
                        image={coverUrl || '/images/NewAlbum.jpg'}
                        alt={`Cover for ${title}`}
                        sx={{ height: 200, borderRadius: '16px' }}
                    />
                </CardActionArea>
            </Card>
            <Box sx={{ textAlign: 'left', width: '100%' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mt: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray', mt: 0.5 }}>
                    {artist}
                </Typography>
            </Box>
        </Box>
    );
}

export default AlbumCard;
