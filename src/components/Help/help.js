import {React, useState, useRef, useEffect} from 'react'
import './style.css'
import {Grid, Container, Button, Paper, Box, Typography, CircularProgress} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
* @author
* @function Help
* Donne les consignes et indications présentes sur les pages d'accueil, de téléchargement etc.
**/


const TextComptage = `Le détecteur Belisama enregistre l'arrivée d'un photon en lui associant un temps d'arrivée (timestamp). 
En sommant le nombre de photons détectés toutes les heures, il est possible de tracer le graphique suivant qui indique le 
nombre de photons détectés en fonction de l'heure et du jour.

Vous pouvez donner une période de temps en donnant une date de début et une date de fin. Vous pouvez consulter les données
à partir de la date d'installation du détecteur jusqu'à la veille. L'abscisse correspond au début de l'heure donné. Ainsi si on lit une abscisse du 27/07/2021 à 7h avec une ordonnée de 27000 photons, il faut comprendre que 27000 photons ont été détectés entre 7h et 8h le 27 juillet 2021.

Le double curseur vous permet de sélectionner les photons d'un intervalle d'énergie donné ou pour une certaine gamme
d'énergie.

Utilisez la fonction zoom pour vous concentrer sur une zone précise du graphique en sélectionnant une portion de graphique à l'aide de la souris, ou appuyez sur les boutons (+) ou (-) pour zoomer et dézoomer respectivement. L'icône maison vous renvoie à la vue générale. 
Le téléchargement a été rendu possible pour vous permettre l'obtenir l'image du graphique ou bien les données en format csv.

A vous de jouer !`;


const TextEnergy = `Le détecteur Belisama enregistre l'arrivée d'un photon en lui associant non seulement un temps d'arrivée (timestamp) mais également une énergie. 
Ces énergies sont ensuite séparées par tranche de 50 keV pour permettre d'agréger les données. En sommant le nombre de photons détectés pour chaque intervalle d'énergie, il est possible de tracer le graphique suivant qui indique la densité de photons détectés en fonction de l'énergie.

Vous pouvez donner une période de temps en donnant une date de début et une date de fin. Vous pouvez consulter les données
à partir de la date d'installation du détecteur jusqu'à la veille. L'abscisse correspond au début de l'intervalle d'énergie donné. Ainsi si on lit une abscisse de 100 keV avec une ordonnée de 0.27, il faut comprendre que 27% des photons détectés sur la période sélectionnée avaient une énergie comprise entre 100 keV et 150 heV.

Utilisez la fonction zoom pour vous concentrer sur une zone précise du graphique en sélectionnant une portion de graphique à l'aide de la souris, ou appuyez sur les boutons (+) ou (-) pour zoomer et dézoomer respectivement. L'icône maison vous renvoie à la vue générale. 
Le téléchargement a été rendu possible pour vous permettre l'obtenir l'image du graphique ou bien les données en format csv.

A vous de jouer !`;

const TextDownload = `Le détecteur Belisama transfère des données toutes les trente minutes. Celles-ci comprennent entre autres les temps d'arrivée des photons, leur énergie (offset et baseline). Ces données sont au format fits.gz et sont intitulées 'Données brutes'. Le téléchargement par jour est possible du premier du mois à la veille. Pour des téléchargements antérieurs, il faut se référer au téléchargement par mois.

Une équipe d'étudiant mené par le chercheur Philippe Laurent s'est chargée de les agréger par intervalle d'une heure et tranche de 50 kev. Ces nouvelles données sont intitulées 'Données traitées'. Elles sont au format json et se présentent de la manière suivante : 

[[timestamp_début, timestamp_fin, debut_d_energie, nombre_intervalle_d_energie][[premiere_heure],[deuxieme_heure],[],...,[derniere_heure]]].

Chaque liste indexée par l'heure indique le nombre de photons détectées dans cette tranche horaire en fonction de sa tranche d'énergie.

Exemple : 

[[1619820000000, 1627516740000, 50, 50, 399], [[1, 2, 3, 4, ...,], [10, 20, 30, 40, ...,],(...)]]

Ici les données ont été traitées à partir du 1er mai 2021 00h00 et jusqu'au 29 juillet 2021 00h00. 
Les temps sont donnés en millisecondes depuis le 1er janvier 1970 à 00h00 (UTC). 
Nous avons sélectionné les photons avec une énergie variant de 50 kev à 50+50*399 = 20000 kev. 
La nuit du 1er mai 2021 entre minuit et 1h, il a été détecté 1 photon avec une énergie de 50 kev ou moins, 2 photons avec une énergie entre 50 kev et 100 kev etc. 
Entre 1h et 2h du matin ont été détectés 10 photons d'énergie inférieure à 50 kev, 20 photons d'énergie comprise entre 50 keV et 100 keV et 30 photons d'énergie comprise entre 100 keV et 150 keV.

A vous de jouer !

`
const TextMap = `Bienvenue ! 

Sélectionnez un détecteur en sélectionnant un marqueur sur la carte et en appuyant sur le bouton "Voir les données". 

Pour chaque détecteur, vous aurez accès à des informations sur le nombre de photons détectés, la répartition de ces photons en fonction de l'énergie ainsi que des possibilités de téléchargement de données.

Pour poursuivre votre étude, accédez à l'onglet Analyse en haut de l'écran et comparez les données des détecteurs entre eux pour découvrir des similiarités ou des différences. 

Visitez notre "A propos" pour en découvrir plus sur le projet Belisama et échanger avec les intervenants pour toute question ou tout remarque concernant le site Internet. 

Bonne visite !`

const Help = (props) => {
    const page = props.page
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);

    return(
        <Grid container >
            <Button variant="outlined" color="primary" startIcon={<HelpOutlineIcon />} onClick={handleClickOpen('body')}>Besoin d'aide ?</Button>
        <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Aide</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>

        {page === 'Count' && 
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className = 'dialog'
          >
          {TextComptage}
          </DialogContentText>
    }


        {page === 'Energy' && 
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className = 'dialog'
          >
            {TextEnergy}

          </DialogContentText>
    }


        {page === 'Download' && 
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className = 'dialog'
          >
          {TextDownload}
          </DialogContentText>
    }

        {page === 'Map' && 
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className = 'dialog'
          >
          {TextMap}

          </DialogContentText>
    }

        </DialogContent>
        <DialogActions>

          <Button onClick={handleClose} color="primary">
            C'est compris !
          </Button>
        </DialogActions>
      </Dialog>
        </Grid>

    )

 }

export default Help