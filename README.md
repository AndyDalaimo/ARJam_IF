# Template World Tracking Three.js
​
This repository contains an AR example using the Zappar SDK for ThreeJS. This specific example uses `parcel` to compile and bundle the assets and code, and TypeScript to get full auto-complete and compile-time error checking.
​
To learn more about Zappar for ThreeJS, head over to the [Zappar for ThreeJS](https://www.npmjs.com/package/@zappar/zappar-threejs) (@zappar/zappar-threejs) page on npm.

## Prerequisites
​
To get started you'll want to ensure you have:
​
- installed Node.js version 10 or later
- printed out the example target image, `example-tracking-image.png` (image tracked projects only)
​
## Running the Project
​
open a terminal in the root directory of this project and follow these steps to get started.
​
Install the dependencies by running:
​
```bash
npm install
```
​
Next, run the project using the following command:
​
```bash
npm start
```
​
The `parcel` tool will host the content locally and give you an address you can open in your browser of your local machine.
​
We recommend launching **instant world tracking** and **image tracked** projects on a mobile device to get the best user experience. If you'd like to try on a mobile device, follow these steps:
​
1. Ensure the device is on the same local network (e.g. Wifi)
2. Find out the IP address of your computer
3. On your mobile device, visit: `https://YOUR-IP-ADDRESS:PORT` replacing both `YOUR-IP-ADDRESS` and `PORT` (the port is the number after the `:` in the address given by `parcel`). Note it's important to type `https` at the start of the address to ensure your device connects over HTTP**S**.

## Create a build

Run the command :

```bash
npm run build
```

Build files will be outputed to the /dist folder or a /dist folder will be created if one does not exist ( make sure to clear the /dist folder of any files before runing the build command, npm start also creates files in this folder for running the project locally, these files need to be deleted before running npm run build)

compress all the files into a zip folder, then upload to [Zapworks project](https://my.zap.works/projects/). 