import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, Box, Typography } from '@mui/material';

function SongListItem({ song, albumCoverUrl }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          alt={`Cover for ${song.title}`}
          src={albumCoverUrl || '/images/AlbumCover.jpg'}
          sx={{ width: 40, height: 40 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {song.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {song.artist}
            </Typography>
          </Box>
        }
        secondary={
          <Typography variant="body2" sx={{ color: 'white' }}>
            {song.duration}
          </Typography>
        }
        secondaryTypographyProps={{ align: 'right' }}
      />
    </ListItem>
  );
}

export default SongListItem;