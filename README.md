## Standalone - DevKit

Webnatives.app standalone cloud developer devkit

### Webnatives HTML5 JavaScript standalone devkit. Simple, no AI, non-opinionated flow. Your code, your rules!

This project was developed with focus on native front developers. It strives to be a quick way for developers of any stage to
quickly jump start a PWA project without fuzz.

Simple CLI based allow developers to centralize projects within a workspace in their filesystem and under their control.

![logo](https://i.ibb.co/Bw4Hstx/draft.png)

## Installation
Get standalone dependencies first:
* [node.js](http://nodejs.org/) v10 or higher
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


### Getting Started
First start by cloning this repo using git or just download the src to a folder in your system.

    https://github.com/webnativesapp/standalone-devkit

Now, install project dependencies using.

    npm install

## As simple as 1,2,3,4
### 1 - Initializing
Start the framework filesystem ( this needs to be done only once).

    npm run init

### 2 - Create project
Create a project in your workspace.

    npm run create <app-name> <template>

##### Available Templates
- [blank](https://github.com/webnativesapp/template-blank) - WebNatives.app Studio Starter Template - Blank
- [babylonjs](https://github.com/webnativesapp/template-babylonjs) - Webnatives.app starter kit for Babylonjs
- [gameclosure](https://github.com/webnativesapp/template-gameclosure) - Webnatives.app starter kit for Game Closure Devkit
- [pixijs](https://github.com/webnativesapp/template-pixijs) - Webnatives.app starter kit for PixiJS
- [bootstrap](https://github.com/webnativesapp/template-bootstrap) - Webnatives.app starter kit for Bootstrap CSS
- [phaser](https://github.com/webnativesapp/template-phaser) - Webnatives.app starter kit for Phaser
- [threejs](https://github.com/webnativesapp/template-threejs) - Webnatives.app starter kit for ThreeJS
- [reactjs](https://github.com/webnativesapp/template-reactjs) - Webnatives.app starter kit for ReactJs
- [playcanvas](https://github.com/webnativesapp/template-playcanvas) - Webnatives.app starter kit for Playcanvas

### 3 - Develop project
Run your project locally as you develop

    npm run dev <app-name>

Once you run this command you should see this:

    [ONLINE]  {
    localPath: <local filesystem project path location>,
    running: '<localhost route for your project>'
    }

Your default browser should also open the running project. We recommend using Chrome, Opera, Edge or any other major
browser for best development experience.

### 4 - Build your PWA
Run the build command and get the local path for the project release build.

    npm run build <app-name>

Your result 

      Output location: <local filesystem build path location>

Bam there ya go. Grab the build host it were you want.
![PWA](https://i.ibb.co/1LrL2M7/build.png)

Now just repeat step 2,3 and 4 as many times you need.
