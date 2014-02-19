'use strict';

angular.module('clientApp')
  .directive('tbPlayingCard', function ($document) {

    function touchHandler(event) {
      var touch = event.changedTouches[0];

      var simulatedEvent = document.createEvent("MouseEvent");
          simulatedEvent.initMouseEvent({
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup"
      }[event.type], true, true, window, 1,
          touch.screenX, touch.screenY,
          touch.clientX, touch.clientY, false,
          false, false, false, 0, null);

      touch.target.dispatchEvent(simulatedEvent);
      event.preventDefault();
    }

    function init() {
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);
    }

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
        init();

        element.css({
          position: 'relative'
        });

        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();

          element.removeClass('playing-card-animation');

          startY = event.pageY - y;
          scrollXStart = event.pageX;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          var delta = (event.pageX - scrollXStart) * 0.1;
          var scrollOld = parent.prop('scrollLeft');
          parent.prop('scrollLeft', scrollOld - delta);


          y = event.pageY - startY;
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
        }
      }
    };
  });
