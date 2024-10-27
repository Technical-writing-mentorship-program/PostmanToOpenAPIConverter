# Postman to OpenAPI Converter

A web-based tool that converts Postman Collections (v2.x) to OpenAPI 3.0 Specifications. Built with Next.js, TypeScript, and Tailwind CSS.

![Postman to OpenAPI Converter](public/converter-preview.png)

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
    "name": "Sample API",
    "description": "A sample API collection"
  },
  "item": [
    {
      "name": "Get Users",
      "request": {
        "method": "GET",
        "url": {
          "raw": "https://api.example.com/users",
          "path": ["users"],
          "query": [
            {
              "key": "page",
              "value": "1",
              "description": "Page number"
            }
          ]
        },
        "description": "Get all users"
      }
    }
  ]
}
```

Output (OpenAPI 3.0):
```yaml
openapi: 3.0.3
info:
  title: Sample API
  description: A sample API collection
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get Users
      description: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: string
          example: "1"
          description: Page number
      responses:
        '200':
          description: Successful response
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
- [ ] Add support for response examples
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
