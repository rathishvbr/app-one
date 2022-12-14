# How to use
1. **Mimic subdomain on local**
            To mimic the subdomain we have to add URLs to the `/etc/hosts`, Use your favorite editor to edit or simple use `vi` , The command for to edit `sudo vi /etc/hosts` then add these two URL to local IP `one.app.localhost` and `two.app.localhost` and save it. 

2. **Clone both applications and run**
            [App one](https://github.com/rathishvbr/app-one) is responsible for communicating `Auth0` and getting the JWT token. Install and run (`npm install && ember s`), this will run on the default port of ember which is `4200` , So we can access the application in the browser with `http://one.app.localhost:4200` 
            
    [App two](https://github.com/rathishvbr/app-two) this application will not communicate to the `Auth0` it consumes the token from App one.  Install and run (`npm install && ember s`)  , this will run on `5200` by default (configured to run on `5200` on `.ember-cli`), So we can access the application in the browser with `http://two.app.localhost:5200` 

    That's it now both applications ready to use.

3. **To test**
            Simply run the `http://one.app.localhost:4200` and it'll redirect to the `Athu0` login screen where we can create an account, then the application will be redirected to the index page where the whole object from `Auth0` will be displayed, At the top, there will be a link to go to the App Two, Once we open the App Two the token from the App One will be shared, App Two will display the token, App Two configured with `ember-data` and `ember-cli-mirage` , Check the console (`ember-cli-mirage` show logs in console not in the network tab) to find out request header with `Authorization: Bearer {token}` 

4. **Qunit test cases**
    Test cases are written for App Two, since it has some reasonable test scenarios here is the [commit](https://github.com/rathishvbr/app-two/commit/191ce7275a0b7abb8e0a957b0832ade7be1a590e), Testing for App one isn't needed in my opinion since the session service playing the main role there and it's totally consumer of `@auth0/auth0-spa-js`.

5. **Video**
    Full demo video ([Link](https://drive.google.com/file/d/1c9B88l7zdDwZKNz62mITRmNto895T_HM/view?usp=sharing))

Please reach out to me if you find any difficulty with this setup or have any sort of questions.