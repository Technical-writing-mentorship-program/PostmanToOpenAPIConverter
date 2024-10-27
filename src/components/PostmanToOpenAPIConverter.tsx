"use client";

import React, { useState } from 'react';
import { AlertCircle, FileJson, ArrowRightLeft, Copy, Check, Github } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Type definitions
type PostmanQuery = {
  key: string;
  value: string;
  description?: string;
}

type PostmanHeader = {
  key: string;
  value: string;
  description?: string;
}

type PostmanFormData = {
  key: string;
  value: string;
}

type PostmanRequest = {
  url?: {
    raw?: string;
    path?: string[];
    query?: PostmanQuery[];
  };
  method?: string;
  description?: string;
  header?: PostmanHeader[];
  body?: {
    mode: string;
    raw?: string;
    formdata?: PostmanFormData[];
  };
}

type PostmanItem = {
  name?: string;
  description?: string;
  request?: PostmanRequest;
  item?: PostmanItem[];
}

type PostmanCollection = {
  info?: {
    name?: string;
    description?: string;
  };
  item?: PostmanItem[];
}

// Helper functions
const parseUrl = (urlObj: any) => {
  const defaultResult = { path: '/', protocol: 'https', host: 'postman-echo.com' };
  
  try {
    // Handle string URL
    if (typeof urlObj === 'string') {
      const parsed = new URL(urlObj);
      return {
        path: parsed.pathname || '/',
        protocol: parsed.protocol.replace(':', '') || 'https',
        host: parsed.host || 'postman-echo.com'
      };
    }

    // Handle Postman URL object
    if (urlObj?.raw) {
      const parsed = new URL(urlObj.raw);
      return {
        path: parsed.pathname || '/',
        protocol: parsed.protocol.replace(':', '') || 'https',
        host: parsed.host || 'postman-echo.com'
      };
    }

    // Handle path array in Postman URL object
    if (urlObj?.path) {
      const path = '/' + urlObj.path.join('/').replace(/^\/+/, '');
      return {
        path,
        ...defaultResult
      };
    }

    return defaultResult;
  } catch (e) {
    return defaultResult;
  }
};

const processParameters = (request: PostmanRequest) => {
  const parameters = [];

  // Process URL query parameters
  if (request?.url?.query) {
    request.url.query.forEach(param => {
      parameters.push({
        name: param.key,
        in: 'query',
        schema: {
          type: 'string'
        },
        example: param.value,
        description: param.description || undefined
      });
    });
  }

  // Process path parameters
  if (request?.url?.path) {
    request.url.path.forEach(segment => {
      if (segment.startsWith(':')) {
        parameters.push({
          name: segment.slice(1),
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          }
        });
      }
    });
  }

  // Process headers
  if (request?.header) {
    request.header
      .filter(h => h.key.toLowerCase() !== 'content-type')
      .forEach(header => {
        parameters.push({
          name: header.key,
          in: 'header',
          schema: {
            type: 'string'
          },
          example: header.value,
          description: header.description || undefined
        });
      });
  }

  return parameters;
};

const processRequestBody = (request: PostmanRequest) => {
  if (!request.body) return undefined;

  let contentType = 'application/json';
  if (request.header) {
    const ctHeader = request.header.find(h => h.key.toLowerCase() === 'content-type');
    if (ctHeader) {
      contentType = ctHeader.value;
    }
  }

  let schema: any;
  if (request.body.mode === 'raw' && request.body.raw) {
    try {
      const jsonBody = JSON.parse(request.body.raw);
      schema = {
        type: 'object',
        example: jsonBody
      };
    } catch (e) {
      schema = {
        type: 'string',
        example: request.body.raw
      };
    }
  } else if (request.body.mode === 'formdata' && request.body.formdata) {
    schema = {
      type: 'object',
      properties: {}
    };
    request.body.formdata.forEach(param => {
      if (schema.properties) {
        schema.properties[param.key] = {
          type: 'string',
          example: param.value
        };
      }
    });
  }

  return {
    required: true,
    content: {
      [contentType]: { schema }
    }
  };
};

