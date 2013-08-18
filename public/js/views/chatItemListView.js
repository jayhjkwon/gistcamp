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

			initialize: function(){				
				_.bindAll(this, 'getChatList', 'addChatList', 'onRender', 'onClose');
				
				this.spinner = new Spinner();
				this.subscriptionUpdateRoom = postalWrapper.subscribe(constants.CHAT_UPDATE_ROOM, this.getChatList);
				this.subscriptionCreateRoom = postalWrapper.subscribe(constants.CHAT_CREATE_ROOM, this.addChatList);
			},

			events : {
			},
			
			getChatList: function(){
				var self = this;
				self.rooms = global.rooms;

				$.each(self.rooms, function(key, value) {
		    		var chatItem = new ChatItem({'gistId': key});
		    		chatItem.fetch()
		    		.done(function(res){
		    			if (self.collection){
		    				res.data['room'] = self.rooms[key];
		    				self.collection.add(res.data);
		    				//self.setFirstItemSelected();
		    			}else{
		    				self.collection = new ChatItemList;
		    				res.data['room'] = self.rooms[key];
		    				self.collection.add(res.data);
		    				
		    			}
		    		});
		    	});

		    	self.render();
		    	self.loading(false);
			},
			
			addChatList: function(gist, callback){
				var self = this;
				self.rooms = global.rooms;

				self.loading(true);

	    		var chatItem = new ChatItem({'gistId': gist.id});
	    		chatItem.fetch()
	    		.done(function(res){
	    			res.data['room'] = self.rooms[gist.id];

					console.log(res.data['room'][0].login);

    				self.collection.add(res.data);
    				self.setLastItemSelected();
	    				//$('.chat-item').last().trigger('click');
	    		})
	    		.always(function(){
	    			// self.render();
			    	// $('.chat-item').last().addClass('selected');
			    	self.loading(false);
	    		});
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