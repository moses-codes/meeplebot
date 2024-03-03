# meeplebot
Meeplebot is a Discord bot that helps you schedule your game night. Best paired with my board game app, [MeepleMatch](https://github.com/moses-codes/meeplematch).

![Meeplebot in action](https://i.ibb.co/pzwyRtf/Screenshot-176.png)

## How It's Made:

**Tech used:** Node.js, JavaScript, Discord.js

Node.js is a powerful and versatile JavaScript runtime that allows for event-driven programming on the backend using JavaScript syntax. JavaScript's object-orientedness allows for a solid foundation for the manipulation of data. 
I utilized the Discord.js module to develop a Discord bot with three primary functions:

1. The bot allows users to input their availability for scheduling board game nights.
2. It listens for user responses indicating their availability within the specified timeframe.
3. It automatically adds the available users to a dedicated Discord thread for further coordination.

## Optimizations

Finding the balance between dividing code into sensible modules and segments that are too granular is something I still would like to work on. While I know how problems can be solved using code, Iwould love to explore further how to implement a highly maintainable structure from the get-go, rather than optimizing the structure as I go. 

## Lessons Learned:

Discord.js's suite of Classes and Methods that allow for straightforward communication with the Discord API endpoints was daunting at first. While the provided [guide](https://discordjs.guide/) is a great place to start, the learning curve from there to creating more advanced commands using the many different classes available was extremely high. But when I realized that the classes were just prototypal inheritance in action, navigating the docs became less daunting. 

In the future, familiarizing myself with the included classes of any given object-oriented module before diving deep would be ideal, although I did learn a lot by trying to make sense of the documentation. 

ALWAYS CHECK TO SEE IF YOUR BOT HAS THE REQUISITE PERMISSIONS. It'll save you potential of hours of debugging. 
