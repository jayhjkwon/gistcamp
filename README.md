# GistCamp #
[The GistCamp](http://gistcamp.com) is an web app that helps organize and share your gists.

## Features
* The GistCamp is an web interface of GitHub's GIST service, more focuses on sharing your gists with your followings and followers of your GitHub account.
* You can organize your gists by tagging and starring.
* You can watch your followings and followers' gists. 
* If commenting on other gists is not enough, you can chat with other geeks.
* You will get notification instantly once other geeks comment on your gist or send chat messages to you.
* You can share the gists on Facebook, Twitter and Google+
* As you see here, all the source code of the GistCamp is open-sourced. Please help us make the GistCamp more robust and richer by forking this repository.

## How to run GistCamp on your local machine
Prerequistes
* [Node.js](http://nodejs.org)
* [Bower](http://bower.io)
* [Grunt](http://gruntjs.com)
* [MongoDB](http://www.mongodb.org)

In CLI:
```bash
mongod 
npm install
bower install
bower install jquery-nicescroll
bower install autogrow-textarea
bower install ace
grunt
node server
```

Then go to `http://localhost:3000` in your browser.

If you do not want to install the gistcamp on your machine just come to [http://gistcamp.com](http://gistcamp.com)

## License

Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



