'use strict';

angular.module('clientApp')
  .directive('tbPlayingCard', function ($document) {
    return {
      templateUrl: '../../views/tb-playingcard.html',
      restrict: 'E',
      scope: {
        card: '=info',
        throwCard: '&callbackFn'
      },
      link: function(scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;
        var scrollXStart = 0;
        var parent = element.parent().parent();

        // Init touch event to mouse event matcher
        //init();

        element.css({
          position: 'relative'
        });

        element.on('mousedown touchstart', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();

          element.removeClass('playing-card-animation');

          var eventPos = {x: 0, y: 0};
          // Check if it was a touch event
          if (typeof event.changedTouches != 'undefined') {
            var touch = event.changedTouches[0];
            eventPos.y = touch.pageY;
            eventPos.x = touch.pageX;
          }
          else {
            eventPos.y = event.pageY;
            eventPos.x = event.pageX;
          }


          startY = eventPos.y - y;
          scrollXStart = eventPos.x;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
          $document.on('touchmove', mousemove);
          $document.on('touchend', mouseup);
        });

        function mousemove(event) {
          var eventPos = {x: 0, y: 0};
          // Check if it was a touch event
          if (typeof event.changedTouches != 'undefined') {
            var touch = event.changedTouches[0];
            eventPos.y = touch.pageY;
            eventPos.x = touch.pageX;
          }
          else {
            eventPos.y = event.pageY;
            eventPos.x = event.pageX;
          }


          var delta = (eventPos.x - scrollXStart) * 0.1;
          var scrollOld = parent.prop('scrollLeft');
          parent.prop('scrollLeft', scrollOld - delta);


          y = eventPos.y - startY;
          if (y > 0) {
            y = 0;
          }

          element.css({
            top: y + 'px'
          });
        }

        function mouseup() {
          var halfHeight = element.children()[0].offsetHeight / 2
          var dragValue  = Math.abs(parseInt(element.css('top')));

          element.addClass('playing-card-animation');

          // Check if the user dragged the element more than 50%
          if (dragValue > halfHeight) {

            if(scope.throwCard(scope.card) === false) {
              element.css({
                top: 0
              });
            }
            else {
              element.css({
                top: -(halfHeight * 2 + 50) + 'px'
              });
            }
          }
          else {
            element.css({
              top: 0,
            });
          }

          // Reset values
          startX = 0, startY = 0, x = 0, y = 0;
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
          $document.unbind('touchmove', mousemove);
          $document.unbind('touchend', mouseup);
        }
      }
    };
  });
