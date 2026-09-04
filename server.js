import fs from "fs";
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Filtered image endpoint
  app.get( "/filteredimage", async (req, res) => {

    const stringIsAValidUrl = (s) => {
      try {
        new URL(s);
        return true;
      } catch (err) {
        return false;
      }
    };

    if (!req.query.image_url) {
      return res.status(400).send("Missing required image URL")
    }

    if (!stringIsAValidUrl(req.query.image_url)) {
      return res.status(422).send("Invalid image URL")
    }

    const image_url = req.query.image_url
        
    try {
      const path = await filterImageFromURL(image_url);
      res.sendFile(path, () => {
        fs.unlink(path, () => {});
      });
    } catch (err) {
      return res.status(422).send("Unable to process image");
    }

  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
