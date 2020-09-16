import Detector from './app/utils/Detector';
import Main from './app/main';

if(!Detector.webgl) {
    Detector.addGetWebGLMessage();
} else {
    const container = document.getElementById('globe');
    new Main(container);
}
