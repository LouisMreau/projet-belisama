import React from "react";
import "./style.css";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import {
  Grid,
  Container,
  Button,
  Box,
  Typography,
  IconButton,
  Hidden,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardContent";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

import logo from "../../resources/icons/sticker.jpeg";
import detecteur from "../../resources/icons/detecteur1.jpg";
import cinema from "../../resources/icons/cinema.jpg";
import code from "../../resources/icons/code.jpg";

/**
 * @author
 * @function MoreInfo
 * Returns the about page with a timeline of the project and a list of the contributors
 **/

const MoreInfo = (props) => {

  const useStyles = makeStyles({
    root: {
      minWidth: 125,
    },
    media: {
      justifyContent: "center",
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      marginBottom: 12,
    },
    pos: {
      marginBottom: 12,
    },
    button: {
      align: "center",
    },
  });

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Grid container justify="center">
      <Container>
        <Grid item xs={12}>
          <Typography variant="h4" id="step">
            Les étapes clés du projet
          </Typography>
          <Box margin="2em"></Box>
          <Typography variant="body2">
            Pour plus d'informations, veuillez contacter Philippe Laurent à
            l'adresse suivante : philippe.laurent@cea.fr
          </Typography>
          <Box margin="2em"></Box>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12}>
            <Timeline align="alternate">
              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography color="textSecondary">Etape 1</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card className={classes.root}>
                    <CardMedia>
                      <img src={logo} height="150" />
                    </CardMedia>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        variant="h6"
                        component="h1"
                        align="left"
                      >
                        Création
                      </Typography>
                      <Typography align="left">
                        Le projet Belisama voit le jour au sein du laboratoire
                        de l'APC (AstroParticule et Cosmologie)
                      </Typography>
                    </CardContent>

                    <CardActions align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          window.open(
                            "https://ikhone.wixsite.com/belisama/projet",
                            "_blank"
                          );
                        }}
                      >
                        En savoir plus
                      </Button>
                    </CardActions>
                  </Card>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography color="textSecondary">Etape 2</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card className={classes.root}>
                    <CardMedia align="center">
                      <img src={detecteur} width="75%" />
                    </CardMedia>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        variant="h6"
                        component="h1"
                        align="left"
                      >
                        Installation des premiers détecteurs
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull}{" "}
                        <a
                          href="https://ikhone.wixsite.com/belisama/obspmeudon"
                          target="_blank"
                        >
                          Observatoire de Meudon
                        </a>
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull}{" "}
                        <a
                          href="https://ikhone.wixsite.com/belisama/cstcloud"
                          target="_blank"
                        >
                          Lycée de la Celle Saint Cloud
                        </a>
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull}{" "}
                        <a
                          href="https://ikhone.wixsite.com/belisama/macurie"
                          target="_blank"
                        >
                          Lycée Marie Curie de Sceaux
                        </a>
                      </Typography>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography color="textSecondary">Etape 3</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card className={classes.root}>
                    <CardMedia align="center">
                      <img src={cinema} width="65%" />
                    </CardMedia>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        variant="h6"
                        component="h1"
                        align="left"
                      >
                        Mise en place des vidéos explicatives
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Présentation du projet
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Présentation du détecteur
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Montage du dispositif
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Calibrage du détecteur
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Prise de données
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Analyse de données
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        className={classes.button}
                        size="small"
                        href="/videos"
                      >
                        Découvrir
                      </Button>
                    </CardActions>
                  </Card>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography color="textSecondary">Etape 4</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card className={classes.root}>
                    <CardContent>
                      <CardMedia align="center">
                        <img src={code} width="65%" />
                      </CardMedia>
                      <Typography
                        className={classes.title}
                        variant="h6"
                        component="h1"
                        align="left"
                      >
                        Analyse de données
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull}{" "}
                        <a
                          href="https://data-belisama.s3.eu-west-3.amazonaws.com/processing_code.zip"
                          target="_blank"
                        >
                          Téléchargement des programmes pour le traitement des
                          données
                        </a>
                      </Typography>
                      <Typography variant="body1" component="p" align="left">
                        {bull} Préparation d'un site de visualisation de données
                      </Typography>
                      <Box margin="1em"></Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            </Timeline>

            <Box margin="4em"></Box>
          </Grid>
        </Hidden>

        <Hidden smUp>
          <Grid>
            <Box margin="1em">
              <Typography
                variant="overline"
                color="textSecondary"
                className={classes.title}
              >
                Etape 1
              </Typography>
            </Box>
            <Card className={classes.root}>
              <CardMedia>
                <img src={logo} height="150" />
              </CardMedia>
              <CardContent>
                <Typography
                  className={classes.title}
                  variant="h6"
                  component="h1"
                  align="left"
                >
                  Création
                </Typography>
                <Typography align="left">
                  Le projet Belisama voit le jour au sein du laboratoire de
                  l'APC (AstroParticule et Cosmologie)
                </Typography>
              </CardContent>

              <CardActions align="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    window.open(
                      "https://ikhone.wixsite.com/belisama/projet",
                      "_blank"
                    );
                  }}
                >
                  En savoir plus
                </Button>
              </CardActions>
            </Card>
            <Box margin="1em">
              <Typography
                variant="overline"
                color="textSecondary"
                className={classes.title}
              >
                Etape 2
              </Typography>
            </Box>
            <Card className={classes.root}>
              <CardMedia align="center">
                <img src={detecteur} width="75%" />
              </CardMedia>
              <CardContent>
                <Typography
                  className={classes.title}
                  variant="h6"
                  component="h1"
                  align="left"
                >
                  Installation des premiers détecteurs
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull}{" "}
                  <a
                    href="https://ikhone.wixsite.com/belisama/obspmeudon"
                    target="_blank"
                  >
                    Observatoire de Meudon
                  </a>
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull}{" "}
                  <a
                    href="https://ikhone.wixsite.com/belisama/cstcloud"
                    target="_blank"
                  >
                    Lycée de la Celle Saint Cloud
                  </a>
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull}{" "}
                  <a
                    href="https://ikhone.wixsite.com/belisama/macurie"
                    target="_blank"
                  >
                    Lycée Marie Curie de Sceaux
                  </a>
                </Typography>
              </CardContent>
            </Card>
            <Box margin="1em">
              <Typography
                variant="overline"
                color="textSecondary"
                className={classes.title}
              >
                Etape 3
              </Typography>
            </Box>
            <Card className={classes.root}>
              <CardMedia align="center">
                <img src={cinema} width="65%" />
              </CardMedia>
              <CardContent>
                <Typography
                  className={classes.title}
                  variant="h6"
                  component="h1"
                  align="left"
                >
                  Mise en place des vidéos explicatives
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Présentation du projet
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Présentation du détecteur
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Montage du dispositif
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Calibrage du détecteur
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Prise de données
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Analyse de données
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  className={classes.button}
                  size="small"
                  href="/videos"
                >
                  Découvrir
                </Button>
              </CardActions>
            </Card>
            <Box margin="1em">
              <Typography
                variant="overline"
                color="textSecondary"
                className={classes.title}
              >
                Etape 4
              </Typography>
            </Box>
            <Card className={classes.root}>
              <CardContent>
                <CardMedia align="center">
                  <img src={code} width="65%" />
                </CardMedia>
                <Typography
                  className={classes.title}
                  variant="h6"
                  component="h1"
                  align="left"
                >
                  Analyse de données
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull}{" "}
                  <a
                    href="https://data-belisama.s3.eu-west-3.amazonaws.com/processing_code.zip"
                    target="_blank"
                  >
                    Téléchargement des programmes pour le traitement des données
                  </a>
                </Typography>
                <Typography variant="body1" component="p" align="left">
                  {bull} Préparation d'un site de visualisation de données
                </Typography>
                <Box margin="1em"></Box>
              </CardContent>
            </Card>
          </Grid>
          <Box margin="2em"></Box>
        </Hidden>

        <Grid item xs={12}>
          <Typography variant="h4">
            Les contributeurs du site Internet
          </Typography>
          <Box margin="2em"></Box>
          <Grid item xs={12} justify="center">
            <p style={{ fontWeight: "bold" }}>
              Philippe Laurent - Chef de Projet
            </p>
            philippe.laurent@cea.fr <br />
            <br />
            <p style={{ fontWeight: "bold" }}>Hugo Marchand - Data Scientist</p>
            hugo.marchand@yahoo.fr <br />
            <br />
            <p style={{ fontWeight: "bold" }}>
              Louis Moreau - Architecte Cloud et Web, Développeur, Data
              Scientist{" "}
            </p>
            moreaulouis.ml@gmail.com <br />
            <br />
            <p style={{ fontWeight: "bold" }}>
              Li-fan Zhao - Architecte Cloud et Web, Développeur, Data Scientist{" "}
            </p>
            zhao.lifan@yahoo.fr <br />
            <br />
          </Grid>
          <Grid item xs={12}>
            <IconButton aria-label="getUpward" href="#step">
              <ArrowUpwardIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default MoreInfo;
