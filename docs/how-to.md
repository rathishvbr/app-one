# How to use
1. **Mimic subdomin on local**
			To mimic the subdomin we have to add urls to the `/etc/hosts`, Use your favourite editor to edit or simple use `vi` , The command for to edit `sudo vi /etc/hosts` then add these two url to local IP `one.app.localhost` and `two.app.localhost` and save it. 

2. **Clone both application and run**
			[App one](https://github.com/rathishvbr/app-one) this is responsible for communicate `Auth0` and get the JWT token. Install and run (`npm install && ember s`), this will run on the default port of ember which is `4200` , So we can access the application in the browser with `http://one.app.localhost:4200` 
			
	[App two](https://github.com/rathishvbr/app-two) this application will not commicate to the `Auth0` it consumes the token from the App one.  Install and run (`npm install && ember s`)  , this will run on `5200` by default (configured to run on `5200` on `.ember-cli`), So we can access the application in the browser with `http://two.app.localhost:5200` 

	That's it now both application ready to use.

3. **To test**
			Simply run the `http://one.app.localhost:4200` and it'll redirect to the `Athu0` login screen where we can create account, then apllication will be redirected to the index page where whole object from `Auth0` will be displayed, At the top there will be link to go to the App Two, Once we open the App Two the token from the App One will be shared, App Two will display the token, App Two configured with `ember-data` and `ember-cli-mirage` , Check the console (`ember-cli-mirage` show logs in console not in the network tab) to find out request header with `Authorization: Bearer {token}` 

4. **Qunit test cases**
	> **Note:** Will add the test cases

5. **Images**
	> **Note:** Coming soon

6. **Video**
	> **Note:** Coming soon

Please reach out to me if you find any difficulty on this setup or any sort of questions.