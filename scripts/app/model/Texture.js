import THREE from '../utils/three';
import Helpers from '../utils/Helpers';
import Config from '../../Config';

// React
import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import { UpdatePourcentage } from '../ui/LoadingUI.jsx'

// This class preloads all textures in the imageFiles array in the Config
// Once all textures are done loading the model itself will be loaded after the Promise .then() callback.
// Using promises to preload textures prevents issues when applying textures to materials
// before the textures have loaded.
export default class Texture {
    constructor() {
        // Prop that will contain all loaded textures
        this.textures = {};
    }

    load() {
        const loader = new THREE.TextureLoader();
        const maxAnisotropy = Config.maxAnisotropy;
        const imageFiles = Config.textures.imageFiles;
        const promiseArray = [];
        const imagesLoaded = [];

        loader.setPath(Config.textures.path);

        imageFiles.forEach(imageFile => {
            // Add an individual Promise for each image in array
            promiseArray.push(new Promise((resolve, reject) => {
                // Each Promise will attempt to load the image file
                loader.load(imageFile.image,
                    // This gets called on load with the loaded texture
                    texture => {
                        texture.anisotropy = maxAnisotropy;

                        imagesLoaded.push( imageFile.name );
                        // Update pourcentage from LoadingUI component's
                        UpdatePourcentage(Math.floor((100*imagesLoaded.length)/imageFiles.length))
                        if (texture instanceof THREE.Texture)
                            resolve(texture)
                    },
                    Helpers.logProgress(),
                    xhr => reject(new Error(xhr + 'An error occurred loading while loading ' + imageFile.image))
                )
            }));
        });

        // Iterate through all Promises in array and return another Promise when all have resolved or console log reason when any reject
        return Promise.all(promiseArray).then(
            textures => {
                for( var i = 0; i < textures.length; i++ )
                    this.textures[imageFiles[i].name] = textures[i];
            },
            reason => console.log(reason)
        );
    }
}
