import React from 'react';
import Grid from '@mui/material/Grid';
import AlbumCard from './AlbumCard';

function AlbumGrid({ albums, onAlbumSelect, onAddAlbum }) {
  return (
    <Grid container spacing={1}>
      {/* The add new album */}
      <Grid item xs={12} sm={6} md={5} lg={2}>
        <AlbumCard 
          album={{ title: '', coverUrl: "/images/NewAlbum.jpg" }} 
          onSelect={onAddAlbum}
          isNew={true}
        />
      </Grid>
      {/* Edit existing albums */}
      {albums.map(album => (
        <Grid key={album.id} item xs={12} sm={6} md={5} lg={2}>
          <AlbumCard album={{title: album.title, artist: album.artist.name, artistId: album.artistId, coverUrl: "/images/AlbumCover.jpg"}} onSelect={() => onAlbumSelect(album)} />
        </Grid>
      ))}
    </Grid>
  );
}

export default AlbumGrid;