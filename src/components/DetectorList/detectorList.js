import {React, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'

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

const BootstrapButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 14,
    padding: '4px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    // backgroundColor: '#09476e',
    borderColor: 'black',
    fontFamily: [
      // '-apple-system',
      // 'BlinkMacSystemFont',
      // '"Segoe UI"',
      // 'Roboto',
      // '"Helvetica Neue"',
      'Arial',
      // 'sans-serif',
      // '"Apple Color Emoji"',
      // '"Segoe UI Emoji"',
      // '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#dcdcdc',
      borderColor: 'black',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#dcdcdc',
      borderColor: '#0062cc',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgb(256, 256, 256)',
    },
  },
})(Button);

/**
* @author
* @function DetectorList
* Permet à l'utilisateur de sélectionner un détecteur parmi les détecteurs d'une liste 
* Necéssite l'import d'un fichier json DataDetector qui contient les informations relatives à tous les détecteurs
**/


export default function DetectorList(props) {
  const classes = useStyles();
  const dataDetector = props.dataDetector

  return (
    <Grid item xs = {12} sm = {4}>
        <List className={classes.root}>
    
        {dataDetector.map((detector) => (
          <div>
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
              <br/>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {"Statut : "} 
              </Typography>
              {detector.breakdown && (
              <FiberManualRecordIcon fontSize = 'small' style = {{color : "red"}}/>
              )}
              {!detector.breakdown && (
              <FiberManualRecordIcon fontSize = 'small' style = {{color : "green"}}/>
              )}
              <Box margin = '0.5em'></Box>
              <BootstrapButton className={classes.inline} variant="outlined" startIcon={<DoubleArrowIcon />} href = {"/data/" + detector.id} style={{marginTop:"20px"}}>Voir les données</BootstrapButton>
              
            </Fragment>
            
          }/>
         
          
          
        </ListItem>
        <Divider variant="middle" />
        </div>
        ))}
        
      </List>
      
    </Grid>
  );
}
