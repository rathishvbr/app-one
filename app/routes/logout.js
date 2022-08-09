import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;

  async beforeModel(transition) {
    await this.session.requireAuthentication(transition, 'login');

    try {
      await this.session.logout(`${window.location.origin}/logout`);
    } catch (e) {
      this.clToaster.error(e);
    }
  }
}