const toYAML = (obj: any, indent = 0) => {
  const stringify = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') {
      if (value.match(/[:#\[\]{}",\n|>]/)) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return String(value);
  };

  const spaces = ' '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${spaces}${key}: []\n`;
      } else {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            yaml += `${spaces}  - ${toYAML(item, indent + 4).trimStart()}`;
          } else {
            yaml += `${spaces}  - ${stringify(item)}\n`;
          }
        });
      }
    } else if (typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        yaml += `${spaces}${key}: {}\n`;
      } else {
        yaml += `${spaces}${key}:\n${toYAML(value, indent + 2)}`;
      }
    } else if (typeof value === 'string' && value.includes('\n')) {
      yaml += `${spaces}${key}: |\n${value.split('\n').map(line => `${spaces}  ${line}`).join('\n')}\n`;
    } else {
      yaml += `${spaces}${key}: ${stringify(value)}\n`;
    }
  }

  return yaml;
};

const convertToOpenAPI = (collection: PostmanCollection) => {
  const openapi = {
    openapi: '3.0.3',
    info: {
      title: collection.info?.name || 'Converted API',
      description: collection.info?.description || '',
      version: '1.0.0',
      contact: {}
    },
    servers: [
      {
        url: 'https://postman-echo.com'
      }
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        },
        digestAuth: {
          type: 'http',
          scheme: 'digest'
        }
      }
    },
    tags: []
  };

  const processItems = (items: PostmanItem[], itemTags: string[] = []) => {
    items.forEach(item => {
      if (item.request) {
        const { path } = parseUrl(item.request.url);
        const method = item.request.method?.toLowerCase() || 'get';

        if (!openapi.paths[path]) {
          openapi.paths[path] = {};
        }

        const operation = {
          tags: itemTags.length ? itemTags : undefined,
          summary: item.name || '',
          description: item.request.description || '',
          operationId: `${method}${path.replace(/\W+/g, '')}`,
          parameters: processParameters(item.request),
          responses: {
            '200': {
              description: 'Successful response'
            }
          }
        };

        if (!['get', 'head', 'delete'].includes(method)) {
          const requestBody = processRequestBody(item.request);
          if (requestBody) {
            operation.requestBody = requestBody;
          }
        }

        openapi.paths[path][method] = operation;
      }

      if (item.item) {
        if (!openapi.tags.find(t => t.name === item.name)) {
          openapi.tags.push({
            name: item.name || '',
            description: item.description || ''
          });
        }
        processItems(item.item, item.name ? [item.name] : []);
      }
    });
  };

  if (collection.item) {
    processItems(collection.item);
  }

  return openapi;
};

// Main component
const PostmanToOpenAPIConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [outputFormat, setOutputFormat] = useState<'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState(false);

  const GITHUB_URL = "https://github.com/Technical-writing-mentorship-program";

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleConvert = () => {
    setError('');
    setOutput('');
    setCopied(false);

    try {
      const collection = JSON.parse(input);
      const openapi = convertToOpenAPI(collection);
      
      if (outputFormat === 'yaml') {
        setOutput(toYAML(openapi));
      } else {
        setOutput(JSON.stringify(openapi, null, 2));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">Postman to OpenAPI Converter</h1>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>
        <p className="text-gray-600">Convert Postman Collections to OpenAPI 3.0 Specifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Postman Collection (JSON)</h2>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your Postman collection JSON here..."
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              <h2 className="text-lg font-semibold">OpenAPI Specification</h2>
            </div>
            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'yaml' | 'json')}
                className="px-3 py-1 border rounded-md"
              >
                <option value="yaml">YAML</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={`Your OpenAPI specification will appear here in ${outputFormat.toUpperCase()} format...`}
            className="w-full h-96 p-4 border rounded-lg bg-gray-50 font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleConvert}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PostmanToOpenAPIConverter;