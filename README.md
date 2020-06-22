[![Maintainability](https://api.codeclimate.com/v1/badges/7eb2c53b1f21eab6e1de/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/Merch-Dropper-be/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/7eb2c53b1f21eab6e1de/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/Merch-Dropper-be/test_coverage)

# API Documentation

Published at [https://documenter.getpostman.com/view/10983809/Szzn6wWF?version=latest] for a more readable version
Steps to get access:

1. Sign-Up/Login to Postman
2. Navigate to Merch Dropper workspace
3. Navigate to Collections tab
4. Click on Merch Dropper to CRUD documentation

#### Backend deployed at [Heroku](https://merchdropper-production.herokuapp.com) <br>

## Getting started

To get the server running locally:

1.  Clone this repo
2.  **yarn install** to install all required dependencies
3.  **yarn server** to start the local server
4.  **yarn test** to start server using testing environment

### Backend framework goes here

-   NodeJS
-   Express,
-   Postgres

#### Why did you choose this framework?

-   Ease of use
-   Familiarity
-   A true Relational Database best serves our purposes at this time

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

-   ### create a .env file that includes the following:

-   PORT=5032 or pick your favorite ;) defaults to 4000 in Development
-   NODE_ENV=development --- set to "development" until ready for "production"
-   JWT_SECRET=[any randomly generated or complex string will work here]

## Contributing

-   When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Check first to see if your issue has already been reported.
-   Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
-   Create a live example of the problem.
-   Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.
-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
-   Ensure that your code conforms to our existing code conventions and test coverage.
-   Include the relevant issue number, if applicable.
-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

1.  See [Frontend Documentation](https://github.com/Lambda-School-Labs/Merch-Dropper-fe/blob/master/README.md) for details on the frontend of our project.

2. (Legacy BE documentation; Updated docs are above) See [Postman Backend Documentation](https://documenter.getpostman.com/view/9427795/SWTHYuA5?version=latest) for more details on the backend of our project.


## Endpoints

### base URL `https://merchdropper-production.herokuapp.com/`

<br> <br>

### User Routes

-   project has JWT as a back up auth system(disabled), primary system is Auth0

| Method | Endpoint                  | Access Control | Description                                |
| ------ | ------------------------- | -------------- | ------------------------------------------ |
| POST   | `/api/auth/register`      | all users      | Registers a new user.                      |
| POST   | `/api/auth/login`         | all users      | Logs a registered user in                  |
| GET    | `/api/users`              | admin          | get all users                              |
| GET    | `/api/users/:id`          | admin          | get a user by ID                           |
| GET    | `/api/users/:username`    | admin          | get a user by username                     |
| GET    | `/api/users/email/:email` | admin          | get a user by email                        |
| PUT    | `/api/users/:username`    | mixed          | Edit a user in system, Admin and self only |
| DELETE | `/api/users/:username`    | owners         | Delete a user, admin and self only.        |

### Store Routes

| Method | Endpoint                            | Access Control | Description                                 |
| ------ | ----------------------------------- | -------------- | ------------------------------------------- |
| POST   | `/api/stores`                       | logged in user | Registers a new store to user logged.       |
| GET    | `/api/stores`                       | logged in user | get all stores                              |
| GET    | `/api/stores/:id`                   | logged in user | Get a Store by ID                           |
| GET    | `/api/stores/storename/:store_name` | logged in user | Get a Store by store_name                   |
| GET    | `/api/stores/domain/:domain_name`   | logged in user | Get a Store by domain_name                  |
| GET    | `/api/stores/user/:userID`          | logged in user | Get a Store by userID                       |
| PUT    | `/api/stores/:storeID`              | logged in user | Edit a store in system, Admin and self only |
| DELETE | `/api/stores/:store_name`           | logged in user | Delete a store, admin and self only.        |

### Product Routes

| Method | Endpoint                       | Access Control | Description                          |
| ------ | ------------------------------ | -------------- | ------------------------------------ |
| POST   | `/api/products`                | logged in user | Adds a new product to user logged.   |
| POST   | `/api/products/mockup`         | logged in user | Product added to ScalablePress       |
| GET    | `/api/products`                | logged in user | Get all products                     |
| GET    | `/api/products/:id`            | logged in user | Get a product by ID                  |
| GET    | `/api/products/store/:storeID` | logged in user | Get products associated with storeID |
| POST   | `/api/products/price           | logged in user | Get product price from ScalablePress |
| PUT    | `/api/products/:id`            | logged in user | Edit a product by ID                 |
| DELETE | `/api/products/:id`            | logged in user | Delete a product by ID.              |


### Quote Routes

| Method | Endpoint                             | Access Control | Description                           |
| ------ | ------------------------------------ | -------------- | ------------------------------------- |
| POST   | `/api/quotes`                        | admin          | Adds a new quote tied to user logged. |
| GET    | `/api/quotes`                        | mixed          | get all quotes                        |
| GET    | `/api/quotes/:id`                    | mixed          | Get a quote by ID                     |
| GET    | `/api/quotes/quotetoken/:quoteToken` | mixed          | Get a quote by order_token            |
| PUT    | `/api/quotes/:quoteID`               | admin          | Edit a quote in system by ID          |
| PUT    | `/api/quotes/ordertoken/:ordertoken` | admin          | Edit a quote in system by order_token |
| DELETE | `/api/quotes/:quoteID`               | admin          | Delete a quote.                       |
| DELETE | `/api/quotes/ordertoken/:orderToken` | admin          | Delete a quote.                       |

### Order Routes

| Method | Endpoint                             | Access Control | Description                                      |
| ------ | ------------------------------------ | -------------- | ------------------------------------------------ |
| POST   | `/api/orders`                        | admin          | Adds an new order tied to user logged.           |
| GET    | `/api/orders`                        | mixed          | get all orders                                   |
| GET    | `/api/orders/:id`                    | mixed          | Get an order by ID                               |
| GET    | `/api/orders/ordertoken/:orderToken` | mixed          | Get an order by order_token                      |
| GET    | `/api/orders/sporderid/:spOrderID`   | mixed          | Get an order by ScalablePress orderID            |
| PUT    | `/api/orders/:orderID`               | admin          | Edit an order in system by ID                    |
| PUT    | `/api/orders/sporderid/:spOrderID`   | admin          | Edit an order in system by ScalablePress orderID |
| PUT    | `/api/orders/ordertoken/:orderToken` | admin          | Edit an order in system by order_token           |
| DELETE | `/api/orders/:orderID`               | admin          | Delete an order by ID.                           |
| DELETE | `/api/orders/ordertoken/:orderToken` | admin          | Delete an order by order_token.                  |
| DELETE | `/api/orders/sporderid/:spOrderID`   | admin          | Delete an order by ScalablePress order_token.    |

### Design Routes

| Method | Endpoint                 | Access Control | Description                            |
| ------ | ------------------------ | -------------- | -------------------------------------- |
| POST   | `/api/designs`           | mixed          | Adds a new design tied to user logged. |
| GET    | `/api/designs`           | mixed          | get all designs                        |
| GET    | `/api/designs/:id`       | mixed          | Get a design by ID                     |
| PUT    | `/api/designs/:designID` | mixed          | Edit a design in system by ID          |
| DELETE | `/api/designs/:designID` | admin          | Delete a design.                       |

<br> <br>

# Data Models

<https://dbdesigner.page.link/TmhBUamZbHMiXanV8>

### Users

* * *

```{
    users.increments("userID").primary();
    users.string("first_name", 255).notNullable();
    users.string("last_name", 255).notNullable();
    users
      .string("username", 255)
      .notNullable()
      .unique();
    users.string("password", 255).notNullable();
    users
      .boolean("seller")
      .defaultTo(false)
      .notNullable();
    users.string("stripe_account", 255).notNullable();
    users.string("address1", 255).notNullable();
    users.string("address2", 255).defaultTo("-");
    users.string("city", 255).notNullable();
    users.string("state", 255).notNullable();
    users.integer("zip_code").notNullable();
    users.string("country", 255).notNullable();
    users.bigint("phone");
    users.string("email", 255).notNullable();
    users.string("billing_address", 255);
    users.string("billing_city", 255);
    users.string("billing_state", 255);
    users.string("billing_zip_code", 255);
    users.string("billing_country", 255);
    users.string("shipping_address", 255);
    users.string("shipping_city", 255);
    users.string("shipping_state", 255);
    users.string("shipping_zip_code", 255);
    users.string("shipping_country", 255);
    users.timestamps(true, true);
    users.string("support_pin", 10);
}
```

### Stores

* * *

    { stores.increments("storeID").primary();
      stores.boolean("active").defaultTo(true);
      stores.string("store_name", 255).unique().notNullable();
      stores
        .string("domain_name", 255)
        .unique()
        .notNullable();
      stores.string("hero_ImageURL", 255)
        .defaultTo("https://www.dalesjewelers.com/wp-content/uploads/2018/10placeholder-silhouette-male.png")
        .notNullable();
      stores.string("logo_url", 255)
        .defaultTo("https://uxmasters.org/images/ant_logo.svg")
        .notNullable();
      stores.timestamps(true, true);
      stores.integer("userID")
        .notNullable()
        .references("userID")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

    }

### Quotes

* * *

    {
      quotes.increments("quoteID").primary();
      quotes.decimal("total", null).notNullable();
      quotes.decimal("subtotal", null).notNullable();
      quotes.decimal("tax", null).notNullable();
      quotes.decimal("fees", null).notNullable();
      quotes.decimal("shipping", null).notNullable();
      quotes.string("orderToken", 255).unique().notNullable();
      quotes.string("warnings", 255).defaultTo("-");
      quotes.string("mode", 255).notNullable().defaultTo("-");
      quotes.integer("storeID")
        .notNullable()
        .references("storeID")
        .inTable("stores")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      quotes.integer("userID")
        .notNullable()
        .references("userID")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

    }

### Orders

* * *

    {
      orders.increments("orderID").primary();
      orders.string("status", 255).notNullable();
      orders.decimal("total", null).notNullable();
      orders.decimal("subtotal", null).notNullable();
      orders.decimal("tax", null).notNullable();
      orders.decimal("fees", null).notNullable();
      orders.decimal("shipping", null).notNullable();
      orders
        .string("orderToken", 255)
        .unique()
        .notNullable();
      orders
        .string("spOrderID", 255)
        .unique()
        .notNullable();
       orders.string("mode", 255).notNullable();
      orders.timestamps(true, true);
      orders
        .integer("storeID")
        .notNullable()
        .references("storeID")
        .inTable("stores")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      orders
        .integer("userID")
        .notNullable()
        .references("userID")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    }

### Designs

* * *

    {
      designs.increments("designID").primary();
      designs.string("design_name", 255).notNullable();
      designs.string("design_url", 255).notNullable();
      designs
        .integer("storeID")
        .notNullable()
        .references("storeID")
        .inTable("stores")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      designs
        .integer("userID")
        .notNullable()
        .references("userID")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      designs.timestamps(true, true);
    }

## Actions

### Users

`insert(user)` -> inserts a new user, and Returns newly created User

`find()` -> Returns the entire User table

`findBy(username)` -> returns the user that matches the username passed in

`findById(id)` -> Returns the user that matched the userID passed in

`findByUsername(username)` -> Returns the user that matches the username passed in

`findByEmail(email)` -> Returns the user that matches the email passed in

`update(username, changes)` -> Updates a user and Returns the newly updated user that matches the username passed in.

`remove(username)` -> Deletes the user passed in and returns a success message

<br>
<br>
<br>

### Stores

`insert(store)` -> inserts a new store, and Returns newly created Store

`find()` -> Returns the entire Store table

`findById(storeID)` -> Returns the store that matched the storeID passed in

`findByStorename(store_name)` -> Returns the store that matches the store_name passed in

`findByDomainName(domain_name)` -> Returns the store that matches the domain_name passed in

`findByUserID(userID)` -> Returns the store that matches the userID passed in

`update(storeID, changes)` -> Updates a store and Returns the newly updated store that matches the storeID passed in.

`remove(store_name)` -> Deletes the user passed in and returns a success message
<br>
<br>
<br>

### Quotes

`insert(quote)` -> inserts a new quote, and Returns newly created quote

`find()` -> Returns the entire quote table

`findById(quoteID)` -> Returns the quote that matched the quoteID passed in

`findByOrderToken(orderToken)` -> Returns the quote that matches the orderToken passed in

`updateByQuoteID(quoteID, changes)` -> Updates a quote and Returns the newly updated quote that matches the quoteID passed in.

`updateByOrderToken(orderToken, changes)` -> Updates a quote and Returns the newly updated quote that matches the orderToken passed in.

`removeByQuoteId(quoteID)` -> Deletes the quote by quoteID passed in and returns a success message

`removeByOrderToken(orderToken)` -> Deletes the quote by orderToken passed in and returns a success message

<br>
<br>
<br>

### Orders

`insert(order)` -> inserts a new order, and Returns newly created order

`find()` -> Returns the entire order table

`findById(orderID)` -> Returns the order that matched the orderID passed in

`findByOrderToken(orderToken)` -> Returns the order that matches the orderToken passed in

`findBySPId(spOrderID)` -> Returns the order that matches the spOrderID passed in

`updateByOrderID(orderID, changes)` -> Updates a order and Returns the newly updated order that matches the orderID passed in.

`updateByOrderToken(orderToken, changes)` -> Updates a order and Returns the newly updated order that matches the orderToken passed in.

`updateBySpOrderID(spOrderID, changes)` -> Updates a order and Returns the newly updated order that matches the spOrderID passed in.

`removeByOrderId(orderID)` -> Deletes the order by orderID passed in and returns a success message

`removeByOrderToken(orderToken)` -> Deletes the order by orderToken passed in and returns a success message

`removeBySpOrderID(spOrderID)` -> Deletes the order by spOrderID passed in and returns a success message

<br>
<br>
<br>

### Designs

`insert(user)` -> inserts a new design, and Returns newly created design

`find()` -> Returns the entire design table

`findById(id)` -> Returns the design that matched the designID passed in

`updateByDesignId(designID, changes)` -> Updates a design and Returns the newly updated design that matches the designID passed in.

`removeByDesignId(designID)` -> Deletes the design passed in and returns a success message
<br>
<br>
<br>

