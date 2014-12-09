BGSQuiz
=======

Application for managing the points at the annual Bourne Grammar School House Quiz competition. Built by [Edward Digby](http://twitter.com/ejdigby) and Designed by [James Brooks](http://twitter.com/jamesbrks).

Our school house system is as follows:
 - Behn
 - Meitner
 - Rorschach
 - Tinbergen
 
### Structure
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
###DB
For bgsquiz we have use a mongo db show below:
