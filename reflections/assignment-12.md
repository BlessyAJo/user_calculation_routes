# Reflection – FastAPI User Calculation API Project

This project was one of the most practical and challenging backend experiences I have worked on so far. It helped me understand that building APIs is not just about writing endpoints, but about making sure the entire system — database, backend logic, environment setup, and testing — all work together correctly.

At the beginning, I assumed most of the work would be focused on implementing API routes and business logic. However, I quickly realized that many of the issues came from environment configuration and integration between different services. One of the first major challenges I faced was connecting FastAPI with PostgreSQL using Docker. I repeatedly ran into errors related to database connectivity, especially because of incorrect host configuration like using `localhost` instead of the Docker service name `db`.

Another major learning experience was dealing with database setup issues. At one point, my application kept failing with errors such as missing tables. I learned that even if the database connection is correct, the application will fail if the schema is not initialized properly. Fixing this helped me understand how SQLAlchemy’s `Base.metadata.create_all()` works and how important it is to ensure models are correctly registered.

Authentication was another area where I faced challenges. I encountered issues with bcrypt and passlib version compatibility, which caused unexpected runtime errors. Debugging this taught me how sensitive security libraries are to dependency versions and how important it is to maintain consistent requirements across environments.

Testing also became a significant part of my learning. Initially, my pytest cases were failing due to mismatched database configurations between local and Docker environments. I learned the importance of using environment variables instead of hardcoding values like database URLs. Once I standardized the configuration, the tests started passing both locally and inside Docker.

One of the most important lessons I learned was how to debug systematically. Instead of assuming the issue was in the API logic, I had to carefully analyze logs, isolate the problem layer by layer (Docker → database → ORM → API), and fix issues step by step. This approach helped me resolve complex errors like SQLAlchemy connection failures, table-related issues, and request handling errors.

By the end of the project, I was able to successfully:
- Run the application using Docker Compose
- Connect FastAPI with PostgreSQL correctly
- Fix authentication and bcrypt issues
- Resolve database schema and ORM-related errors
- Ensure all pytest cases pass in both local and Docker environments
- Successfully test all API endpoints through Swagger UI

Overall, this project gave me a much deeper understanding of backend development in real-world scenarios. I learned how different components interact, how small configuration mistakes can break the entire system, and how important proper debugging practices are.

If I were to improve this project further, I would focus on:
- Adding better centralized error handling
- Improving test coverage and test isolation
- Enhancing logging for easier debugging
- Structuring configuration more cleanly for different environments (development, testing, production)

This project significantly improved my confidence in building and debugging full-stack backend systems.