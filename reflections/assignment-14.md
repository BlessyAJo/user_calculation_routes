📄 Module 14 Reflection 

This project focused on building a full-stack application using FastAPI, implementing BREAD (Browse, Read, Edit, Add, Delete) operations for calculations, integrating a frontend interface, and validating functionality through automated testing and CI/CD. Overall, it provided practical experience in backend development, frontend integration, testing, and deployment.

One of the key aspects of the project was implementing RESTful BREAD endpoints. This helped reinforce how different HTTP methods (GET, POST, PUT, DELETE) are used to manage resources. I also worked with user-specific data, which required implementing authentication using JWT tokens. During this process, I encountered issues where unauthorized requests returned a **403 Forbidden** status instead of **401 Unauthorized**, and I had to adjust my tests accordingly. This improved my understanding of how authentication and authorization are handled in real-world applications.

On the frontend side, I created forms to interact with the backend APIs and implemented client-side validations such as required fields, numeric checks, and division-by-zero prevention. I also improved the user experience by adding features like a modal for editing calculations and a cleaner UI layout. Handling asynchronous API calls and updating the UI dynamically helped me better understand frontend-backend communication.

Testing was a major part of this project. Using Pytest, I wrote integration tests for all endpoints and covered various edge cases, including invalid inputs, division by zero, float precision, and non-existent resources. Initially, many tests failed due to missing authentication tokens, which resulted in 403 errors. I resolved this by creating reusable fixtures that generated valid access tokens, making the tests more reliable and reusable.

End-to-end testing with Playwright was more challenging. I faced issues related to timing (elements not being loaded yet), test flakiness, and dependency on existing data. For example, edit and delete tests failed because no calculations existed at runtime. I fixed this by ensuring each test creates its own data before performing operations. I also added proper waits and improved selectors to make tests stable. Another issue was browser-level form validation interfering with custom validation messages, which required adjustments in both tests and UI behavior.

Setting up GitHub Actions for CI/CD was another important learning experience. I configured the pipeline to run backend tests, start services like PostgreSQL and FastAPI, serve the frontend, and execute Playwright tests. Some challenges included services not being ready in time and background processes failing silently. These were resolved by adding wait steps, using background-safe commands, and enabling retries for Playwright tests.

Finally, I containerized the application using Docker and pushed images to Docker Hub with version tags. This helped me understand how to package and deploy applications consistently.

In conclusion, this project strengthened my skills in API development, frontend integration, automated testing, and CI/CD workflows. The debugging process, especially around authentication and test stability, was the most valuable part of the experience, as it reflects real-world software development challenges.
