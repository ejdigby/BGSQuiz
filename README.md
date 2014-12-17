BGSQuiz
=======

Application for managing the points at the annual Bourne Grammar School House Quiz competition. Built by [Edward Digby](http://twitter.com/ejdigby) and [James Brooks](http://twitter.com/jamesbrks).

Our school house system is as follows:
 - Behn
 - Meitner
 - Rorschach
 - Tinbergen
 
## Structure
```	
  ├── .gitignore
  ├── README.md
  ├── server.js
  ├── routes.js
  ├── bower.json
  ├── package.json
  └── views
	├── index.handlebars
	├── css
	|    └── style.css
	├── images
	|    ├── behn.png	
	|    ├── meitner.png
   	|    ├── rorschach.png
	|    └── tinbergen.png
	├── staff
	|    ├── index.handlebars
	|    ├── style.css
	|    ├── client.js
	|    ├── raffle
	|    |   ├── index.handlebars
	|    |   └── style.css
	|    ├── list
        |    |   └── index.handlebars
	└── login
	     ├── index.handlebars
             └── style.css

1 directory, 6 sub-directories,  20 files
```
##DB
For bgsquiz we have use a mongo db show below:
```
└── Scores
    ├── name
    └── score
└── Teams
     ├── teamname
     ├── house
     ├── room
     ├── r1
     ├── r2
     ├── r3
     ├── r4
     ├── r5
     └── r6
```

##Setup
###Node
####Installing Node 
Installation Guide Can Be Found Here: https://github.com/joyent/node/wiki/installation

####Installing Node From A Package Manager - I Recomend This Method
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

###Installing Node Depedecies
####PM2
pm2: ```[sudo] npm install pm2 -g ```
####Bower
bower: ```[sudo] npm install bower -g ```


###Mongo
Installation Guide Can Be Found Here: http://docs.mongodb.org/manual/installation/

###Installing Modules
#### NPM
``` [sudo] npm install ```

#### Bower
``` bower install ```

###Setting Up pm2
PM2 is what is used to run the app on the server

####To Start The Server
``` pm2 start server.js --name "BGSQuiz" ```

####To See Running Apps
``` pm2 list ```

###Setting Up Nginx

####Edit sites-avaliable file
Add this to your server blocks file:

    	       server{
	                listen 80;

			server_name <<Replace With You Domain>>;

	                location /{
			      root /path/to/app/;
         	              index index.htm index.html;
			      proxy_set_header X-Real-IP $remote_addr;
			      proxy_set_header Host      $http_host;
			      proxy_pass       http://127.0.0.1:1884;
	                }
	             }

Replace ther ```server_name``` with your domain name and replace ```root``` to the path of your app.


####Restart nginx
```sudo service nginx restart ```

That's It - Your Set Up!
