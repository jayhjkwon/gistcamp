define(function(require){
	var
		Backbone = require('backbone'),
		
		User = Backbone.Model.extend({
			urlRoot : '/rest/users/',
			url 	: function(){ 
				if (this.id){
					return this.urlRoot + this.id; 
				}else{
					return this.urlRoot;
				}
			}
		})
	;

	return User;
});