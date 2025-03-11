const request = require("supertest");
const http = require("http");
const { getAllBooks } = require("../controllers");
const { app } = require("../index.js");

jest.mock("../controllers", () => ({
  ...jest.requireActual("../controllers"),
  getAllBooks: jest.fn(),
}));

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3002);
});

afterAll(async () => {
  server.close();
});

describe("Controllers Function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return all employees", () => {
    let mockbooks = [
      {
        bookId: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
      },
      {
        bookId: 2,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
      },
      {
        bookId: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
      },
    ];
    getAllBooks.mockReturnValue(mockbooks);
    let result = getAllBooks();
    expect(result).toEqual(mockbooks);
    expect(result.length).toBe(3);
  });
});

describe("API Endpoints test", () => {
  it(" GET /books should get all books", async () => {
    const res = await request(server).get("/books");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      books: [
        {
          bookId: 1,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Fiction",
        },
        {
          bookId: 2,
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian",
        },
        {
          bookId: 3,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic",
        },
      ],
    });
    expect(res.body.books.length).toBe(3);
  });

  it("GET /books/details/:id should get an books by ID", async () => {
    const res = await request(server).get("/books/details/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      book: {
        bookId: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
      },
    });
  });
});
