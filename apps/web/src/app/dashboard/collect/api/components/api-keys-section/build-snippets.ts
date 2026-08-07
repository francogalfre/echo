import type { DocsTocSection } from "@echo/ui/components/docs/docs-toc";
import type {
  EndpointParam,
  EndpointSnippet,
} from "@echo/ui/components/docs/endpoint-card";

export const SECTIONS: readonly DocsTocSection[] = [
  { id: "authentication", label: "Authentication" },
  { id: "create-feedback", label: "Create feedback" },
  { id: "list-feedback", label: "List feedback" },
  { id: "errors", label: "Errors" },
];

export const CREATE_FEEDBACK_PARAMS: EndpointParam[] = [
  { name: "name", type: "string", required: true, description: "Reporter's name." },
  {
    name: "feedback",
    type: "string",
    required: true,
    description: "The feedback content.",
  },
  { name: "email", type: "string", required: false, description: "Reporter's email." },
  {
    name: "rating",
    type: "number",
    required: false,
    description: "Star rating from 1 to 5.",
  },
];

const MASKED_SECRET = `echo_sk_${"•".repeat(16)}`;

export const CREATE_RESPONSE = `{
  "success": true,
  "id": "fb_a1b2c3"
}`;

export const LIST_RESPONSE = `{
  "feedback": [
    {
      "id": "fb_a1b2c3",
      "name": "Jane Smith",
      "feedback": "Love the product!",
      "rating": 5,
      "createdAt": "2026-06-24T10:00:00Z"
    }
  ]
}`;

export function buildCreateSnippets(serverUrl: string): EndpointSnippet[] {
  return [
    {
      label: "JavaScript",
      language: "js",
      code: `await fetch("${serverUrl}/api/feedback", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${MASKED_SECRET}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Smith",
    feedback: "Love the product!",
  }),
})`,
    },
    {
      label: "Python",
      language: "python",
      code: `import requests

requests.post(
    "${serverUrl}/api/feedback",
    headers={
        "Authorization": "Bearer ${MASKED_SECRET}",
        "Content-Type": "application/json",
    },
    json={"name": "Jane Smith", "feedback": "Love the product!"},
)`,
    },
  ];
}

export function buildListSnippets(serverUrl: string, publicKey: string): EndpointSnippet[] {
  return [
    {
      label: "JavaScript",
      language: "js",
      code: `const res = await fetch("${serverUrl}/api/feedback", {
  headers: { "Authorization": "Bearer ${publicKey}" },
})

const { feedback } = await res.json()`,
    },
    {
      label: "Python",
      language: "python",
      code: `import requests

response = requests.get(
    "${serverUrl}/api/feedback",
    headers={"Authorization": "Bearer ${publicKey}"},
)

feedback = response.json()["feedback"]`,
    },
  ];
}
