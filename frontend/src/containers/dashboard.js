import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, InputAdornment, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete'
import AlbumGrid from '../components/AlbumGrid';
import ArtistGrid from '../components/ArtistGrid';
import SideMenu from '../components/SideMenu';
import NewAlbumDialog from '../components/NewAlbumDialog';
import NewArtistDialog from '../components/NewArtistDialog';
import EditAlbumDialog from '../components/EditAlbumDialog';
import { fetchAlbums } from '../api/albumApi';
import { getSongsByAlbum } from '../controllers/albumController';
import { toast } from 'react-toastify';
import { addNewSong, updateSong } from '../controllers/songController';
import SearchIcon from '@mui/icons-material/Search';
import { deleteArtist } from '../controllers/artistController';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { deleteAlbum } from '../controllers/albumController';

function Dashboard() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAddAlbumDialogOpen, setIsAddAlbumDialogOpen] = useState(false);
  const [isAddArtistDialogOpen, setIsAddArtistDialogOpen] = useState(false);
  const [isEditAlbumDialogOpen, setIsEditAlbumDialogOpen] = useState(false);
  const [isEditArtistMode, setIsEditArtistMode] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [confirmAlbumDeleteOpen, setConfirmAlbumDeleteOpen] = useState(false);

  useEffect(() => {

    const loadAlbums = async () => {
      const fetchedAlbums = await fetchAlbums();
      setAlbums(fetchedAlbums);
      setFilteredAlbums(fetchedAlbums);
      const uniqueArtists = new Set();
      fetchedAlbums.forEach(album => {
        uniqueArtists.add(JSON.stringify(album.artist));
      });

      const artistArray = Array.from(uniqueArtists).map(artist => JSON.parse(artist));
      setArtists(artistArray);
      setFilteredArtists(artistArray);
    };

    loadAlbums();
  }, []);

  const handleSearchChangeAlbum = (event, newValue) => {
    setFilteredAlbums(albums.filter(album =>
      album.title.toLowerCase().includes(newValue.toLowerCase())
    ));
  };

  const handleSearchChangeArtists = (event, newValue) => {
    setFilteredArtists(artists.filter(artist =>
      artist.name.toLowerCase().includes(newValue.toLowerCase())
    ));
  };

  const handleAlbumSelect = async (album) => {
    setSelectedAlbum(album);
    toast.promise(
      getSongsByAlbum(album.id),
      {
        pending: 'Loading songs for the album...',
        error: 'Failed to load songs for the album.'
      }
    ).then(songsByAlbum => {
      setSongs(songsByAlbum);
      setIsSideMenuOpen(true);
    }).catch(error => {
      console.error('Error fetching songs:', error);
      setSongs([]);
    });
  };

  const handleCloseEditAlbumDialog = () => {
    setIsEditAlbumDialogOpen(false);
  };

  const handleArtistSelect = (artist) => {
    setCurrentArtist(artist);
    setIsEditArtistMode(true);
    setIsAddArtistDialogOpen(true);
  };


  const handleArtistDelete = (artist) => {
    const foundArtist = artists.filter(a => a.id === artist.id)[0];
    console.log(foundArtist)
    setArtistToDelete(foundArtist);
    setDeleteDialogOpen(true);
  };

  const handleCloseSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const handleOpenAddAlbumDialog = () => {
    setIsAddAlbumDialogOpen(true);
  };

  const handleOpenAddArtistDialog = () => {
    setIsAddArtistDialogOpen(true);
  }

  const handleCloseAddAlbumDialog = () => {
    setIsAddAlbumDialogOpen(false);
  };

  const handleCloseAddArtistDialog = () => {
    setIsAddArtistDialogOpen(false);
  }

  const handleNewAlbumAdded = (albumData) => {
    const updatedAlbums = [...albums, albumData];
    setAlbums(updatedAlbums);
    setFilteredAlbums(updatedAlbums);
    handleCloseAddArtistDialog();
  };

  const handleNewArtistAdded = (artistData) => {
    const updatedArtists = [...artists, artistData];
    setArtists(updatedArtists)
    setFilteredArtists(updatedArtists);
    handleCloseAddArtistDialog();
  };

  const handleUpdateArtist = async (artist) => {
    const updatedArtists = artists.map(a => a.id === artist.id ? artist : a);
    setArtists(updatedArtists);
    setFilteredArtists(updatedArtists);
    handleCloseAddArtistDialog();
    setIsEditArtistMode(false);
    setCurrentArtist(null);
  };

  const handleDeleteSong = (songId) => {
    setSongs(songs.filter(song => song.id !== songId));
  }

  const handleSaveSong = async (songId, songDetails) => {
    const songData = {
      title: songDetails.title,
      length: songDetails.length,
      albumId: selectedAlbum.id
    };

    if (songId === -1) {
      try {
        const addedSong = await toast.promise(
          addNewSong(songData),
          {
            pending: 'Processing...',
            success: 'Song successfully added!',
            error: 'Error adding song!'
          }
        );
        setSongs(prevSongs => [...prevSongs, { ...songData, id: addedSong.id }]);
      } catch (error) {
        console.error('Failed to add song:', error);
      }
    } else {
      try {
        const updatedSong = await toast.promise(
          updateSong(songId, songData),
          {
            pending: 'Processing...',
            success: 'Song successfully updated!',
            error: 'Error updating song!'
          }
        );
        setSongs(prevSongs =>
          prevSongs.map(song => song.id === songId ? { ...song, ...updatedSong } : song)
        );
      } catch (error) {
        console.error('Failed to update song:', error);
      }
    }
  };

  const handleAlbumConfirmDelete = () => {
    toast.promise(
      deleteAlbum(selectedAlbum.id),
      {
        pending: 'Deleting album...',
        success: 'Album deleted successfully!',
        error: 'Failed to delete album!'
      }
    ).then(() => {
      const updatedAlbums = albums.filter(album => album.id !== selectedAlbum.id);
      setAlbums(updatedAlbums);
      setFilteredAlbums(updatedAlbums);
    }).catch((error) => {
      console.error("Deletion failed:", error);
    }).finally(() => {
      setConfirmAlbumDeleteOpen(false);
      setSelectedAlbum(null);
    });
  };

  const handleCancelDelete = () => {
    setConfirmAlbumDeleteOpen(false);
  };

  const handleAlbumDelete = (album) => {
    setSelectedAlbum(album)
    setConfirmAlbumDeleteOpen(true);
  }

  const handleAlbumEdit = (album) => {
    setSelectedAlbum(album);
    setIsEditAlbumDialogOpen(true);
  }

  const handleUpdatedAlbum = (updatedAlbum) => {
    const newAlbums = albums.map(album => {
      if (album.id === updatedAlbum.id) {
        return { ...album, ...updatedAlbum };
      }
      return album;
    });
  
    setAlbums(newAlbums);
    setFilteredAlbums(newAlbums);
    setSelectedAlbum(null);
    setIsEditAlbumDialogOpen(false);
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setArtistToDelete(null);
  };
  const handleArtistConfirmDelete = () => {
    console.log("Attempting to delete artist:", artistToDelete);
    if (artistToDelete) {
      toast.promise(
        deleteArtist(artistToDelete.id),
        {
          pending: 'Deleting artist...',
          success: 'Artist successfully deleted!',
          error: 'Error deleting artist!'
        }
      ).then(() => {
        const updatedArtists = artists.filter(a => a.id !== artistToDelete.id);
        setArtists(updatedArtists);
        setFilteredArtists(updatedArtists);
        const updatedAlbums = albums.filter(album => album.artist.id !== artistToDelete.id);
        setAlbums(updatedAlbums);
        setFilteredAlbums(updatedAlbums);
      }).catch(error => {
        console.error('Failed to delete artist:', error);
      }).finally(() => {
        setDeleteDialogOpen(false);
        setArtistToDelete(null);
      });
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1, color: 'white', textAlign: 'left', marginLeft: 2 }}>
          My Albums
        </Typography>
        <Autocomplete
          freeSolo
          options={albums.map((option) => option.title)}
          onInputChange={handleSearchChangeAlbum}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search albums"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                style: { color: 'white', borderRadius: 20 }
              }}
              sx={{
                width: 300,
                '.MuiInputBase-root': { color: 'white', backgroundColor: '#444', borderRadius: 20 },
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }
              }}
              InputLabelProps={{ style: { color: 'white' } }}
            />
          )}
          PaperComponent={({ children }) => (
            <Paper style={{ background: '#333', color: 'white' }} elevation={3}>
              {children}
            </Paper>
          )}
          componentsProps={{
            paper: {
              sx: {
                backgroundColor: '#333',
                color: 'white',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: '#222'
                  }
                }
              }
            }
          }}
        />

      </Box>
      <AlbumGrid albums={filteredAlbums} onAlbumSelect={handleAlbumSelect} onAddAlbum={handleOpenAddAlbumDialog} onDelete={handleAlbumDelete} onEdit={handleAlbumEdit} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1, color: 'white', textAlign: 'left', marginLeft: 2 }}>
          My Artists
        </Typography>
        <Autocomplete
          freeSolo
          options={artists.map((option) => option.name)}
          onInputChange={handleSearchChangeArtists}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search artists"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                style: { color: 'white', borderRadius: 20 }
              }}
              sx={{
                width: 300,
                '.MuiInputBase-root': { color: 'white', backgroundColor: '#444', borderRadius: 20 },
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }
              }}
              InputLabelProps={{ style: { color: 'white' } }}
            />
          )}
          PaperComponent={({ children }) => (
            <Paper style={{ background: '#333', color: 'white' }} elevation={3}>
              {children}
            </Paper>
          )}
          componentsProps={{
            paper: {
              sx: {
                backgroundColor: '#333',
                color: 'white',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: '#222'
                  }
                }
              }
            }
          }}
        />

      </Box>
      <ArtistGrid artists={filteredArtists} onArtistSelect={handleArtistSelect} onAddArtist={handleOpenAddArtistDialog} onDelete={handleArtistDelete} />
      {selectedAlbum && (
        <SideMenu album={selectedAlbum}
          songs={songs}
          onSave={(id, songData) => handleSaveSong(id, songData)}
          onDelete={handleDeleteSong}
          onDeleteAlbum={handleAlbumDelete}
          onClose={handleCloseSideMenu}
          isOpen={isSideMenuOpen}
        />
      )}
      <NewAlbumDialog
        open={isAddAlbumDialogOpen}
        onClose={handleCloseAddAlbumDialog}
        onAdd={handleNewAlbumAdded}
        artists={artists}
      />
      <NewArtistDialog
        open={isAddArtistDialogOpen}
        onClose={() => { setIsAddArtistDialogOpen(false); setIsEditArtistMode(false); }}
        onAdd={handleNewArtistAdded}
        onUpdate={handleUpdateArtist}
        isEdit={isEditArtistMode}
        artist={currentArtist}
      />
      {selectedAlbum && (
        <EditAlbumDialog
          open={isEditAlbumDialogOpen}
          onClose={handleCloseEditAlbumDialog}
          album={selectedAlbum}
          onUpdate={handleUpdatedAlbum}
        />
      )}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        onConfirm={handleArtistConfirmDelete}
        onClose={() => handleCloseDeleteDialog()}
      >
        Are you sure you want to delete {artistToDelete?.name}? This action will delete all the of the artist's albums and songs.
      </ConfirmationDialog>
      <ConfirmationDialog
        open={confirmAlbumDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleAlbumConfirmDelete}
        title="Confirm Album Deletion"
        children="Are you sure? Deleting the album will also delete all the songs from it."
      />
    </Box>
  );
}

export default Dashboard;
