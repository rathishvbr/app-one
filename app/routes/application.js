import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;
  @service session;

  async beforeModel() {
    let token = await this.session.getAccessToken();

    if (!token) {
      this.session.login();
    }
  }

  model() {
    return localStorage;
  }
}
