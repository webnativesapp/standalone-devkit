# Template > BabylonJs<img src="https://webnatives.oneflagstudio.com/assets/images/logo.png" width="42" align="right"/>
This template aims to be a quick start for any [babylon.js](https://www.babylonjs.com/) developer. You can start your scene with the preset or create your own as you need. Grab a [PG](https://playground.babylonjs.com/) and start extending it to a full blow project.

#### External dependencies. Scripts only:
> https://cdn.babylonjs.com/babylon.js or https://cdn.babylonjs.com/babylon.max.js for development.
> https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js for loading models.


#### Folder structure
- π/root
    - π/logic *all your app logic should be here*
    - π/ui *all your user interface logic should be here*
        - π/schemas *auto generated JSON schemas from the [WYSIWYG Editor](/docs/guides_wysiwyg)*
        -  π/components *all your components should be here*
        -  π/scenes *all your scenes should be here*
            - π ScenesManager.js
            - π LoaderScene.js
            - πMainScene.js *__entry file__*
        - π Bootstrap.js
        - π Babylon.js
        - π AudioLoader.js
        - π AssetLoader.js
        - π AbstractScene.js
    - π/workers *__advanced__: place and register your service workers here*

### To start just modify the src/ui/scenes/MainScene.js file.

Also includes helpers to optimize your [babylon.js](https://babylonjs.com) project such as:
- Default LoaderScene - customize your loader with the integrated [WYSIWYG Editor](/docs/guides_wysiwyg)
- SceneManager - helper to easy navigate between scenes
- AssetLoader - auto load and pre-load your models and other assets with ease so they can be handled by the service worker and provide full PWA compatibility right out-of-the box
- AudioLoader - fully integrated audio loader with the [Sound Manager](/docs/guides_audio)

---------------------------
Β© 2023 WebNatives
