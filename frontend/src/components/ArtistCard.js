import React from 'react';
import { Card, CardActionArea, CardMedia, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ArtistCard({ artist, onSelect, isNew, onDelete, onEdit }) {
    const { name, coverUrl } = artist;

    return (
        <Box sx={{ maxWidth: 400, m: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Card sx={{ width: '100%', backgroundColor: 'transparent', boxShadow: 'none', borderRadius: '16px', position: 'relative' }}>
                <CardActionArea onClick={() => onSelect(artist)}>
                    <CardMedia
                        component="img"
                        image={coverUrl || '/images/DefaultArtist.jpg'}
                        alt={`Image of ${name}`}
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
                                onSelect(artist);
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
            <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mt: 0.5 }}>
                    {name}
                </Typography>
            </Box>
        </Box>
    );
}

export default ArtistCard;