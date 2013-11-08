var 
	path = require('path'),
	Bookshelf= require('bookshelf'),
	GistcampBookshelf,
	User
;

GistcampBookshelf = Bookshelf.initialize({
	client: 'sqlite3',
	connection: {
		filename: path.join(__dirname, '/data/gistcamp-dev.db')			
	}
});

GistcampBookshelf.User = GistcampBookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true
});

GistcampBookshelf.Tag = GistcampBookshelf.Model.extend({

});

GistcampBookshelf.Following = GistcampBookshelf.Model.extend({

});

GistcampBookshelf.Starred = GistcampBookshelf.Model.extend({

});

GistcampBookshelf.Watch = GistcampBookshelf.Model.extend({

});


module.exports = GistcampBookshelf;

