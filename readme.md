# Clone of the card game wizard 
## Overview

This game is built on Node.js and Socket.io and is tested to use with Googles Chrome browser. The idea is to use a tablet or a similar screen as the "game board / game table". You can create a new game and others may join that game by entering the game id in the browser on their smartphone. 
If enough players have joined the game is ready to start and by hitting the "start round" button the game server will distribute the playing cards to all connected players. These players now have the possibility to guess the number of tricks they want to make. After that the round is opened and the players are able to play their cards.

## TODO's
- Implement server side session logic and remove the dependence on socket id's
- Implement disconnect and connect handling in running games
- Clean up server side node modules and dependencies
- Clean up client side dependencies
- Write tests for all client side angular.js code
- Add a testing framework to the server and test all code
- Rethink server side architecture (consider inheritance, observers, command, etc.. )




