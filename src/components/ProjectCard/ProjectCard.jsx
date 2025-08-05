import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import './ProjectCard.css';

const ProjectCard = () => {
  const projects = [
    { title: 'Admin dashboard design', description: 'Broadcast web app mockup' },
    { title: 'Wordpress Development', description: 'Upload new design' },
    { title: 'Project meeting', description: 'New project discussion' },
    { title: 'Broadcast Mail', description: 'Sort! release details to learn' },
    { title: 'UI Design', description: 'New application planning' },
  ];

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Open Projects
        </Typography>
        <List>
          {projects.map((project, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={project.title}
                  secondary={project.description}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
              {index < projects.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;