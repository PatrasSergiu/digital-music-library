import React from 'react';
import ArtistCard from './ArtistCard';
import { Box } from '@mui/material';

function ArtistGrid({ artists, onArtistSelect, onAddArtist, onDelete }) {

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '26px', padding: '8px' }}>
            {/* Add new artist card */}
            <ArtistCard
                artist={{ name: '', coverUrl: "/images/NewAlbum.jpg" }}
                onSelect={onAddArtist}
                isNew={true}
            />
            {/* Existing artists */}
            {artists.map(artist => (
                <ArtistCard
                    key={artist.id}
                    artist={artist}
                    isNew={false}
                    onDelete={() => onDelete(artist)}
                    onSelect={() => onArtistSelect(artist)}
                />
            ))}
        </Box>
    );
}

export default ArtistGrid;
