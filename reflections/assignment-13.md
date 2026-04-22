📄 Module 13 Reflection – JWT Authentication & E2E Testing

In Module 13, I implemented a full authentication system using FastAPI and JWT tokens, along with end-to-end testing using Playwright. This module helped me understand how backend authentication, frontend behavior, and automated testing all work together in a real-world application.

On the backend, I built registration and login routes. During registration, I validated user input, checked for duplicate users, and hashed passwords before storing them in the database. For login, I verified credentials and returned a JWT token when authentication was successful. I also handled errors properly, such as returning a 401 status code for invalid login attempts.

On the frontend, I created simple login and registration pages using HTML and JavaScript. I added basic client-side validation for email format and password length, and displayed messages based on API responses. One challenge I faced was ensuring that UI messages updated correctly after asynchronous API calls, especially when handling errors and timing issues.

I also wrote Playwright tests to simulate real user behavior. These tests covered both successful and failing cases, such as valid registration and login, as well as invalid inputs like short passwords and incorrect credentials. At first, I had issues where UI messages were not appearing in time for the tests, but I resolved this by improving waits and ensuring proper DOM updates.

Overall, this module helped me better understand JWT authentication, full-stack communication, and the importance of testing across the entire application. I also became more confident in debugging issues between backend logic, frontend updates, and automated tests.