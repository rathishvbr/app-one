import { assert } from '@ember/debug';
import Service, { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

import createAuth0Client from '@auth0/auth0-spa-js';
import { enqueueTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

import ENV from 'app-one/config/environment';

export default class Auth0Service extends Service {
  @service router;

  /**
   * The auth0-spa client object, initialized by `initAuth0` task
   */
  auth0 = null;

  /**
   * A tracked property that is true/false when session is authenticated/unauthenticated
   */
  @tracked
  isAuthenticated = false;

  @enqueueTask
  *initAuth0() {
    // if auth0 client is already initialized, abort initialization
    // this with @enqueueTask makes it safe to call this function multiple times
    if (this.auth0) {
      return this.auth0;
    }

    assert(
      'The "domain" and "clientId" properties must be specified in a config["auth0"] object on environemnt',
      isPresent(ENV.auth0) &&
        isPresent(ENV.auth0.domain) &&
        isPresent(ENV.auth0.clientId)
    );

    // Store a reference to the auth0 client object in the service
    this.auth0 = yield createAuth0Client({
      domain: ENV.auth0.domain,
      client_id: ENV.auth0.clientId,
      cacheLocation: 'localstorage',
      cookieDomain: '.app.localhost',
    });

    this.isAuthenticated = yield this.auth0.isAuthenticated();

    return this.auth0;
  }

  get redirectHost() {
    return window.location.origin;
  }

  async login() {
    await this.initAuth0.perform();
    await this.auth0.loginWithRedirect({
      redirect_uri: `${window.location.origin}/login`,
    });
  }

  async logout(returnTo = this.redirectHost) {
    return await this.auth0.logout({ returnTo });
  }

  async handleRedirectCallback() {
    await this.initAuth0.perform();

    let result = await this.auth0.handleRedirectCallback();
    this.isAuthenticated = await this.auth0.isAuthenticated();
    // QUESTION: does this work on Safari? We've had issues in the past using `?` in Safari
    this.appState = result?.appState;

    return result;
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie =
      cname + '=' + cvalue + ';' + expires + ';Path=/;Domain=.app.localhost;';
  }

  async getAccessToken() {
    await this.initAuth0.perform();
    if (this.isAuthenticated) {
      try {
        let token = await this.auth0.getTokenSilently();
        let isAuthenticated = await this.auth0.isAuthenticated();

        // keep the tracked property in sync
        this.isAuthenticated = isAuthenticated;
        if (token) {
          // document.cookie = `access_token=${token}; Path=/; Domain=.app.localhost;`;
          this.setCookie('access_token', token, 1);
        }

        return token;
      } catch (e) {
        if (e.error === 'login_required') {
          await this.auth0.loginWithRedirect({
            appState: {
              redirectTarget: this.router.currentURL,
            },
            redirect_uri: `${this.redirectHost}/login`,
          });
        }
      }
    } else {
      // QUESTION: should this be setting this.isAuthenticated to false too?
      return null;
    }
  }

  /**
    Checks whether the session is authenticated and if it is not, transitions
    to the specified route or invokes the specified callback.
    If a transition is in progress and is aborted, this method will save it in the
    `attemptedTransition` property so that it can be retried after the session is authenticated.
    @method requireAuthentication
    @param {Transition} transition A transition that triggered the authentication requirement or null if the requirement originated independently of a transition
    @param {String|Function} routeOrCallback The route to transition to in case that the session is not authenticated or a callback function to invoke in that case
    @return {Promise<Boolean>} true when the session is authenticated, false otherwise
    @public
  */
  async requireAuthentication(transition, routeOrCallback) {
    await this.initAuth0.perform();

    let isAuthenticated = this.isAuthenticated;

    if (!isAuthenticated) {
      if (transition) {
        this.attemptedTransition = transition;
      }

      let argType = typeof routeOrCallback;
      if (argType === 'string') {
        this.router.transitionTo(routeOrCallback);
      } else if (argType === 'function') {
        routeOrCallback();
      } else {
        assert(
          `The second argument to requireAuthentication must be a String or Function, got "${argType}"!`,
          false
        );
      }
    }

    return isAuthenticated;
  }
}
