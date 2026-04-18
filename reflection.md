# 🧠 Reflection

## Overview

In this assignment, I built a FastAPI backend with user authentication and calculation CRUD operations. I integrated it with PostgreSQL, added integration tests using pytest, and set up a CI/CD pipeline with Docker and GitHub Actions.

---

## Challenges I Faced

* **Understanding 400 vs 422 errors:** At first, I was confused why some invalid inputs returned 422 instead of 400. Through testing, I realized FastAPI handles validation automatically, and 400 should be used only for custom logic like division by zero.

* **Database connection issues:** I ran into “connection refused” errors when setting up PostgreSQL with Docker. It took some trial and error to get the containers running correctly and match the database URLs.

* **Test setup and isolation:** Initially, my tests were affecting real data. I learned how to use a separate test database and override dependencies in pytest, which made tests more reliable.

* **Pydantic behavior:** I didn’t expect inputs like `"10"` to be accepted as valid floats. This changed how I wrote my test cases and helped me better understand data validation in FastAPI.

---

## What I Learned

* How to structure a FastAPI project cleanly using models, schemas, and routes
* Writing integration tests and using parametrization to cover edge cases
* Applying the Factory Pattern to separate calculation logic from routes
* Setting up Docker and automating workflows with GitHub Actions

---

## What I Would Improve

* Add proper authentication using JWT instead of a simple token
* Link calculations to specific users
* Improve logging and error handling

---

## Conclusion

This assignment gave me a clear understanding of how backend systems are built and tested. It was challenging at times, especially debugging setup issues, but it helped me become more confident working with FastAPI and backend development overall.

---
