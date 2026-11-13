import { Application, Container } from 'pixi.js';
import { fitToWindow } from './layout';
import { ScreenManager } from './screens';
import { HomeScreen } from './HomeScreen';
import { COCHINEAL } from './theme';
import './style.css';

async function main(): Promise<void> {
  const app = new Application();

  await app.init({
    resizeTo: window,
    background: COCHINEAL,
    antialias: true,
    autoDensity: true,
    // Above 2x the extra sharpness is barely visible but costs a lot on cheap phones.
    resolution: Math.min(window.devicePixelRatio, 2),
    preference: 'webgl',
  });
  document.body.appendChild(app.canvas);

  const root = new Container();
  app.stage.addChild(root);

  const screens = new ScreenManager(root, fitToWindow(root, app.screen.width, app.screen.height));

  app.renderer.on('resize', (width: number, height: number) => {
    screens.resize(fitToWindow(root, width, height));
  });

  // PixiJS already follows window "resize". iOS can report the old size during a
  // rotation or toolbar change, so measure again once the rotation has settled.
  window.visualViewport?.addEventListener('resize', () => app.queueResize());
  window.addEventListener('orientationchange', () => {
    app.queueResize();
    setTimeout(() => app.queueResize(), 300);
  });

  screens.show(new HomeScreen(screens));
}

void main();
