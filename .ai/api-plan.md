# REST API Plan

## 1. Resources

- **Users**

  - Database Table: `users`
  - Description: Represents application users. Managed mainly by Supabase Auth. Contains encrypted passwords and timestamps.

- **Flashcards**

  - Database Table: `flashcards`
  - Description: Stores flashcards created manually or accepted from AI-generated candidates. Fields include `id`, `front`, `back`, `source` (must be one of 'ai-full', 'ai-edited', 'manual'), `generation_id`, `updated_at`, `created_at`, `user_id`

- **Generations**

  - Database Table: `generations`
  - Description: Logs generation operations initiated by the user when generating flashcard candidates via AI. Fields include `id`, `model`, `generated_count`, `source_text_hash`, `source_text_length`, `generation_duration`

- **Generation Error Logs**
  - Database Table: `generation_error_logs`
  - Description: Captures errors during the AI generation process. Contains model info, error codes, messages, and timestamps.

## 2. Endpoints

### A. Flashcards

- **GET /api/flashcards**

  **Description**: Retrieves a paginated, filtered, and sortable list of flashcards for the authenticated user.
  **Query Parameters**:
    - `page` (integer, default: 1)
    - `limit` (integer, default: 10)
    - `sort` (e.g. `created_at`)
    - `order` (`asc` or `desc`)
    - Optional filters (e.g., `source`, `generation_id`)
  **Response**:
    ```json
    {
      "data": [
        { "id": 1, "front": "...", "back": "...", "source": "manual", "created_at": "...", "updated_at": "..." },
        ...
      ],
      "pagination": { "page": 1, "limit": 10, "total": 100 }
    }
    ```
  **Success Code**: 200 OK
  **Errors**: 401 Unauthorized if not authenticated.

- **POST /api/flashcards**

  **Description**: Creates one or more flashcards. This endpoint serves both for manual flashcard creation and for saving accepted AI-generated flashcards.
  **Request Payload**:
    ```json
    {
      "flashcards": [
        {
          "front": "Question 1",
          "back": "Answer 1",
          "source": "manual",
          "generation_id": null
        },
        {
          "front": "Question 2",
          "back": "Answer 2",
          "source": "ai-full",
          "generation_id": 123
        }
      ]
    }
    ```
  **Response**:
    ```json
    {
      "flashcards": [
        { "id": 1, "front": "Question 1", "back": "Answer 1", "source": "manual", "generation_id": null },
        { "id": 2, "front": "Question 2", "back": "Answer 2", "source": "ai-full", "generation_id": 123 }
      ]
    }
    ```
**Validations**:
  - `front` maximum length: 200 characters.
  - `back` maximum length: 500 characters.
  - `source` Must be one of `ai-full`, `ai_edited`, or `manual`
  - `generation_id` Required for `ai-full` and `ai-edited` sources, must be null for `manual` source.

**Success Code**: 201 Created with list of createad flashcards.
**Errors**: 
    - 400 Bad Request for invalid inputs, including validation errors for any flashcard in the array.
    - 401 Unauthorized

- **GET /api/flashcards/{id}**

  **Description**: Retrieves detailed information of a specific flashcard owned by the user.
  **Response**:
    ```json
    {
      "id": 1,
      "front": "...",
      "back": "...",
      "source": "...",
      "generation_id": null,
      "created_at": "...",
      "updated_at": "..."
    }
    ```
  **Success Code**: 200 OK
  **Errors**: 404 Not Found if flashcard does not exist or does not belong to the user, 401 Unauthorized.

- **PUT /api/flashcards/{id}**

  **Description**: Updates an existing flashcard. Used for editing flashcards (both manual and AI-candidate accepted).
  **Request Payload**:
    ```json
    {
      "front": "Updated question text",
      "back": "Updated answer text"
    }
    ```
  **Validations**:
    - `front` maximum length: 200 characters.
    - `back` maximum length: 500 characters.
    - `source` Must be one of `ai-edited` or `manual`  
  **Response**:
    - 200 OK with updated flashcard object.
    - Errors: 400 Bad Request, 404 Not Found, 401 Unauthorized.

- **DELETE /api/flashcards/{id}**
  - Description: Deletes a flashcard.
  - Response:
    - 204 No Content on success.
    - Errors: 404 Not Found, 401 Unauthorized.

### B. AI Generation and Review

