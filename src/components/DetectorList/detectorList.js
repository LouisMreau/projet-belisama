import {React, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import dataDetector from '../../resources/data/data_detector.json';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '35ch',
    backgroundColor: theme.palette.background.paper,
    maxHeight: '500px', 
    overflow: 'auto',
  },
  inline: {
    display: 'inline',
  },
}))

/**
* @author
* @function DetectorList
* Permet à l'utilisateur de sélectionner un détecteur parmi les détecteurs d'une liste 
* Necéssite l'import d'un fichier json DataDetector qui contient les informations relatives à tous les détecteurs
**/


export default function DetectorList() {
  const classes = useStyles();


  return (
    <Grid item xs = {12} sm = {4}>
        <List className={classes.root}>
    
        {dataDetector.map((detector) => (
          <ListItem alignItems="flex-start">
          <ListItemText
          primary={detector.place}
          secondary={
            <Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {"Contact : "} 
              </Typography>
              {detector.contact}
              <br/>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {"Date d'installation : "} 
              </Typography>
              {detector.installation_date}
              <Box margin = '0.5em'></Box>
              <Button className={classes.inline} variant="outlined" startIcon={<DoubleArrowIcon />} href = {"/data/" + detector.id} style={{marginTop:"20px"}}>Voir les données</Button>
              
            </Fragment>
            
          }/>
         
          {/* <Divider variant = 'inset' component ='li' /> */}
          
        </ListItem>
        
        ))}
        
      </List>
      
    </Grid>
  );
}
