const server = require("../server");
const request = require("supertest");
const db = require("../databaseOperations/db-config");
// const Users = require("../crudOperations/userOperations/userModel");

describe("ROUTE TESTING", () => {
  beforeAll(async () => {
    return (
      await db.migrate.rollback(),
      await db.migrate.latest(),
      await db.seed.run()
    );
  });

  afterAll(async () => {
    return await db.migrate.rollback();
  });

  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  SERVER STATUS  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //
  describe("Should be in testing environment", () => {
    it("should be in testing environment", () => {
      expect(process.env.DB_ENV).toBe("testing");
    });
  });
  describe("Checking server status", () => {
    describe("Sanity check", () => {
      it("should return an OK status code from the index route", async () => {
        const expectedStatus = 200;

        const response = await request(server).get("/");

        expect(response.status).toEqual(expectedStatus);
      });
      it("should return a JSON object from the index route", async () => {
        const expectedBody = {
          status: "The Merch Dropper server is running!!",
        };

        const response = await request(server).get("/");

        expect(response.body).toEqual(expectedBody);
      });
      it("should return a JSON object from the index route", async () => {
        const response = await request(server).get("/");

        expect(response.type).toEqual("application/json");
      });
    });
  });

  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  USER ROUTES  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //

  describe("USER ROUTES", () => {
    describe("should insert provided user into the database", () => {
      it("POST /api/auth/register", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({
            first_name: "TESTUSER",
            last_name: "TESTUSER",
            username: "TESTUSER",
            password: "TESTUSER",
            stripe_account: "12345678912345678",
            address1: "7822 Test Drive",
            city: "Atlanta",
            state: "Georgia",
            zip_code: 30313,
            country: "USA",
            email: "merchdropper20@gmail.com",
          })
          .then((res) => {
            expect(res.status).toBe(201);
          });
      });
      it("insert a new user with duplicate username and throw an error", async () => {
        await request(server)
          .post("/api/auth/register")
          .send({
            first_name: "TESTUSER",
            last_name: "TESTUSER",
            username: "TESTUSER",
            password: "TESTUSER",
            stripe_account: "12345678912345678",
            address1: "7822 Test Drive",
            city: "Atlanta",
            state: "Georgia",
            zip_code: 30313,
            country: "USA",
            email: "merchdropper20@gmail.com",
          })
          .then((res) => {
            expect(res.status).toBe(500);
          });
      });
    });

    describe("should log a user into the database", () => {
      it("POST /api/auth/login", async () => {
        await request(server)
          .post("/api/auth/login")
          .send({
            username: "TESTUSER",
            password: "TESTUSER",
          })
          .then((res) => {
            expect(res.status).toBe(200);
          });
      });
      it("invalid username", async () => {
        await request(server)
          .post("/api/auth/login")
          .send({
            username: "invalid",
            password: "TESTUSER",
          })
          .then((res) => {
            expect(res.status).toBe(401);
          });
      });
      it("invalid password", async () => {
        await request(server)
          .post("/api/auth/login")
          .send({
            username: "TESTUSER",
            password: "invalid",
          })
          .then((res) => {
            expect(res.status).toBe(401);
          });
      });
    });

    describe("Gets all users", () => {
      it("GET /api/users", (done) => {
        request(server)
          .get("/api/users/")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe("Get user by id", () => {
      it("GET /api/users/1", (done) => {
        request(server)
          .get("/api/users/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a user that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/users/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a user that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/users/999")
          .then((response) => {
            const expectedBody = { message: "That user could not be found!" };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Get user by username", () => {
      it("GET /api/users/username/:username", (done) => {
        request(server)
          .get("/api/users/username/TESTUSER")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a user that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/users/username/DoesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a user that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/users/username/DoesntExist")
          .then((response) => {
            const expectedBody = { message: "That user could not be found!" };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a user by username", () => {
      it("PUT /api/users/:username", (done) => {
        request(server)
          .put("/api/users/TESTUSER")
          .send({
            first_name: "TESTUSEREDITED",
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a user that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/users/DoesntExist")
          .send({
            first_name: "TESTUSEREDITED",
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a user that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/users/DoesntExist")
          .send({
            first_name: "TESTUSEREDITED",
          })
          .then((response) => {
            const expectedBody = { message: "That user could not be found!" };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a user by username", () => {
      it("DELETE /api/users/:username", (done) => {
        request(server)
          .delete("/api/users/TESTUSER")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a user that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/users/DoesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Delete a user that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/users/DoesntExist")
          .then((response) => {
            const expectedBody = { message: "User unable to be deleted!" };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });
  });
  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  STORE ROUTES  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //
  describe("STORE ROUTES", () => {
    describe("should insert provided store into the database", () => {
      it("POST /api/stores", async () => {
        await request(server)
          .post("/api/stores")
          .send({
            // active: 1,
            store_name: "NewStoreForTest",
            domain_name: "NewStoreForTest",
            email: "merchdropper20@gmail.com",
            // hero_ImageURL:
            //   "https://www.dalesjewelers.com/wp-content/uploads/2018/10placeholder-silhouette-male.png",
            // logo_url: "https://uxmasters.org/images/ant_logo.svg",
            // userID: 1
          })
          .then((res) => {
            expect(res.status).toBe(201);
          });
      });
      it("Try to insert store without everything required", async () => {
        await request(server)
          .post("/api/stores")
          .send({
            active: 1,
            //missing store name
            hero_ImageURL:
              "https://www.dalesjewelers.com/wp-content/uploads/2018/10placeholder-silhouette-male.png",
            logo_url: "https://uxmasters.org/images/ant_logo.svg",
            userID: 1,
          })
          .then((res) => {
            expect(res.status).toBe(400);
          });
      });
    });

    describe("Gets all stores", () => {
      it("GET /api/stores", (done) => {
        request(server)
          .get("/api/stores/")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe("Get a store by id", () => {
      it("GET /api/stores/1", (done) => {
        request(server)
          .get("/api/stores/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a store that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/stores/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a store that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/stores/999")
          .then((response) => {
            const expectedBody = {
              message: "That store could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Get store by name", () => {
      it("GET /api/stores/storename/:store_name", (done) => {
        request(server)
          .get("/api/stores/storename/NewStore")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a store that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/stores/storename/DoesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a store that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/stores/storename/DoesntExist")
          .then((response) => {
            const expectedBody = {
              message:
                "Please enter a valid store name, keep in mind that store names are case sensitive",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Get store by domain_name", () => {
      it("GET /api/stores/domain/:domain_name", (done) => {
        request(server)
          .get("/api/stores/domain/TheMerchMan")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a store domain_name that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/stores/domain/ThisDomainDoesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a store domain_name that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/stores/domain/ThisDomainDoesntExist")
          .then((response) => {
            const expectedBody = {
              message:
                "Please enter a valid store domain_name, keep in mind that domain names are case sensitive",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a store by id", () => {
      it("PUT /api/stores/:id", (done) => {
        request(server)
          .put("/api/stores/1")
          .send({
            store_name: "NewStoreEDITED",
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a store that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/stores/999")
          .send({
            store_name: "NewStoreEDITED",
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a store that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/stores/999")
          .send({
            store_name: "NewStoreEDITED",
          })
          .then((response) => {
            const expectedBody = {
              message: "That store could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a store by storename", () => {
      it("DELETE /api/stores/:storename", (done) => {
        request(server)
          .delete("/api/stores/NewStore")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a store that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/stores/DoesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Delete a store that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/stores/DoesntExist")
          .then((response) => {
            const expectedBody = {
              message:
                "Please enter a valid store name, keep in mind that store names are case sensitive",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });
  });

  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  PRODUCT ROUTES  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //
  describe("PRODUCT ROUTES", () => {
    describe("should insert provided mockup and or product into the database", () => {
      it("POST /api/products/mockup", async () => {
        await request(server)
          .post("/api/products/mockup")
          .send({
            template: { name: "front" },
            product: { id: "canvas-unisex-t-shirt", color: "Sunset" },
            design: {
              type: "dtg",
              sides: {
                front: {
                  artwork:
                    "http://oo-prod.s3.amazonaws.com/public/artworks/2020/01/30/1148fc23dfe99023/original.png",
                  dimensions: { width: "10" },
                  position: { horizontal: "R", offset: { top: "2" } },
                },
              },
            },
          })
          .then((res) => {
            expect(res.status).toBe(201);
          });
      });
      it("POST /api/products", async () => {
        await request(server)
          .post("/api/products")
          .send({
            productName: "Test Product 2",
            fullSizeURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
            thumbnailURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
            price: 10.3,
            storeID: 1,
          })
          .then((res) => {
            expect(res.status).toBe(201);
          });
      });

      it("Try to insert mockup without everything required", async () => {
        await request(server)
          .post("/api/products/mockup")
          .send({
            product: { id: "canvas-unisex-t-shirt", color: "Sunset" },
            design: {
              type: "dtg",
              sides: {
                front: {
                  artwork:
                    "http://oo-prod.s3.amazonaws.com/public/artworks/2020/01/30/1148fc23dfe99023/original.png",
                  dimensions: { width: "10" },
                  position: { horizontal: "R", offset: { top: "2" } },
                },
              },
            },
          })
          .then((res) => {
            expect(res.status).toBe(500);
          });
      });
      it("Try to insert product without everything required", async () => {
        await request(server)
          .post("/api/products")
          .send({
            fullSizeURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
            thumbnailURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
            price: 10.3,
            storeID: 1,
          })
          .then((res) => {
            expect(res.status).toBe(500);
          });
      });
    });

    describe("Gets all products", () => {
      it("GET /api/products", (done) => {
        request(server)
          .get("/api/products/")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe("Get a product by id", () => {
      it("GET /api/products/1", (done) => {
        request(server)
          .get("/api/products/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a product that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/products/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a product that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/products/999")
          .then((response) => {
            const expectedBody = {
              message: "That product could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a product by id", () => {
      it("PUT /api/products/:id", (done) => {
        request(server)
          .put("/api/products/1")
          .send({
            productName: "Edited Test Product",
            fullSizeURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
            thumbnailURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
            price: 10.3,
            storeID: 1,
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a product that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/products/999")
          .send({
            productName: "Edited Test Product",
            fullSizeURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
            thumbnailURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
            price: 10.3,
            storeID: 1,
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a product that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/products/999")
          .send({
            productName: "Edited Test Product",
            fullSizeURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581453585/wsjikfpellbybgzbymy2.jpg",
            thumbnailURL:
              "https://res.cloudinary.com/dze74ofbf/image/upload/v1581454280/eiz7lg8c8mtosndddelk.jpg",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ornare arcu vulputate arcu suscipit venenatis. Donec sit amet ipsum ac urna dignissim euismod a euismod nisi. Nullam pulvinar odio semper.",
            price: 10.3,
            storeID: 1,
          })
          .then((response) => {
            const expectedBody = {
              message: "That product could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a product by id", () => {
      it("DELETE /api/products/:id", (done) => {
        request(server)
          .delete("/api/products/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a product that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/products/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Delete a product that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/products/999")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that product ID",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });
  });

  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  DESIGN ROUTES  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //
  describe("DESIGN ROUTES", () => {
    describe("should insert provided design into the database", () => {
      it("POST /api/designs", async () => {
        await request(server)
          .post("/api/designs")
          .send({
            design_name: "newDesign",
            design_url: "https://uxmasters.org/images/ant_logo.svg",
            thumbnail_url: "https://uxmasters.org/images/ant_logo.svg",
            storeID: 1,
            userID: 1,
          })
          .then((res) => {
            expect(res.status).toBe(201);
          });
      });
      it("Try to insert store without everything required", async () => {
        await request(server)
          .post("/api/stores")
          .send({
            design_url: "https://uxmasters.org/images/ant_logo.svg",
            thumbnail_url: "https://uxmasters.org/images/ant_logo.svg",
            storeID: 1,
            userID: 1,
          })
          .then((res) => {
            expect(res.status).toBe(400);
          });
      });
    });

    describe("Gets all designs", () => {
      it("GET /api/designs", (done) => {
        request(server)
          .get("/api/designs/")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe("Get a design by id", () => {
      it("GET /api/designs/:designID", (done) => {
        request(server)
          .get("/api/designs/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a design that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/designs/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a design that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/designs/999")
          .then((response) => {
            const expectedBody = {
              message: "Unable to find this design, double check the id",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a design by id", () => {
      it("PUT /api/designs/:id", (done) => {
        request(server)
          .put("/api/designs/1")
          .send({
            design_name: "EDITED",
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a design that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/designs/999")
          .send({
            design_name: "EDITED",
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a design that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/designs/999")
          .send({
            design_name: "EDITED",
          })
          .then((response) => {
            const expectedBody = {
              message: "That design could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a design by id", () => {
      it("DELETE /api/designs/:id", (done) => {
        request(server)
          .delete("/api/designs/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a design that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/designs/999")
          .then((response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
      it("Delete a design that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/designs/DoesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that design ID",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });
  });

  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  QUOTE ROUTES  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //
  describe("QUOTE ROUTES", () => {
    describe("should insert provided quote into the database", () => {
      it("POST /api/quotes", async () => {
        await request(server)
          .post("/api/quotes")
          .send({
            quoteInfo: {
              storeID: 1,
              userID: 1,
            },
            spInfo: {
              type: "dtg",
              designId: "5e442687dd2846373f24d9cd",
              products: [
                {
                  id: "canvas-unisex-t-shirt",
                  color: "Sunset",
                  quantity: 1,
                  size: "sml",
                },
                {
                  id: "canvas-unisex-t-shirt",
                  color: "Sunset",
                  quantity: 1,
                  size: "lrg",
                },
              ],
              address: {
                name: "Jennie",
                address1: "1234 street",
                city: "San Diego",
                state: "California",
                zip: "92126",
                country: "USA",
              },
            },
          })
          .then((res) => {
            expect(res.status).toBe(201);
          });
      });
    });

    describe("Gets all quotes", () => {
      it("GET /api/quotes", (done) => {
        request(server)
          .get("/api/quotes/")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe("Get a quote by id", () => {
      it("GET /api/quotes/:quoteID", (done) => {
        request(server)
          .get("/api/quotes/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a quote that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/quotes/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a quote that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/quotes/999")
          .then((response) => {
            const expectedBody = {
              message: "Unable to find this quote, double check the id",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a quote by id", () => {
      it("PUT /api/quotes/:id", (done) => {
        request(server)
          .put("/api/quotes/1")
          .send({
            orderToken: "EditedQuoteTOKEN",
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a quote that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/quotes/999")
          .send({
            orderToken: "EditedQuoteTOKEN",
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a quote that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/quotes/999")
          .send({
            orderToken: "EditedQuoteTOKEN",
          })
          .then((response) => {
            const expectedBody = {
              message: "That quote could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a quote by order token", () => {
      it("PUT /api/quotes/ordertokenedit/:orderToken", (done) => {
        request(server)
          .put("/api/quotes/ordertokenedit/EditedQuoteTOKEN")
          .send({
            total: 500500.21,
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a quote that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/quotes/ordertokenedit/doesntExist")
          .send({
            total: 500500500.21,
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a quote that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/quotes/ordertokenedit/doesntExist")
          .send({
            total: 500500500.21,
          })
          .then((response) => {
            const expectedBody = {
              message: "That quote could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a quote by id", () => {
      it("DELETE /api/quotes/:id", (done) => {
        request(server)
          .delete("/api/quotes/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a quote that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/quotes/999")
          .then((response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
      it("Delete a quote that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/quotes/DoesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that quote ID",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a quote by order token", () => {
      it("DELETE /api/orders/ordertoken/:orderToken", (done) => {
        request(server)
          .delete("/api/quotes/ordertoken/TESTTOKEN")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a quote that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/quotes/ordertoken/doesntExist")
          .then((response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
      it("Delete a quote that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/quotes/ordertoken/doesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that quote by given quote token",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });
  });

  //   vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  ORDER ROUTES  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv   //

  describe("ORDER ROUTES", () => {
    //figure out how to test the post for order, the order ordertoken comes from quote router when a quote is submitted, will have to be grabbed from mock quote created in test

    describe("Gets all orders", () => {
      it("GET /api/orders", (done) => {
        request(server)
          .get("/api/orders/")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
    });

    describe("Get a order by id", () => {
      it("GET /api/orders/:orderID", (done) => {
        request(server)
          .get("/api/orders/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a order that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/orders/999")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a order that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/orders/999")
          .then((response) => {
            const expectedBody = {
              message: "Unable to find this order, double check the id",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Get a order by order token", () => {
      it(" GET /api/orders/ordertoken/:orderToken", (done) => {
        request(server)
          .get("/api/orders/ordertoken/70192HJALKANOIAMNL")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a order that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/orders/ordertoken/doesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a order that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/orders/ordertoken/doesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Unable to find this order, double check the id",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Get a order by SP Order ID", () => {
      it("GET /api/orders/sporderid/:spOrderID", (done) => {
        request(server)
          .get("/api/orders/sporderid/testsporderid")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Get a order that doesn't exist - status check", (done) => {
        request(server)
          .get("/api/orders/sporderid/doesntExist")
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Get a order that doesn't exist - message check", (done) => {
        request(server)
          .get("/api/orders/sporderid/doesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Unable to find this order, double check the id",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a order by id", () => {
      it("PUT /api/orders/:id", (done) => {
        request(server)
          .put("/api/orders/1")
          .send({
            orderToken: "EditedorderTOKEN",
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a order that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/orders/999")
          .send({
            orderToken: "EditedorderTOKEN",
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a order that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/orders/999")
          .send({
            orderToken: "EditedorderTOKEN",
          })
          .then((response) => {
            const expectedBody = {
              message: "That order could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a order by order token", () => {
      it("PUT /api/orders/ordertoken/:orderToken", (done) => {
        request(server)
          .put("/api/orders/ordertoken/EditedorderTOKEN")
          .send({
            total: 500500.21,
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a order that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/orders/ordertoken/doesntExist")
          .send({
            total: 500500500.21,
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a order that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/orders/ordertoken/doesntExist")
          .send({
            total: 500500500.21,
          })
          .then((response) => {
            const expectedBody = {
              message: "That order could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Edit a order by SP order ID", () => {
      it("PUT /api/orders/sporderid/:spOrderID", (done) => {
        request(server)
          .put("/api/orders/sporderid/testsporderid")
          .send({
            total: 500500.21,
          })
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Edit a order that doesn't exist - status check", (done) => {
        request(server)
          .put("/api/orders/sporderid/doesntExist")
          .send({
            total: 500500500.21,
          })
          .then((response) => {
            expect(response.status).toBe(404);

            done();
          });
      });
      it("Edit a order that doesn't exist - message check", (done) => {
        request(server)
          .put("/api/orders/sporderid/doesntExist")
          .send({
            total: 500500500.21,
          })
          .then((response) => {
            const expectedBody = {
              message: "That order could not be found!",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a order by id", () => {
      it("DELETE /api/orders/:id", (done) => {
        request(server)
          .delete("/api/orders/1")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a order that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/orders/999")
          .then((response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
      it("Delete a order that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/orders/DoesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that order ID",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a quote by order token", () => {
      it("DELETE /api/orders/ordertoken/:orderToken", (done) => {
        request(server)
          .delete("/api/orders/ordertoken/testtoken")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a quote that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/orders/ordertoken/doesntExist")
          .then((response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
      it("Delete a quote that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/orders/ordertoken/doesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that order token",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });

    describe("Delete a quote by SP order ID", () => {
      it("DELETE /api/stores/sporderid/:spOrderID", (done) => {
        request(server)
          .delete("/api/orders/sporderid/testsporderid2")
          .then((response) => {
            expect(response.status).toBe(200);
            done();
          });
      });
      it("Delete a quote that doesn't exist - status check", (done) => {
        request(server)
          .delete("/api/orders/sporderid/doesntExist")
          .then((response) => {
            expect(response.status).toBe(404);
            done();
          });
      });
      it("Delete a quote that doesn't exist - message check", (done) => {
        request(server)
          .delete("/api/orders/sporderid/doesntExist")
          .then((response) => {
            const expectedBody = {
              message: "Could not find that Scalable press order ID",
            };
            expect(response.body).toEqual(expectedBody);

            done();
          });
      });
    });
  });
});
