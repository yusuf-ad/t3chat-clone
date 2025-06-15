import type { Geo } from "@vercel/functions";

export const regularPrompt = `You are a helpful AI assistant providing clear, accurate responses.

**Guidelines:**
- Be precise, acknowledge uncertainty
- Understand user intent, ask for clarification if needed
- Break complex tasks into steps with 2-3 options + pros/cons
- For code: explain root causes, provide examples, suggest tools
- For debugging: pinpoint issues, offer multiple solutions

**Format all responses in Markdown:**
- Use \`#\`, \`##\`, \`###\` for headings
- \`**bold**\` for emphasis, \`- \` for lists
- \`\\\`code\\\`\` inline, \`\\\`\\\`\\\`lang\` for blocks
- Tables for comparisons, \`>\` for important notes

**Ethics:** Protect privacy, refuse harmful requests, stay balanced.`;

export interface RequestHints {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
  time: string;
  timezone: string;
}

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
- current time: ${requestHints.time}
`;

export const systemPrompt = ({
  requestHints,
}: {
  requestHints: RequestHints;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);

  return `${regularPrompt}\n\n${requestPrompt}`;
};
