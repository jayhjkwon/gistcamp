define(function(require){
	var
		Marionette = require('marionette'),
		userTemplate = require('hbs!templates/userTemplate'),
		UserItemView = require('./userItemView'),
		NoItemsView = require('./noItemsView'),
		User = require('models/user'),
		UserList = require('models/userList'),
		App = require('application');

/*define(['marionette', 'hbs!templates/userTemplate', './userItemView', './noItemsView', 'models/user', 'models/userList', 'app'],
 function(Marionette, userTemplate, UserItemView, NoItemsView, User, UserList, App){		*/

	var
		UserView = Marionette.CompositeView.extend({
			itemView : UserItemView,
			itemViewContainer: "ul",
			template : userTemplate,
			collection : new UserList,
			initialize : function(){
			},
			events   : {
				'click #btn-save-user' 		: 'addUser',
				'click #btn-delete-user' 	: 'deleteUser'
			},					
			ui       : {
				txtUserName : '#txt-user-name'
			},
			emptyView : NoItemsView,
			onClose: function(){
				console.log('UserView closed');
			},
			getUser : function(){
				var 
					self = this,
					userList = new UserList;
				userList.fetch().done(function(data){
					self.collection.set(data);							
				});	
			},
			addUser  : function(e){
				var 
					self = this,
					user = new User(),
					name = this.ui.txtUserName.val();

				user.save({
						name: name
					}, {
					success: function(model, response, options){
						self.collection.add(model.toJSON());
					},
					error: function(){
						alert('error');
					}
				});
			},
			deleteUser 	: function(){
				var 
					self = this,
					userToDelete = self.collection.at(self.collection.length-1);

				if (!userToDelete) return;
				userToDelete.destroy({
					success : function(model, response, options){
						self.collection.remove(userToDelete);
						App.vent.trigger('user:delete', userToDelete.toJSON());
					},
					error   : function(model, xhr, options){
						alert('error');
					}
				});						
			},
			onBeforeItemAdded: function(itemView){
				console.log('onBeforeItemAdded');
			},
			onAfterItemAdded: function(itemView){
				console.log('onAfterItemAdded');
			}

		})
	;

	return UserView;
});