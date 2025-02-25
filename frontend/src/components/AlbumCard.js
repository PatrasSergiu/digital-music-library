import React from 'react';
import { Card, CardActionArea, CardMedia, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'

function AlbumCard({ album, isNew, onSelect, onEdit, onDelete }) {
    const { title, artist, coverUrl } = album;

    const handleSelect = () => {
        onSelect(album);
    };

    return (
        <Box sx={{ maxWidth: 400, m: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Card sx={{ width: '100%', backgroundColor: 'transparent', boxShadow: 'none', borderRadius: '16px', position: 'relative' }}>
                <CardActionArea onClick={handleSelect}>
                    <CardMedia
                        component="img"
                        image={coverUrl || '/images/NewAlbum.jpg'}
                        alt={`Cover for ${title}`}
                        sx={{ height: 220, borderRadius: '16px' }}
                    />
                </CardActionArea>
                {!isNew && (
                    <>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                color: 'white',
                                visibility: 'hidden',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '.MuiCard-root:hover &': {
                                    visibility: 'visible'
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(artist);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: 'red',
                                visibility: 'hidden',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '.MuiCard-root:hover &': {
                                    visibility: 'visible'
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(artist);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
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