import React, { useState } from 'react';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    IconButton, Typography, TextField, Box
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationDialog from './ConfirmationDialog';  // Ensure this import is correct

function SideMenu({ album, songs, onSave, onDelete, onClose, isOpen }) {
    const [editableSongs, setEditableSongs] = useState(songs);
    const [editMode, setEditMode] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);

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

    const handleSaveSong = (songId) => {
        onSave(songId, editableSongs.find(song => song.id === songId));
        setEditMode({ [songId]: false });
    };

    const handleAddSong = () => {
        const newSongId = Date.now();
        const newSong = { id: newSongId, title: '', artist: album.artist.name, artistId: album.artistId, duration: '', isEditing: false };
        setEditableSongs([...editableSongs, newSong]);
        toggleEdit(newSongId, newSong);
    };

    const handleDeleteClick = (id) => {
        setSongToDelete(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirmed = () => {
        onDelete(songToDelete);
        setEditableSongs(editableSongs.filter(song => song.id !== songToDelete));
        setConfirmOpen(false);
        setSongToDelete(null);
    };

    const handleCancelEdit = (songId) => {
        if (!songs.some(s => s.id === songId)) {
            // If the song was being added and not saved
            setEditableSongs(editableSongs.filter(song => song.id !== songId));
        }
        setEditMode({ [songId]: false });
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <Typography variant="h6">{album.title} - {album.artist.name}</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon sx={{ color: 'white' }} />
                </IconButton>
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
                open={confirmOpen}
                onClose={() => handleCancelEdit(songToDelete)}
                onConfirm={handleDeleteConfirmed}
                title="Confirm Deletion"
            >
                Are you sure you want to delete this song?
            </ConfirmationDialog>
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
                value={song.duration}
                onChange={(e) => handleInputChange(song.id, 'duration', e.target.value)}
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

function NormalRow({ song, toggleEdit, handleDeleteClick }) {
    return (
        <>
            <ListItemText
                primary={<Typography sx={{ color: 'white' }}>{song.title}</Typography>}
                secondary={<Typography sx={{ color: 'gray' }}>{song.artist}</Typography>}
                sx={{ flex: '1 1 auto', minWidth: 0, mr: 2, color: 'white' }}
            />
            <Typography sx={{ width: '100px', textAlign: 'right', color: 'white' }}>{song.duration}</Typography>
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