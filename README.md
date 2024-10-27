# Postman to OpenAPI Converter

A web-based tool that converts Postman Collections (v2.x) to OpenAPI 3.0 Specifications. Built with Next.js, TypeScript, and Tailwind CSS.

![Postman to OpenAPI Converter](/Display-image.png)

## Features

- 🔄 Convert Postman Collections to OpenAPI 3.0 Specifications
- 📝 Support for both YAML and JSON output formats
- 📋 One-click copy functionality
- 🎨 Clean and responsive UI
- ⚡ Real-time conversion
- 🛠️ Handles complex Postman collection structures
- 🔍 Detailed error reporting
- 💼 Preserves request metadata (descriptions, examples, etc.)

## Supported Conversions

- ✅ Basic request details (URL, method, description)
- ✅ Query parameters
- ✅ Path parameters
- ✅ Headers
- ✅ Request bodies (raw JSON and form-data)
- ✅ Collection folder structure (converted to tags)
- ✅ Authentication schemes (Basic and Digest)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/postman-openapi-converter.git
cd postman-openapi-converter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

## Usage

1. **Prepare Your Postman Collection**
   - Export your Postman Collection (Collection v2.x format)
   - Copy the JSON content

2. **Convert the Collection**
   - Paste the Postman Collection JSON into the left textarea
   - Click the "Convert" button
   - Select your preferred output format (YAML or JSON)

3. **Use the Result**
   - Copy the converted OpenAPI specification using the copy button
   - Use the specification in your OpenAPI tools

## Example

Input (Postman Collection):
```json
{
  "info": {
    "name": "Simple Users API",
    "description": "A basic API collection for managing users",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      },
      "response": [
        {
          "name": "Success Response",
          "originalRequest": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users"]
            }
          },
          "status": "OK",
          "code": 200,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"success\",\n    \"data\": [\n        {\n            \"id\": 1,\n            \"name\": \"John Doe\",\n            \"email\": \"john@example.com\",\n            \"age\": 30,\n            \"createdAt\": \"2024-01-01T00:00:00Z\"\n        },\n        {\n            \"id\": 2,\n            \"name\": \"Jane Smith\",\n            \"email\": \"jane@example.com\",\n            \"age\": 25,\n            \"createdAt\": \"2024-01-02T00:00:00Z\"\n        }\n    ]\n}"
        }
      ]
    },
    {
      "name": "Get User by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/1",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "1"]
        }
      },
      "response": [
        {
          "name": "Success Response",
          "originalRequest": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/users/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "1"]
            }
          },
          "status": "OK",
          "code": 200,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"success\",\n    \"data\": {\n        \"id\": 1,\n        \"name\": \"John Doe\",\n        \"email\": \"john@example.com\",\n        \"age\": 30,\n        \"createdAt\": \"2024-01-01T00:00:00Z\"\n    }\n}"
        },
        {
          "name": "User Not Found",
          "originalRequest": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/users/999",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "999"]
            }
          },
          "status": "Not Found",
          "code": 404,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"error\",\n    \"message\": \"User not found\"\n}"
        }
      ]
    },
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"name\": \"John Doe\",\n    \"email\": \"john@example.com\",\n    \"age\": 30\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        },
        "description": "Create a new user with the provided information."
      },
      "response": [
        {
          "name": "Success Response",
          "originalRequest": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"John Doe\",\n    \"email\": \"john@example.com\",\n    \"age\": 30\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users"]
            }
          },
          "status": "Created",
          "code": 201,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"success\",\n    \"data\": {\n        \"id\": 1,\n        \"name\": \"John Doe\",\n        \"email\": \"john@example.com\",\n        \"age\": 30,\n        \"createdAt\": \"2024-01-01T00:00:00Z\"\n    }\n}"
        },
        {
          "name": "Validation Error",
          "originalRequest": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"\",\n    \"email\": \"invalid-email\",\n    \"age\": -1\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users"]
            }
          },
          "status": "Bad Request",
          "code": 400,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"error\",\n    \"errors\": {\n        \"name\": \"Name is required\",\n        \"email\": \"Invalid email format\",\n        \"age\": \"Age must be a positive number\"\n    }\n}"
        }
      ]
    },
    {
      "name": "Update User",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"name\": \"John Doe Updated\",\n    \"email\": \"john.updated@example.com\",\n    \"age\": 31\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/1",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "1"]
        },
        "description": "Update an existing user's information."
      },
      "response": [
        {
          "name": "Success Response",
          "originalRequest": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"John Doe Updated\",\n    \"email\": \"john.updated@example.com\",\n    \"age\": 31\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "1"]
            }
          },
          "status": "OK",
          "code": 200,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"success\",\n    \"data\": {\n        \"id\": 1,\n        \"name\": \"John Doe Updated\",\n        \"email\": \"john.updated@example.com\",\n        \"age\": 31,\n        \"updatedAt\": \"2024-01-02T00:00:00Z\"\n    }\n}"
        }
      ]
    },
    {
      "name": "Delete User",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/1",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "1"]
        }
      },
      "response": [
        {
          "name": "Success Response",
          "originalRequest": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/users/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "1"]
            }
          },
          "status": "OK",
          "code": 200,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "body": "{\n    \"status\": \"success\",\n    \"message\": \"User successfully deleted\"\n}"
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    }
  ]
}
```

Output (OpenAPI 3.0):
```yaml
openapi: 3.0.3
info:
  title: Simple Users API
  description: A basic API collection for managing users
  version: 1.0.0
  contact: {}
servers:
  - url: "https://postman-echo.com"
paths:
  /:
    get:
      summary: Get User by ID
      description: 
      operationId: get
      parameters: []
      responses:
        200:
          description: Success Response
          content:
            application/json:
              schema:
                type: object
                example:
                  status: success
                  data:
                    id: 1
                    name: John Doe
                    email: john@example.com
                    age: 30
                    createdAt: "2024-01-01T00:00:00Z"
        404:
          description: User Not Found
          content:
            application/json:
              schema:
                type: object
                example:
                  status: error
                  message: User not found
    post:
      summary: Create User
      description: Create a new user with the provided information.
      operationId: post
      parameters: []
      responses:
        200:
          description: Successful response
        201:
          description: Success Response
          content:
            application/json:
              schema:
                type: object
                example:
                  status: success
                  data:
                    id: 1
                    name: John Doe
                    email: john@example.com
                    age: 30
                    createdAt: "2024-01-01T00:00:00Z"
        400:
          description: Validation Error
          content:
            application/json:
              schema:
                type: object
                example:
                  status: error
                  errors:
                    name: Name is required
                    email: Invalid email format
                    age: Age must be a positive number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              example:
                name: John Doe
                email: john@example.com
                age: 30
    put:
      summary: Update User
      description: Update an existing user's information.
      operationId: put
      parameters: []
      responses:
        200:
          description: Success Response
          content:
            application/json:
              schema:
                type: object
                example:
                  status: success
                  data:
                    id: 1
                    name: John Doe Updated
                    email: john.updated@example.com
                    age: 31
                    updatedAt: "2024-01-02T00:00:00Z"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              example:
                name: John Doe Updated
                email: john.updated@example.com
                age: 31
    delete:
      summary: Delete User
      description: 
      operationId: delete
      parameters: []
      responses:
        200:
          description: Success Response
          content:
            application/json:
              schema:
                type: object
                example:
                  status: success
                  message: User successfully deleted
components:
  schemas: {}
  securitySchemes:
    basicAuth:
      type: http
      scheme: basic
    digestAuth:
      type: http
      scheme: digest
tags: []

```

## Technical Details

### Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Key Components

- `PostmanToOpenAPIConverter.tsx`: Main component containing the converter logic
- `parseUrl()`: Handles URL parsing from Postman format
- `processParameters()`: Processes query parameters, path parameters, and headers
- `processRequestBody()`: Handles request body conversion
- `toYAML()`: Converts JavaScript objects to YAML format
- `convertToOpenAPI()`: Main conversion logic for Postman to OpenAPI

### Conversion Process

1. Parses the input Postman Collection JSON
2. Extracts collection metadata (name, description)
3. Processes each request in the collection:
   - Converts URL and path parameters
   - Processes request headers
   - Handles request bodies
   - Maps collection folders to OpenAPI tags
4. Generates the OpenAPI specification
5. Outputs in either YAML or JSON format

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Limitations

- Only supports Postman Collection Format v2.x
- Limited support for complex authentication schemes
- Does not handle environment variables
- No support for response examples
- Limited support for non-JSON request bodies

## Future Improvements

- [ ] Support for Postman Collection Format v2.1
- [ ] Handle Postman environment variables
- [ ] Implement more authentication schemes
- [ ] Add batch conversion support
- [ ] Add file upload/download functionality
- [ ] Implement OpenAPI to Postman conversion
- [ ] Add validation for OpenAPI output

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Postman](https://www.postman.com/) for their amazing API development ecosystem
- [OpenAPI Initiative](https://www.openapis.org/) for the OpenAPI Specification
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components

## Contact

For any questions or suggestions, please open an issue or contact the maintainers.

---

Made with ❤️ by [Wisdom Nwokocha](www.linkedin.com/in/joklinztech) and [Prince]
