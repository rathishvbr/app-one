import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;
  @service router;

  async beforeModel() {
    let { searchParams: params } = new URL(window.location.href);

    // if code and state params are present, it means we got redirect from auth0
    // after authentication. Call handleRedirectCallback() to process the login state
    if (params.has('code') && params.has('state')) {
      await this.session.handleRedirectCallback();
      this.router.transitionTo('application');
    }
  }
}
