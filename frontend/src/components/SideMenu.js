import React, { useState, useEffect } from 'react';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    IconButton, Typography, TextField, Box, Button, Card, CardMedia, CardContent
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationDialog from './ConfirmationDialog';
import { toast } from 'react-toastify';
import { deleteSong } from '../controllers/songController';
import { deleteAlbum } from '../controllers/albumController';

function SideMenu({ album, songs, onSave, onDelete, onDeleteAlbum, onClose, isOpen }) {
    const [editableSongs, setEditableSongs] = useState(songs);
    const [editMode, setEditMode] = useState({});
    const [confirmSongDeleteOpen, setConfirmSongDeleteOpen] = useState(false);
    const [confirmAlbumDeleteOpen, setConfirmAlbumDeleteOpen] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);

    useEffect(() => {
        setEditableSongs(songs);
    }, [songs])

    const toggleEdit = (songId, song) => {
        setEditMode({ [songId]: true });
        setEditableSongs(prev => prev.map(s => s.id === songId ? { ...s, ...song } : s));
    };

    const handleInputChange = (songId, field, value) => {
        const updatedSongs = editableSongs.map(song =>
            song.id === songId ? { ...song, [field]: value } : song
        );
        setEditableSongs(updatedSongs);
    };

    const validateDuration = (duration) => {
        return /^[0-5]?[0-9]:[0-5][0-9]$/.test(duration);
    };

    const handleSaveSong = (songId) => {
        const foundSong = editableSongs.find(song => song.id === songId);
        if (!validateDuration(foundSong.length)) {
            toast.error("Invalid duration format. Please use MM:SS.");
            return;
        }
        if (foundSong.title.length < 1) {
            toast.error("Name of the song must not be empty.");
            return;
        }
        onSave(songId, foundSong);
        setEditMode({ [songId]: false });
    };

    const handleAddSong = () => {
        const newSongId = -1;
        const newSong = { id: newSongId, title: '', artist: album.artist.name, artistId: album.artistId, albumId: album.id, length: '', isEditing: false };
        setEditableSongs([...editableSongs, newSong]);
        toggleEdit(newSongId, newSong);
    };

    const handleDeleteClick = (id) => {
        setSongToDelete(id);
        setConfirmSongDeleteOpen(true);
    };

    const handleDeleteConfirmed = () => {
        toast.promise(
            deleteSong(songToDelete),
            {
                pending: 'Deleting song...',
                success: 'Song deleted successfully!',
                error: 'Failed to delete song!'
            }
        ).then(() => {
            setEditableSongs(prevSongs => prevSongs.filter(song => song.id !== songToDelete));
            onDelete(songToDelete);
        }).catch((error) => {
            console.error("Deletion failed:", error);
        }).finally(() => {
            setConfirmSongDeleteOpen(false);
            setSongToDelete(null);
        });
    };

    const handleCancelEdit = (songId) => {
        if (!songs.some(s => s.id === songId)) {
            setEditableSongs(editableSongs.filter(song => song.id !== songId));
        }
        setEditMode({ [songId]: false });
        setConfirmSongDeleteOpen(false);
    };

    const handleDeleteAlbum = () => {
        setConfirmAlbumDeleteOpen(true);
    };

    const handleConfirmDeleteAlbum = () => {
        toast.promise(
            deleteAlbum(album.id),
            {
                pending: 'Deleting album...',
                success: 'Album deleted successfully!',
                error: 'Failed to delete album!'
            }
        ).then(() => {
            onDeleteAlbum();
        }).catch((error) => {
            console.error("Deletion failed:", error);
        });
    };
    const handleCancelDelete = () => {
        setConfirmSongDeleteOpen(false);
        setConfirmAlbumDeleteOpen(false);
        setSongToDelete(null);
    };

    return (
        <Drawer
            variant="temporary"
            anchor="right"
            open={isOpen}
            onClose={onClose}
            sx={{
                width: '40%',
                '& .MuiDrawer-paper': {
                    width: '40%',
                    boxSizing: 'border-box',
                    backgroundColor: '#333',
                    color: 'white'
                }
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <Card sx={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <CardMedia
                        component="img"
                        image={album.coverUrl || '/images/AlbumCover.jpg'}
                        alt="Album cover"
                        sx={{ width: 200, height: 200, borderRadius: '80%', fontSize: 16 }}
                    />  
                </Card>
                <Typography variant="h6" sx={{ mt: 1, color: 'white', fontSize: 40 }}>{album.title}</Typography>
                <Typography variant="body2" sx={{ color: 'gray', textAlign: 'center' }}>{album.description}</Typography>
            </Box>
            <List>
                {editableSongs.map(song => (
                    <ListItem key={song.id} sx={{ borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {editMode[song.id] ? (
                            <EditingRow
                                song={song}
                                handleInputChange={handleInputChange}
                                handleSaveSong={() => handleSaveSong(song.id)}
                                handleCancelEdit={() => handleCancelEdit(song.id)}
                            />
                        ) : (
                            <NormalRow
                                song={song}
                                artist={album.artist.name}
                                toggleEdit={() => toggleEdit(song.id, song)}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                    </ListItem>
                ))}
                <ListItem button onClick={handleAddSong}>
                    <ListItemIcon>
                        <AddCircleOutlineIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Add Song" primaryTypographyProps={{ sx: { color: 'white' } }} />
                </ListItem>
            </List>
            <ConfirmationDialog
                open={confirmSongDeleteOpen}
                onClose={() => handleCancelEdit(songToDelete)}
                onConfirm={handleDeleteConfirmed}
                title="Confirm Deletion"
            >
                Are you sure you want to delete this song?
            </ConfirmationDialog>
            <ConfirmationDialog
                open={confirmAlbumDeleteOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDeleteAlbum}
                title="Confirm Album Deletion"
                children="Are you sure? Deleting the album will also delete all the songs from it."
            />
        </Drawer>
    );
}

function EditingRow({ song, handleInputChange, handleSaveSong, handleCancelEdit }) {
    return (
        <>
            <TextField
                value={song.title}
                onChange={(e) => handleInputChange(song.id, 'title', e.target.value)}
                size="small"
                sx={{ flex: 1, marginRight: 1, '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
                value={song.length}
                onChange={(e) => handleInputChange(song.id, 'length', e.target.value)}
                size="small"
                sx={{ width: '100px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <IconButton onClick={handleSaveSong}>
                <SaveIcon sx={{ color: 'white' }} />
            </IconButton>
            <IconButton onClick={handleCancelEdit}>
                <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
        </>
    );
}

function NormalRow({ song, toggleEdit, handleDeleteClick, artist }) {
    return (
        <>
            <ListItemText
                primary={<Typography sx={{ color: 'white' }}>{song.title}</Typography>}
                secondary={<Typography sx={{ color: 'gray' }}>{artist}</Typography>}
                sx={{ flex: '1 1 auto', minWidth: 0, mr: 2, color: 'white' }}
            />
            <Typography sx={{ width: '100px', textAlign: 'right', color: 'white' }}>{song.length}</Typography>
            <IconButton onClick={() => toggleEdit(song.id)}>
                <EditIcon sx={{ color: 'white' }} />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(song.id)}>
                <DeleteIcon sx={{ color: 'white' }} />
            </IconButton>
        </>
    );
}

export default SideMenu;