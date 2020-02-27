const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeArticlesArray } = require("./articles.fixtures");

describe.only("Articles Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    // Because we skip over the server.js when we are running tests, we have to set the knex instance
    // since we use req.app.get('db') in our app.js and it won't work otherwise
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("blogful_articles").truncate());

  afterEach("cleanup", () => db("blogful_articles").truncate());

  describe("GET /articles", () => {
    context(`Given no articles`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/articles")
          .expect(200, []);
      });
    });
    context("Given there are articles in the database", () => {
      const testArticles = makeArticlesArray();

      beforeEach("insert articles", () => {
        return db.into("blogful_articles").insert(testArticles);
      });

      // BROKEN DATES TEST
      it("GET /articles responds with 200 and all of the articles", () => {
        return (
          supertest(app)
            .get("/articles")
            // we can pass in the response body that we expect as the second argument in the expect with supertest
            .expect(200, testArticles)
        );
      });
    });
  });

  describe(`GET /articles/:article_id`, () => {
    context(`Given no articles`, () => {
      it(`responds with 404`, () => {
        const articleId = 123456;
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(404, { error: { message: `Article doesn't exist` } });
      });
    });
    context("Given there are articles in the database", () => {
      const testArticles = makeArticlesArray();

      beforeEach("insert articles", () => {
        return db.into("blogful_articles").insert(testArticles);
      });

      it("responds with 200 and the specified article", () => {
        const articleId = 2;
        const expectedArticle = testArticles[articleId - 1];
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(200, expectedArticle);
      });
    });
  });
});
