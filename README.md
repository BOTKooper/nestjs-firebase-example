# NestJS Firebase example

This repo represents how we could use NestJS with firebase functions via both HTTP and https.OnCall


## Ideas and background

In our project we had APIs that communicated with each other over RabbitMQ and we had to move further - to serverless (yeah, I just didn't want to scale all this stuff up). So, I made this repo as the playground to test some ideas and came to solution for our problem. 

With this demo you could have both http and callable functions at the same time, all written with fullt support NestJS and ~~Angulars~~ its awesome concepts.


## Usage

If you want to make ordinary http functions - nothing changed, for Callabled there is special `@Callable` decorator, which helps you to mark **any** method as callable and, afterwards, exports them from `main.ts` file for firebase environment.

For start you need to change the project in `.firebaserc`, build it with `npm run build` and start with `firebase emulators:start`

To deploy all of this, you should do `firebase deploy --only functions`


