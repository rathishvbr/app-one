import EmberRouter from '@ember/routing/router';
import config from 'app-one/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login', { resetNamespace: true });
  this.route('logout', { resetNamespace: true });
});
