## 📄 Reflection Report – User Calculation API Project
### Overview

This project was a full-stack application built using FastAPI, PostgreSQL, and a simple HTML/JavaScript frontend. It evolved over multiple modules, starting from basic backend calculations and gradually expanding into a complete system with authentication, profile management, automated testing, and CI/CD deployment using Docker and GitHub Actions.

By the end, the system supported user registration, login, JWT authentication, profile updates, password changes, calculation features, and full test coverage across unit, integration, and end-to-end levels.

### What I Learned

At the beginning of this project, I mainly focused on making the backend work. I understood individual concepts like routes and database models, but I did not fully see how everything connects in a real application.

As I progressed, I started to understand how important system design is. For example, implementing JWT authentication helped me understand how stateless login sessions actually work. Before this, I assumed login simply “stayed active,” but now I understand how tokens are stored and validated on every request.

Working with password hashing also changed my understanding of security. I used to think password storage was just a database concern, but I learned that proper hashing (like bcrypt) is essential to protect user data.

### Challenges Faced

One of the biggest challenges was debugging failures across different layers of the system. Sometimes tests would fail, but the issue was not in the test itself—it was in how the backend returned errors or how the frontend displayed them.

A major issue I faced was inconsistent validation messages. For example, tests expecting specific error messages like “email already exists” would fail because the backend returned a different message or status code. This forced me to carefully align backend validation logic with frontend expectations.

Another challenge was end-to-end testing with Playwright. Initially, my tests were flaky and inconsistent because the frontend was not fully loaded before assertions ran. I had to learn how to properly use waits and selectors to stabilize the tests.

I also struggled with authentication state in the browser, especially handling token storage and ensuring users were correctly logged out after password changes.

### Improvements Made

As I fixed issues, I gradually improved the system in several ways:

- I strengthened backend validation for duplicate emails and usernames
- I standardized error handling across API responses
- I improved frontend feedback so users could clearly see validation errors
- I stabilized Playwright tests by fixing timing issues and improving reliability
- I expanded test coverage across unit, integration, and E2E levels
- I improved CI/CD so that backend, frontend, and tests run automatically

Each improvement made the system more stable and closer to a production-style application.

### Key Takeaways

This project taught me that building software is not just about writing code that works, but about making sure every part of the system works together reliably.

I learned the importance of:

- Writing tests early and continuously
- Keeping backend and frontend consistent
- Handling errors properly instead of ignoring edge cases
- Debugging systematically across layers
- Using automation (CI/CD) to ensure stability

Most importantly, I learned that real-world development is iterative—bugs, improvements, and refactoring are a normal part of the process.

### Conclusion

Overall, this project helped me grow significantly in full-stack development. I gained practical experience in backend design, frontend integration, authentication systems, testing strategies, and deployment workflows. It also improved my debugging skills and my understanding of how real applications are structured and maintained.