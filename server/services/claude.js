import Anthropic from '@anthropic-ai/sdk';

let client;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

function buildPrompt(profile, jobRole) {
  const edu = profile.education || {};
  const skills = (profile.skills || []).join(', ') || 'None listed';

  const experience =
    (profile.experience || [])
      .map((e) => `• ${e.title} at ${e.company} (${e.duration}): ${e.description}`)
      .join('\n') || 'None';

  const projects =
    (profile.projects || [])
      .map(
        (p) =>
          `• ${p.name} [${(p.techStack || []).join(', ')}]: ${p.description}`
      )
      .join('\n') || 'None';

  const certs =
    (profile.certifications || [])
      .map((c) => `• ${c.name} — ${c.issuer} (${c.year})`)
      .join('\n') || 'None';

  return `You are an expert career counselor and placement advisor for college students in tech.

A student wants to prepare for the role of **${jobRole}**.

Here is their current profile:

**Education:**
- Degree: ${edu.degree || 'N/A'}
- Branch: ${edu.branch || 'N/A'}
- College: ${edu.college || 'N/A'}
- Graduation Year: ${edu.graduationYear || 'N/A'}
- CGPA: ${edu.cgpa || 'N/A'}

**Skills:** ${skills}

**Experience:**
${experience}

**Projects:**
${projects}

**Certifications:**
${certs}

Analyze the gap between this student's current profile and what is typically required for the role of "${jobRole}". Provide a comprehensive, actionable assessment.

You MUST respond in EXACTLY this JSON format with no extra text before or after the JSON:
{
  "summary": "A 2-3 sentence overall assessment of the student's readiness",
  "skillGaps": [
    {
      "skill": "Skill name",
      "priority": "high | medium | low",
      "description": "Why this skill matters and how to learn it"
    }
  ],
  "recommendedCertifications": [
    {
      "name": "Certification name",
      "reason": "Why this certification helps for the target role"
    }
  ],
  "projectSuggestions": [
    {
      "name": "Project name",
      "description": "What to build and why it demonstrates relevant skills",
      "skills": ["skill1", "skill2"]
    }
  ],
  "resumeTips": [
    "Specific actionable tip for improving the resume for this role"
  ],
  "interviewTips": [
    "Specific actionable interview preparation tip for this role"
  ]
}

Provide at least 3 items for skillGaps, 2 for recommendedCertifications, 2 for projectSuggestions, 3 for resumeTips, and 3 for interviewTips. Tailor everything specifically to the "${jobRole}" role and the student's current profile.`;
}

export async function analyzeProfile(profile, jobRole) {
  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: buildPrompt(profile, jobRole),
      },
    ],
  });

  const text = message.content[0].text;

  // Extract JSON from the response (handle possible markdown fencing)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  const result = JSON.parse(jsonMatch[0]);

  // Validate required fields exist
  const required = [
    'summary',
    'skillGaps',
    'recommendedCertifications',
    'projectSuggestions',
    'resumeTips',
    'interviewTips',
  ];
  for (const key of required) {
    if (!result[key]) {
      throw new Error(`AI response missing field: ${key}`);
    }
  }

  return result;
}
