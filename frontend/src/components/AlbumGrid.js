import React from 'react';
import AlbumCard from './AlbumCard';
import { Box } from '@mui/material';

function AlbumGrid({ albums, onAlbumSelect, onAddAlbum, onDelete, onEdit }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '26px', padding: '8px' }}>
      {/* Add new album card */}
      <AlbumCard 
        album={{ title: '', coverUrl: "/images/NewAlbum.jpg" }}
        onSelect={onAddAlbum}
        isNew={true}
      />

      {/* Existing albums */}
      {albums.map(album => (
        <AlbumCard
          key={album.id}
          album={{ title: album.title, artist: album.artist.name, artistId: album.artistId, coverUrl: "/images/AlbumCover.jpg" }}
          onSelect={() => onAlbumSelect(album)}
          onDelete={() => onDelete(album)}
          onEdit={() => onEdit(album)}
        />
      ))}
    </Box>
  );
}

export default AlbumGrid;
