import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  get localStorage() {
    let prop = Object.getOwnPropertyNames(localStorage).find((element) =>
      element.includes('auth0spajs')
    );
    return JSON.parse(localStorage[prop]);
  }
}
