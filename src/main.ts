import * as angular from 'angular';
(window as any).angular = angular;

import { enableProdMode, PlatformRef, StaticProvider, Component } from '@angular/core';
import { downgradeModule } from '@angular/upgrade/static';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { UIRouter, UrlService } from '@uirouter/core';
import { sampleAppModuleAngularJS } from './app/app.angularjs.module';

// Google analytics
// import './app/util/ga';

if (environment.production) {
  enableProdMode();
}

const bootstrapFn = (extraProviders: StaticProvider[]) => {
    const platformRef: PlatformRef = platformBrowserDynamic(extraProviders);
    return platformRef.bootstrapModule(AppModule);
};


sampleAppModuleAngularJS.config(['$urlServiceProvider', ($urlService: UrlService) => $urlService.deferIntercept()]);


angular.bootstrap(document.body, [
  sampleAppModuleAngularJS.name,
  downgradeModule(bootstrapFn)
  ]) ;

const injector: angular.auto.IInjectorService = angular.element(document.body).injector();

const urlService: UrlService = injector.get('$urlService');

setTimeout(() => {
    // setTimeout needed to allow angular routes to initialize after refresh
    urlService.listen();
    urlService.sync();
});

// Using AngularJS config block, call `deferIntercept()`.
// This tells UI-Router to delay the initial URL sync (until all bootstrapping is complete)
// sampleAppModuleAngularJS.config([ '$urlServiceProvider', ($urlService: UrlService) => // $urlService.deferIntercept() ]);

// Manually bootstrap the Angular app
// platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
  // Intialize the Angular Module
  // get() the UIRouter instance from DI to initialize the router
  // const urlService: UrlService = platformRef.injector.get(UIRouter).urlService;

  // Instruct UIRouter to listen to URL changes
  // urlService.listen();
  // urlService.sync();
// });

// Show ui-router-visualizer
// sampleAppModuleAngularJS.run(['$uiRouter', ($uiRouter) => visualizer($uiRouter) ]);
