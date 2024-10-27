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

// Add response types
type PostmanResponse = {
  name: string;
  originalRequest?: PostmanRequest;
  status?: string;
  code?: number;
  _postman_previewlanguage?: string;
  header?: PostmanHeader[];
  body?: string;
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

// Updated OpenAPI types to include response content
interface ResponseContent {
  description: string;
  content?: {
    [key: string]: {
      schema: {
        type: string;
        example?: unknown;
      };
    };
  };
}

// New OpenAPI related interfaces
interface Operation {
  tags?: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: Parameter[];
  requestBody?: {
    required: boolean;
    content: {
      [key: string]: {
        schema: {
          type: string;
          example?: unknown;
          properties?: Record<string, unknown>;
        };
      };
    };
  };
  responses: {
    '200': {
      description: string;
    };
  };
}

interface PathItem {
  [method: string]: Operation;
}

interface Paths {
  [path: string]: PathItem;
}

interface OpenAPISpec {
  [key: string]: unknown; 
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact: Record<string, unknown>;
  };
  servers: Array<{
    url: string;
  }>;
  paths: Paths;
  components: {
    schemas: Record<string, unknown>;
    securitySchemes: {
      basicAuth: {
        type: string;
        scheme: string;
      };
      digestAuth: {
        type: string;
        scheme: string;
      };
    };
  };
  tags: Array<{
    name: string;
    description: string;
  }>;
}

type Parameter = {
  name: string;
  in: 'query' | 'path' | 'header';
  schema: {
    type: string;
  };
  example?: string;
  description?: string;
  required?: boolean;
};

type ParsedUrl = {
  path: string;
  protocol: string;
  host: string;
}

// Helper functions
const parseUrl = (urlObj: any): ParsedUrl => {
  const defaultResult: ParsedUrl = { path: '/', protocol: 'https', host: 'postman-echo.com' };
  
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
      const calculatedPath = '/' + urlObj.path.join('/').replace(/^\/+/, '');
      return {
        path: calculatedPath,
        protocol: defaultResult.protocol,
        host: defaultResult.host
      };
    }

    return defaultResult;
  } catch (_error) {
    return defaultResult;
  }
};

const processParameters = (request: PostmanRequest): Parameter[] => {
  const parameters: Parameter[] = [];

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
    } catch (_error) {
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


// Updated YAMLValue type to explicitly include empty object type
type YAMLValue = string | number | boolean | null | undefined | {} | Record<string, unknown> | YAMLValue[];

const toYAML = (obj: Record<string, unknown>, indent = 0): string => {
  const stringify = (value: YAMLValue): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') {
      if (value.match(/[:#\[\]{}",\n|>]/)) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        return '{}';
      }
      // Handle non-empty objects by converting them to string representation
      return String(value);
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
          if (typeof item === 'object' && item !== null) {
            yaml += `${spaces}  - ${toYAML(item as Record<string, unknown>, indent + 4).trimStart()}`;
          } else {
            yaml += `${spaces}  - ${stringify(item)}\n`;
          }
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      if (Object.keys(value).length === 0) {
        yaml += `${spaces}${key}: {}\n`;
      } else {
        yaml += `${spaces}${key}:\n${toYAML(value as Record<string, unknown>, indent + 2)}`;
      }
    } else if (typeof value === 'string' && value.includes('\n')) {
      yaml += `${spaces}${key}: |\n${value.split('\n').map(line => `${spaces}  ${line}`).join('\n')}\n`;
    } else {
      yaml += `${spaces}${key}: ${stringify(value)}\n`;
    }
  }

  return yaml;
};

// Add new function to process response examples
const processResponses = (item: PostmanItem): Record<string, ResponseContent> => {
  const responses: Record<string, ResponseContent> = {
    '200': {
      description: 'Successful response'
    }
  };

  if (item.response && item.response.length > 0) {
    item.response.forEach(response => {
      const statusCode = response.code?.toString() || '200';
      let contentType = 'application/json';
      
      // Get content type from response headers
      if (response.header) {
        const ctHeader = response.header.find(h => h.key.toLowerCase() === 'content-type');
        if (ctHeader) {
          contentType = ctHeader.value;
        }
      }

      let example: unknown = undefined;
      if (response.body) {
        try {
          example = JSON.parse(response.body);
        } catch {
          example = response.body;
        }
      }

      responses[statusCode] = {
        description: response.name || `${statusCode} response`,
        content: example ? {
          [contentType]: {
            schema: {
              type: typeof example === 'object' ? 'object' : 'string',
              example
            }
          }
        } : undefined
      };
    });
  }

  return responses;
};

// Update the convertToOpenAPI function to include response processing
const convertToOpenAPI = (collection: PostmanCollection): OpenAPISpec => {
  const openapi: OpenAPISpec = {
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
          openapi.paths[path] = {} as PathItem;
        }

        const operation: Operation = {
          tags: itemTags.length ? itemTags : undefined,
          summary: item.name || '',
          description: item.request.description || '',
          operationId: `${method}${path.replace(/\W+/g, '')}`,
          parameters: processParameters(item.request),
          responses: processResponses(item)
        };

        if (!['get', 'head', 'delete'].includes(method)) {
          const requestBody = processRequestBody(item.request);
          if (requestBody) {
            operation.requestBody = requestBody;
          }
        }

        (openapi.paths[path] as PathItem)[method] = operation;
      }

      if (item.item && item.name !== undefined) {
        const tag = {
          name: item.name,
          description: item.description || ''
        };
        
        if (!openapi.tags.some(t => t.name === item.name)) {
          openapi.tags.push(tag);
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

const PostmanToOpenAPIConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [outputFormat, setOutputFormat] = useState<'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState(false);

  const GITHUB_URL = "https://github.com/Technical-writing-mentorship-program/PostmanToOpenAPIConverter";

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
      const collection = JSON.parse(input) as PostmanCollection;
      const openapi = convertToOpenAPI(collection);
      
      if (outputFormat === 'yaml') {
        setOutput(toYAML(openapi as Record<string, unknown>));
      } else {
        setOutput(JSON.stringify(openapi, null, 2));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during conversion');
      }
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
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PostmanToOpenAPIConverter;
