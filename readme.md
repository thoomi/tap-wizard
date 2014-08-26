DEPRECATED: This repository has been split into tap-wizard-client and tap-wizard-server. Please use them for reference.

## Idea

The main idea behind TapWizard was to develop a game which should renovate the old 
concept of a parlor game, namely to meet with friends, play a game and have fun together, by making 
use of modern technologies. The Smartphone surely is one of these technologies and that’s why it is 
supposed to be the primarily game controller. It comes with the advantage that almost everyone always 
carries one and thus makes it possible to for users to make spontaneous game sessions. Eventually the 
decision  felt  to  implement  the  famous  card  game  Wizard  as  a  browser  based  multiplayer  game. 
Browser based because of the fact that one is independent from a single operating system and the game 
can be available on all major platforms without installation (provided that a web browser is already 
installed). To illustrate that this is a clone of the card game Wizard which is not played traditionally 
associated with paper cards, but mostly with touchable devices, the project name “TapWizard” was 
chosen.

## Basic game flow

At the start of the game each player resp. device down loads the game client 
through an URL and then gets the option either to start a new game or to join an already opened and 
existing game.  The device  that serves  as  the game table opens up  a new  game by switching  into  a 
lobby which gets assigned a unique public ID. This ID is used by the players on their client to connect 
to exact that lobby. Are at least three players connected to the lobby, the game can be started via a 
button on the host device, so that all players receive a message about the start of the game and can 
switch to the active game mode. After this happened the server-side game logic decides which player 
begins and distributes the playing cards to all connected clients. Those in turn can now play their cards 
with a simple “swipe up” gesture. Thrown cards by a player are processed on the game server and sent 
to the host (device which opened the game) which shows them on the “game table”. Once all cards 
have  been  played  in  round  the  game  logic  calculates  the  respective  score  and  also  sends  it  to  the 
scoreboard on the host device. Thus the round ends and the next round can be started by the button on 
the host device. 

## Development

If you plan to use the project make sure to run 

    npm install

in both, the root folder and the client folder.


## License

Copyright (c) 2014 Thomas Blank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

