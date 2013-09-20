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
		
		ChatItemListView = Marionette.CollectionView.extend({
			className: 'chat-item-container',
			itemView: ChatItemView,
			collection: new ChatItemList,
			currentGistDataMode: '',
			rooms: {},
			selectedRoomName: '',

			initialize: function(){				
				_.bindAll(this, 'getChatList', 'addChatList', 'onRender', 'onClose', 'removeChatList', 'onItemSelected', 'getChatHistory');
				
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
				setTimeout(function() {
					self.rooms = global.rooms;

					if (_.size(self.rooms) === 0){
						self.collection.reset();	
					}
					// res.data['room'] = self.rooms[key];
					// self.collection.reset(res.data);	

					$.each(self.rooms, function(key, value) {
			    		var chatItem = new ChatItem({'gistId': key});
			    		chatItem.fetch()
			    		.done(function(res) {
			    						
			    			var isUpdated = false;

				    		for (var index = self.collection.models.length - 1; index >= 0; index--) {
			    				if (self.collection.models[index].id === key) {
		    							// if (_.size(res.data['room']) != _.size(self.rooms[key])) {
		    						res.data['room'] = self.rooms[key];
									self.collection.reset(res.data);
									
									isUpdated = true;	
		    						// }
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
				}, 600);
			},

			onDomRefresh: function(){
				// if ( !$('#comment-input').val())
				// 	$('.btn-comments').trigger('click');
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
	    			// self.render();
			    	// $('.chat-item').last().addClass('selected');
			    	self.loading(false);
			    	$('#conversation').scrollTop($("#conversation")[0].scrollHeight);
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
	    			// self.render();
			    	// $('.chat-item').last().addClass('selected');
			    	self.loading(false);
			    	$('#conversation').scrollTop($("#conversation")[0].scrollHeight);
	    		});
			},

			getChatHistory: function(cotents) {
				$('#conversation').html('');
				for (var i = 0; i < cotents.length; i++) {
					if (cotents[i].user_login === 'SERVER') {
						$('#conversation').append(cotents[i].content + '<br>');	
					}
					else {
						
						$('#conversation').append('<img src=' 
							+ cotents[i].avatar_url
							+ ' style="margin-top:5px;width:20px;height:20px;"/>' +  ' <b>'
							+ cotents[i].user_login + ':</b> ' 
							+ cotents[i].content + '<br>');
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

			// handleGist : function(gist, callback){
			// 	var self = this;
			// 	var files = _.values(gist.files);
			// 	async.each(files, self.setFileContent, function(error, result){
			// 		callback(null, gist);
			// 	});
			// },			

			// setFileContent : function(file, callback){
			// 	var xhr = service.getFileContent(file, callback);
			// 	this.xhrs.push(xhr);
			// },

			onClose: function(){
				
				this.subscriptionUpdateRoom.unsubscribe();
				this.subscriptionCreateRoom.unsubscribe();
				this.subscriptionDeleteRoom.unsubscribe();
				this.subscriptionItemSelected.unsubscribe();

				global.socket.emit('leaveRoom', this.selectedRoomName);
				
				// var self = this;
				// _.each(self.xhrs, function(xhr){
				// 	var s = xhr.state();
				// 	if (s === 'pending') {
				// 		xhr.abort();	// abort ajax requests those are not completed
				// 	}
				// });
			},

			setLastItemSelected: function(){
		    	$('.chat-item').last().trigger('click');
		    },		    
			onRender : function(){
				$('.chat-list').niceScroll({cursorcolor: '#eee'});

				// register scroll event handler, this shuld be registered after view rendered
				$('.chat-list').off('scroll').on('scroll', this.onScroll);
			},
			onDomRefresh: function(){
				// util.loadSpinner(false);
			},
			// onScroll : function(){
				// var w = $('.chat-list');
				// if(w.scrollTop() + w.height() == $('.chat-item-container').height()) {
		  //      		this.loadMore();
			 //    }
			// },
			// loadMore: function(){
			// 	if(self.lastPage) return;
			// 	this.loading(true);
			// 	this.getGistList();
			// },
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
			// showEndofDataSign: function(){
			// 	$('#chat-list').append('<div style="height:50px;font-size:15px;font-weight:bold;text-align:center;">End of Data..</div>');
			// }

		})
	;

	return ChatItemListView;
});