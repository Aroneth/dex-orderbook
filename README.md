# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Test Project Summary

Overall summary for the works have done and the future improving plan

### Features covered
* Plain React Hooks use Context Provider to maintain a singleton Socket Client instance, for Error handling and Connection management in Singleton provider only;
* One more subscrbtion callbacks on top of Socket IO Client for specific productId BookDepth, which is easy for multiple components usage;
* Use `utils/diffUpdateOrders` to update Order with the new quantity only
* Performance enhance by using Price as the React component's identify key;

* `extra` React-Query version to use QueryClient cache in order to work with WebSocket event system;
* `extra` Basic order book UI to showing Asks and Bids list, and Token list selection from Products API;

### TODO / Improvements
* Current solution support multiple Components use the Hook in the same time, but meanwhile if with the same ProductId the unmount will unsubscrible all the event callbacks;
* Why do we need a loading state for Socket? how can we tell the requesting stage?
* I use Promise resolve for React-Query solution, but it won't consistently execute callbacks, But I reckon currently use `queryClient.setQueryData` to infinitly set cache is kind of a hacking way.
* Socket return price/quantity diff list, but should we keep the whole Orders as a fixed length list? eg: price is rising if Socket keep returning the new price/quantity, the Orders data will always growing
