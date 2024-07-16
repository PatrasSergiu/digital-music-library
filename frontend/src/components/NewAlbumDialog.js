import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { addNewArtist } from '../controllers/artistController'; 
import { addNewAlbum } from '../controllers/albumController';
import { toast } from 'react-toastify';

function NewAlbumDialog({ open, onClose, onAdd, artists }) {
    const [newAlbumData, setNewAlbumData] = useState({
        title: '',
        artist: '',
        description: '',
        newArtist: ''
    });

    const defaultAlbumData = {
        title: '',
        artist: '',
        description: '',
        newArtist: ''
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    }

    const resetForm = () => {
        setNewAlbumData(defaultAlbumData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "artist" && value === "new") {
            setNewAlbumData({ ...newAlbumData, artist: value });
        } else {
            setNewAlbumData({ ...newAlbumData, [name]: value });
        }
    };
    

    const handleAdd = async () => {
        let selectedArtist;
        if(newAlbumData.artist === ""){
            toast.error("Please select an artist!");
            return;
        } 
        //new artist
        if (newAlbumData.artist === "new") {
            if(newAlbumData.newArtist === ""){
                toast.error("Artist name cannot be empty!");
                return;
            }
            selectedArtist = artists.find(artist => artist.name === newAlbumData.newArtist);
            const newArtist = await addNewArtist({ name: newAlbumData.newArtist });
            selectedArtist = newArtist; 
        }
        else {
            if(newAlbumData.title === ""){
                toast.error("Album name cannot be empty!");
                return;
            }
            selectedArtist = artists.find(artist => artist.name === newAlbumData.artist);
        }
        toast.promise(
            (async () => {
                const albumToCreate = {
                    title: newAlbumData.title,
                    description: newAlbumData.description,
                    artistId: selectedArtist.id  
                };
                
                const createdAlbum = await addNewAlbum(albumToCreate);
                console.log("Created: ", createdAlbum);
                onAdd(createdAlbum, selectedArtist);
            })(),
            {
                pending: 'Adding album...',
                success: 'Album successfully added!',
                error: 'Error adding album!'
            }
        ).then(() => {
            resetForm();
            onClose();
        }).catch(error => {
            console.error("Failed to add new artist or album:", error);
        });
    };

    useEffect(() => {
        setNewAlbumData((prevState) => ({ ...prevState, newArtist: '', artist: '' }));
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#333', color: 'white' } }}>
            <DialogTitle>Add New Album</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="Album Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newAlbumData.title}
                    onChange={handleChange}
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                />
                <TextField
                    margin="dense"
                    name="description"
                    label="Album Description"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={newAlbumData.description}
                    onChange={handleChange}
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                />
                <FormControl fullWidth sx={{ marginY: 2 }}>
                    <InputLabel id="artist-label" sx={{ color: '#ccc' }}>Artist</InputLabel>
                    <Select
                        labelId="artist-label"
                        id="artist-select"
                        name="artist"
                        value={newAlbumData.artist}
                        onChange={handleChange}
                        label="Artist"
                        sx={{
                            color: 'white', 
                            backgroundColor: '#444',
                            '&:hover': { backgroundColor: '#555' },
                            '& .MuiSelect-select': { color: 'white' }, 
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: '#333',
                                    color: 'white',
                                    '& .MuiMenuItem-root': {
                                        '&:hover': { backgroundColor: '#222' },
                                    }
                                }
                            }
                        }}
                    >
                        {artists.map((artist) => (
                            <MenuItem key={artist.id} value={artist.name}>
                                {artist.name}
                            </MenuItem>
                        ))}
                        <MenuItem value="new">Add New Artist...</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    name="newArtist"
                    label="New Artist Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newAlbumData.newArtist}
                    onChange={handleChange}
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                    disabled={newAlbumData.artist !== "new"}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} sx={{ color: 'white' }}>Cancel</Button>
                <Button onClick={handleAdd} sx={{ color: 'white' }}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NewAlbumDialog;