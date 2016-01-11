# Elevated Prompt Admin Panel
This repo contains the source code for the administration panel used in the configuration and management of the EP Stack. 

# Deployment Procedure #

	git clone https://github.com/elevatedprompt/AdminPanel.git
	cd AdminPanel
	cd server
	npm install
	./runServer #chmod to be able to run.


## Required Pacakges: ##

package.json

	#Node JS Version 4.2.1
	#Bower
	#Yeoman 1.5.0
	#Restangular
	{
	  "name": "adminpanel",
	  "version": "1.0.0",
	  "description": "",
	  "main": "index.js",
	  "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "",
	  "license": "ISC",
	  "dependencies": {
	    "body-parser": "^1.14.1",
	    "config": "^1.16.0",
	    "express": "^4.13.3",
	    "lodash": "^3.10.1",
	    "method-override": "^2.3.5",
	    "mongoose": "^4.2.3",
	    "node-restful": "^0.2.2",
	    "resourcejs": "^1.0.0"
	  }
	}


## Notes ##

To change the port of the server. 
\server\index.js Line 50

	app.listen(3000);


	

Logstash Config Location

	/etc/logstash/conf.d/

Elastic Search Config Location

	\etc\elasticsearch
	\etc\elasticsearch\logging.yml
	\etc\elasticsearch\elasticsearch.yml


Cron File Location

	/var/spool/cron/admin #Requires permission
	crontab -l
	crontab -e