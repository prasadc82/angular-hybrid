import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { BrowserModule } from '@angular/platform-browser';

import { UIRouterUpgradeModule } from '@uirouter/angular-hybrid';
import { UIRouterModule, UIRouter } from '@uirouter/angular';
import { BootstrapComponent } from '../bootstrap/bootstrap-component';

import { PrefsModule } from './prefs/prefs.module';

// Create a "future state" (a placeholder) for the Contacts
// Angular module which will be lazy loaded by UI-Router
export const contactsFutureState = {
  name: 'contacts.**',
  url: '/contacts',
  loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
};

export function getDialogService($injector) {
  return $injector.get('DialogService');
}

export function getContactsService($injector) {
  return $injector.get('Contacts');
}

// The main NgModule for the Angular portion of the hybrid app
@NgModule({
  declarations: [BootstrapComponent],
  entryComponents: [BootstrapComponent],
  imports: [
    BrowserModule,
    // Provide angular upgrade capabilities
    UpgradeModule,
    UIRouterUpgradeModule,
    // Provides the @uirouter/angular directives and registers
    // the future state for the lazy loaded contacts module
    UIRouterModule.forChild({ states: [contactsFutureState] }),
    // The preferences feature module
    PrefsModule,
  ],
  providers: [
    // Provide the SystemJsNgModuleLoader when using Angular lazy loading
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },

    // Register some AngularJS services as Angular providers
    { provide: 'DialogService', deps: ['$injector'], useFactory: getDialogService },
    { provide: 'Contacts', deps: ['$injector'], useFactory: getContactsService },
  ]
})
export class AppModule {
  constructor(private router: UIRouter) {
    // "router" needed in constructor to bootstrap angular states
   }

  ngDoBootstrap() {
  }
}
