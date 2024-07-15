import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import AlbumGrid from '../components/AlbumGrid';
import SideMenu from '../components/SideMenu';
import NewAlbumDialog from '../components/NewAlbumDialog';
import { fetchAlbums } from '../api/albumApi';
import { getSongsByAlbum } from '../controllers/albumController';


const artists = [
  { id: 1, name: "Tame Impala" },
  { id: 2, name: "Mansionz" },
];

function Dashboard() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([])

  useEffect(() => {
    const loadAlbums = async () => {
      const fetchedAlbums = await fetchAlbums();
      setAlbums(fetchedAlbums);
    };

    loadAlbums();
  }, []);

  const handleAlbumSelect = async (album) => {
    setSelectedAlbum(album);
    const songsByAlbum = await getSongsByAlbum(album.id);
    console.log(songsByAlbum);
    setSongs(songsByAlbum);
    setIsSideMenuOpen(true);
  };

  const handleCloseSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleNewAlbumAdded = (albumData) => {
    const newAlbum = {
      id: albums.length + 1,
      title: albumData.title,
      artist: albumData.artist,
    };
    setAlbums([...albums, newAlbum]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteSong = (songId) => {
    setSongs(songs.filter(song => song.id !== songId));
  } 

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
        My Albums
      </Typography>
      <AlbumGrid albums={albums} onAlbumSelect={handleAlbumSelect} onAddAlbum={handleOpenAddDialog} />
      {selectedAlbum && (
        <SideMenu album={selectedAlbum}
          songs={songs}
          onSave={(id, songData) => console.log("Edit song", songData)}
          onDelete={handleDeleteSong}
          onClose={handleCloseSideMenu}
          isOpen={isSideMenuOpen}
        />
      )}
      <NewAlbumDialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleNewAlbumAdded}
        artists={artists}
      />
    </Box>
  );
}

export default Dashboard;
