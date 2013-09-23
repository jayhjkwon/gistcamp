define(function(require){
	var
		$ 				= require('jquery'),
		_ 				= require('underscore'),
		Backbone		= require('backbone'),
		Marionette 		= require('marionette'),		
		Handlebars      = require('handlebars'),
		Spinner         = require('spin'),
		ChatItemView	= require('./chatItemView'),
		NoItemsView		= require('./NoItemsView'),
		constants       = require('constants'),
		util            = require('util'),
		async           = require('async'),
		service         = require('service'),
		File            = require('models/file'),
		global          = require('global'),
		ChatItemList    = require('models/chatItemList'),
		ChatItem        = require('models/chatItem'),
		postalWrapper   = require('postalWrapper'),
		moment          = require('moment'),
		
		ChatItemListView = Marionette.CollectionView.extend({
			className: 'chat-item-container',
			itemView: ChatItemView,
			collection: new ChatItemList,
			currentGistDataMode: '',
			rooms: {},
			selectedRoomName: '',

			initialize: function(){
				_.bindAll(this, 'getChatList', 'addChatList', 'onClose', 'removeChatList', 'onItemSelected', 'getChatHistory');
				
				this.spinner = new Spinner();
				this.subscriptionUpdateRoom = postalWrapper.subscribe(constants.CHAT_UPDATE_ROOM, this.getChatList);
				this.subscriptionCreateRoom = postalWrapper.subscribe(constants.CHAT_CREATE_ROOM, this.addChatList);
				this.subscriptionDeleteRoom = postalWrapper.subscribe(constants.CHAT_DELETE_ROOM, this.removeChatList);
				this.subscriptionItemSelected = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED, this.onItemSelected);
			},

			events : {
			},

			getChatList: function(){
				var self = this;
				
				self.rooms = global.rooms;

				if (_.size(self.rooms) === 0){
					self.collection.reset();	
				}

				$.each(self.rooms, function(key, value) {
		    		var chatItem = new ChatItem({'gistId': key});
		    		chatItem.fetch()
		    		.done(function(res) {
		    						
		    			var isUpdated = false;

			    		for (var index = self.collection.models.length - 1; index >= 0; index--) {
		    				if (self.collection.models[index].id === key) {
	    						
	    						res.data['room'] = self.rooms[key];

	    			 			var childView = self.children.findByModel(self.collection.models[index]);
								childView.modelChanged(key, self.rooms[key]);

								isUpdated = true;
		    				}		    				
			    		}

		    			if (isUpdated == false) {
							res.data['room'] = self.rooms[key];
							self.collection.add(res.data);	
		    			}
		    		})
		    		.always(function() {
						self.loading(false);
						for (var index = self.collection.models.length - 1; index >= 0; index--) {
							if (self.collection.models[index].id === self.selectedRoomName) {
			    					var childView = self.children.findByModel(self.collection.models[index]);
									childView.onAddClassSelected();
									break;
		    				}
		    			}
					})
		    	});
			},

			addChatList: function(gist, callback){
				var self = this;
				self.selectedRoomName = gist.id;
				self.loading(true);

	    		var chatItem = new ChatItem({'gistId': gist.id});
	    		chatItem.fetch()
	    		.done(function(res){
	    			res.data['room'] = self.rooms[gist.id];
    				self.collection.add(res.data);
    				
    				self.getChatHistory(res.data.content);
	    		})
	    		.always(function(){
			    	self.loading(false);
			    	$('#conversation-content').scrollTop($("#conversation-content")[0].scrollHeight);
	    		});
			},

			onItemSelected: function(gistItem){
				var self = this;
				self.loading(true);

				this.selectedRoomName = gistItem.id;

				var chatItem = new ChatItem({'gistId': gistItem.id});
	    		chatItem.fetch()
	    		.done(function(res){
	    			self.getChatHistory(res.data.content);
	    		})
	    		.always(function(){
			    	self.loading(false);
			    	$('#conversation-content').scrollTop($("#conversation-content")[0].scrollHeight);
	    		});
			},

			getChatHistory: function(cotents) {
				$('#conversation').html('');
				for (var i = 0; i < cotents.length; i++) {
					if (cotents[i].user_login === 'SERVER') {

						var server = '<div class="server">'
						+ '<span class="message">' + cotents[i].content + '</span>'
						+ '</div>';

						var right = '<div class="right">'
						+ '<span class="time">' + cotents[i].created_at + '</span>'
						+ '</div>';

						$('#conversation').append('<li class="chatli">' + server + right + '</li>');
					}
					else {
						
						var left = '<div class="left">' 
						+ '<img class="gravatar" src="' + cotents[i].avatar_url + '" </img>' 
						+ '<div class="name">' + cotents[i].user_login + '</div>'
						+ '</div>';

						var middle = '<div class="middle">'
						+ cotents[i].content
						+ '</div>';

						var right = '<div class="right">'
						+ '<span class="time">' + cotents[i].created_at + '</span>'
						+ '</div>';

						$('#conversation').append('<li class="chatli">' + left + middle + right + '</li>');
					}
				};
			},

			removeChatList: function(roomname) {
				var self = this;
				for (var index = self.collection.models.length - 1; index >= 0; index--) {
    				if (self.collection.models[index].id === roomname) {
						self.collection.remove(self.collection.models[index]);
						break;
    				}
	    		}
			},

			onClose: function(){
				
				this.subscriptionUpdateRoom.unsubscribe();
				this.subscriptionCreateRoom.unsubscribe();
				this.subscriptionDeleteRoom.unsubscribe();
				this.subscriptionItemSelected.unsubscribe();

				global.socket.emit('leaveRoom', this.selectedRoomName);
			},

			loading: function(showSpinner){
				if (showSpinner){
					$('#chat-list').append('<div style="height:100px;" class="loading"></div>');
					var target = $('#chat-list .loading')[0];
					this.spinner.spin(target);
				}else{					
					this.spinner.stop();					
					$('.loading').remove();	
				}
			}
		})
	;

	return ChatItemListView;
});