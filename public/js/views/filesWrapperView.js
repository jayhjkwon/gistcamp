define(function(require) {
  var
  $ = require('jquery'),
    _ = require('underscore'),
    Marionette = require('marionette'),
    filesWrapperTemplate = require('hbs!templates/filesWrapperTemplate'),
    Application = require('application'),
    constants = require('constants'),
    nicescroll = require('nicescroll'),
    bootstrap = require('bootstrap'),
    prettify = require('prettify'),
    File = require('models/file'),
    Files = require('models/files'),
    service = require('service'),
    util = require('util'),
    postalWrapper = require('postalWrapper'),
    Spinner = require('spin'),
    markdown = require('markdown'),

    FilesWrapperView = Marionette.ItemView.extend({
      className: 'files',
      template: filesWrapperTemplate,

      initialize: function(options) {
        _.bindAll(this, 'onDomRefresh', 'bindFiles', 'onItemSelected',
          'onRefreshRequested');
        this.spinner = new Spinner({
          length: 7
        });
        this.subscriptionItemSelected = postalWrapper.subscribe(constants.GIST_ITEM_SELECTED,
          this.onItemSelected);
        this.subscriptionReload = postalWrapper.subscribe(constants.GIST_ITEM_RELOAD,
          this.onRefreshRequested);
      },

      onDomRefresh: function() {
        if ($('.files-wrapper').length) {
          $('.files-wrapper').niceScroll({
            cursorcolor: '#eee'
          });
        }
        $('.carousel').carousel({
          interval: false
        }).on('slid', this.markActiveFileHeader);

        if (this.selectedGistItem) {
          var filesArray = _.toArray(this.selectedGistItem.files);
          var exist = _.find(filesArray, function(file) {
            return file.size > 10240; //over 10kb
          });
          if (!exist)
            prettyPrint(); // prettyprint function cause performance issue especially when loading big file
        }
      },

      markActiveFileHeader: function() {
        var activeIndex = $('.carousel-inner .item').index($(
          '.carousel-inner .item.active'));
        $('.pivot-headers a').removeClass('active');
        var pivotHeader = $('.pivot-headers a')[activeIndex];
        $(pivotHeader).addClass('active');
      },

      bindFiles: function(gistItem) {
        var self = this;
        var filesArray = _.toArray(gistItem.files);

        if (filesArray.length) {
          filesArray[0].isActive = true;
        }

        if (self.refreshRequested || (filesArray.length && !filesArray[0].file_content)) { // in case that file contents are not set yet
          if (self.refreshRequested)
            $('.btn-reload .icon-refresh').removeClass('icon-spin').addClass(
              'icon-spin');
          else
            self.loading(true);

          self.collection = new Files(filesArray);
          self.collection.fetch({
            data: {
              files: filesArray
            }
          })
            .done(function() {
              _.each(self.collection.models, function(file) {
                if (file.get('language') && file.get('language').toLowerCase() ===
                  'markdown' && file.get('file_content')) {
                  file.set('isMarkdown', true);
                  file.set('file_content', markdown.toHTML(file.get(
                    'file_content')));
                }
                if (file.get('type') === 'image/jpeg' || file.get(
                    'type') === 'image/jpg' || file.get('type') ===
                  'image/png' || file.get('type') === 'image/gif') {
                  file.set('isImage', true);
                }
              });
              self.render();
            })
            .always(function() {
              self.loading(false);
              if (self.refreshRequested) {
                self.refreshRequested = false;
                $('.btn-reload .icon-refresh').removeClass('icon-spin');
              }
            });

        } else {
          self.collection = new Files(filesArray);
          self.render();
        }
      },

      onItemSelected: function(gistItem) {
        this.selectedGistItem = gistItem; // for refreshing files later
        this.bindFiles(gistItem);
      },

      onRefreshRequested: function() {
        var self = this;
        self.refreshRequested = true;
        self.bindFiles(self.selectedGistItem);
      },

      loading: function(showSpinner) {
        if (showSpinner) {
          var target = $('.files-wrapper')[0];
          this.spinner.spin(target);
        } else {
          this.spinner.stop();
        }
      },

      onClose: function() {
        this.subscriptionItemSelected.unsubscribe();
        this.subscriptionReload.unsubscribe();
      }
    });

  return FilesWrapperView;
});