- **POST /api/generations**

  **Description**: Submits a long text (1000 to 10000 characters) for AI-based flashcard generation. The endpoint calls the external AI service (via Openrouter.ai) to generate proposals flashcards.
  **Request Payload**:
    ```json
    {
      "source_text": "Long text input for flashcard generation"
    }
    ```
  **Validation**: The source_text length must be within 1000 to 10000 characters.
  **Business Logic**:
    - Validate that `source_text` length is between 1000 and 10000 characters.
    - Call the AI service to generate flashcards proposals.
    - Store the genration metadata and return generated flashcards proposals to the user.
  **Response**:
    ```json
    {
      "generation_id": 123,
      "flashcards_proposals": [
        { "front": "Generated Question", "back": "Generated Answer","source": "ai-full" },
        ...
      ],
      "generated_count": 5
    }
    ```
  **Success Code**: 201 Created
  **Errors**: 400 Bad Request for validation errors, 401 Unauthorized, 500 AI service errors (logs recorded in `generation_error_logs`)


- **GET /api/generations**

  **Description**: Retrieve a list of generation requests for the authenticated user.
  **Query Parameters**: Supports pagination as needed.
  **Reponse**: List of generation objects with metadata
  **Success Code**: 200 OK
  **Errors**: 404 Not Found, 401 Unauthorized.

- **GET /api/generations/{id}**

  **Description**: Retrieves details of a specific generation, including generated flashcards proposals and metadata.
  **Response**:
    ```json
    {
      "generation_id": 123,
      "user_id": "...",
      "model": "GPT-Variant",
      "generated_count": 5,
      "accepted_unedited_count": 0,
      "accepted_edited_count": 0,
      "flashcards_proposals": [{ "front": "Candidate question", "back": "Candidate answer" }],
      "created_at": "...",
      "updated_at": "..."
    }
    ```
  **Success Code**: 200 OK
  **Errors**: 404 Not Found, 401 Unauthorized.

### C. Generation Error Logs (Optional / Admin)

- **GET /api/generation-error-logs**
  **Description**: Retrieves a list of error logs related to AI generation attempts. Limited to admin users.
  **Query Parameters**: Pagination parameters may be included.
  **Response**:
    ```json
    {
      "data": [
        { "model": "GPT-Variant", "error_code": "XYZ", "error_message": "Detailed error description", "created_at": "..." },
        ...
      ]
    }
    ```
  **Success Code**: 200 OK
  **Errors**: 401 Unauthorized if not an admin, 403 Forbidden if access is denied.

## 3. Authentication and Authorization

- The API uses JWT-based authentication. Clients must include the token in the `Authorization` header (e.g. `Bearer <token>`).
- Endpoints (except for `/api/auth/*`) require a valid token. The token is used to associate the request with a user and ensure users only access their own resources.
- Role-based access may be enforced for admin endpoints like generation error logs.

## 4. Validation and Business Logic

- **Flashcards Validation:**

  - `front`: Maximum length of 200 characters.
  - `back`: Maximum length of 500 characters.
  - `source`: Must be one of 'ai-full', 'ai-edited', or 'manual'.

- **Generation Validation:**

  - The input text (`source_text`) must contain between 1000 and 10000 characters.
  - `source_text_hash` computed for duplicate detection

- **Business Logic Mapping:**
  - _AI Generation Process:_ Initiated via `POST /api/generations`. This endpoint interacts with an external AI service to generate flashcards proposals, but does not persist them until review.
  - _Manual Creation:_ Directly created via `POST /api/flashcards`, bypassing the generation step.
  - _Data Integrity and Ownership:_ Users only see and modify their own flashcards and generation records. Database indices (e.g., on `user_id`) are leveraged for performance.

- **Business Logic Implementations**:
  - Validate inputs and call the AI service upon POST '/api/generations'.
  - Record generation metadata (model, generated_count, duration) and persist generated flashcards.
  - Log any errors in `generation_error_logs` for auditing and debugging.
## 5. Additional Considerations

- **HTTP Methods:** Use GET for retrieval, POST for creation, PUT for updates, and DELETE for removals.
- **Pagination and Filtering:** Endpoints returning lists (e.g., flashcards, error logs) support query parameters for pagination, filtering and search.
- **Error Handling:** Clear error messages and appropriate HTTP status codes (e.g., 400, 401, 404, 500) are returned on failures.
- **Security:** Implement rate limiting, input sanitization, and logging to prevent abuse and facilitate debugging.
- **Performance:** The design leverages database indices and minimal payload responses to optimize the API's performance.
