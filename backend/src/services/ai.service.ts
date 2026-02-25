import { v4 as uuid } from 'uuid';
import {
  SentimentResult,
  NextBestAction,
  EmailDraft,
  ConversationSummary,
  ConversationIntelligence,
  ScoreFactor,
  Activity,
  Contact,
  Lead,
  CommunicationChannel,
} from '../types';

// ============================================================
// AI Service — Predictive Lead Scoring
// ============================================================

export function calculateLeadScore(contact: Contact, activities: Activity[]): { score: number; factors: ScoreFactor[] } {
  const factors: ScoreFactor[] = [];

  // Factor: Email engagement
  const emailOpens = activities.filter(a => a.type === 'email_open').length;
  const emailClicks = activities.filter(a => a.type === 'email_click').length;
  const emailScore = Math.min((emailOpens * 2 + emailClicks * 5), 30);
  factors.push({ factor: 'email_engagement', weight: 0.3, value: emailScore, description: `${emailOpens} opens, ${emailClicks} clicks` });

  // Factor: Website activity
  const pageViews = activities.filter(a => a.type === 'page_view').length;
  const downloads = activities.filter(a => a.type === 'download').length;
  const webScore = Math.min((pageViews * 1 + downloads * 8), 25);
  factors.push({ factor: 'web_activity', weight: 0.25, value: webScore, description: `${pageViews} page views, ${downloads} downloads` });

  // Factor: Form submissions
  const formSubmits = activities.filter(a => a.type === 'form_submit').length;
  const formScore = Math.min(formSubmits * 10, 20);
  factors.push({ factor: 'form_engagement', weight: 0.2, value: formScore, description: `${formSubmits} form submissions` });

  // Factor: Profile completeness
  let profileScore = 0;
  if (contact.email) profileScore += 5;
  if (contact.phone) profileScore += 5;
  if (contact.company) profileScore += 5;
  if (contact.jobTitle) profileScore += 5;
  factors.push({ factor: 'profile_completeness', weight: 0.15, value: profileScore, description: `Profile ${profileScore / 20 * 100}% complete` });

  // Factor: Recency
  const recentActivities = activities.filter(a => {
    const actDate = new Date(a.timestamp);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return actDate > weekAgo;
  }).length;
  const recencyScore = Math.min(recentActivities * 3, 10);
  factors.push({ factor: 'recency', weight: 0.1, value: recencyScore, description: `${recentActivities} activities in last 7 days` });

  const totalScore = factors.reduce((sum, f) => sum + f.value, 0);

  return { score: Math.min(totalScore, 100), factors };
}

// ============================================================
// AI Service — Sentiment Analysis
// ============================================================

const NEGATIVE_WORDS = [
  'angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'horrible',
  'unacceptable', 'worst', 'hate', 'furious', 'broken', 'useless',
  'wütend', 'frustriert', 'enttäuscht', 'schrecklich', 'inakzeptabel',
  'schlimmste', 'kaputt', 'nutzlos', 'ärgerlich', 'mangelhaft',
];

const POSITIVE_WORDS = [
  'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love',
  'perfect', 'outstanding', 'brilliant', 'happy', 'satisfied', 'thank',
  'großartig', 'ausgezeichnet', 'wunderbar', 'fantastisch', 'perfekt',
  'zufrieden', 'danke', 'hervorragend', 'super', 'toll',
];

export function analyzeSentiment(text: string): SentimentResult {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;
  const keywords: string[] = [];

  for (const word of words) {
    if (POSITIVE_WORDS.some(pw => word.includes(pw))) {
      positiveCount++;
      keywords.push(word);
    }
    if (NEGATIVE_WORDS.some(nw => word.includes(nw))) {
      negativeCount++;
      keywords.push(word);
    }
  }

  const total = positiveCount + negativeCount;
  let score = 0;
  let label: SentimentResult['label'] = 'neutral';
  let confidence = 0.5;

  if (total > 0) {
    score = (positiveCount - negativeCount) / total;
    confidence = Math.min(0.5 + total * 0.1, 0.95);
    if (score > 0.2) label = 'positive';
    else if (score < -0.2) label = 'negative';
  }

  return { score: Math.round(score * 100) / 100, label, confidence: Math.round(confidence * 100) / 100, keywords: [...new Set(keywords)] };
}

// ============================================================
// AI Service — Next Best Action Recommendations
// ============================================================

export function generateNextBestActions(
  contact: Contact,
  lead: Lead | null,
  activities: Activity[],
): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // Check for recent inactivity
  const lastActivity = activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  if (lastActivity) {
    const daysSinceLast = (Date.now() - new Date(lastActivity.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 14) {
      actions.push({
        id: uuid(),
        contactId: contact.id,
        action: `Re-engage ${contact.firstName} — no activity for ${Math.floor(daysSinceLast)} days`,
        reason: 'Contact has been inactive and may need a touchpoint to maintain engagement.',
        priority: 0.8,
        channel: 'email',
        suggestedAt: new Date().toISOString(),
        status: 'pending',
      });
    }
  }

  // Check if lead has high score but hasn't been contacted
  if (lead && lead.score > 70 && lead.status === 'new') {
    actions.push({
      id: uuid(),
      contactId: contact.id,
      action: `Contact high-scoring lead ${contact.firstName} ${contact.lastName} (Score: ${lead.score})`,
      reason: 'This lead has a high predictive score and has not been contacted yet.',
      priority: 0.95,
      channel: 'phone',
      suggestedAt: new Date().toISOString(),
      status: 'pending',
    });
  }

  // Check for pricing page visits
  const pricingVisits = activities.filter(
    a => a.type === 'page_view' && a.metadata && (a.metadata as Record<string, string>).page?.includes('pricing')
  );
  if (pricingVisits.length > 0) {
    actions.push({
      id: uuid(),
      contactId: contact.id,
      action: `Send pricing information to ${contact.firstName} — visited pricing page ${pricingVisits.length} time(s)`,
      reason: 'Contact has shown interest in pricing, suggesting buying intent.',
      priority: 0.85,
      channel: 'email',
      suggestedAt: new Date().toISOString(),
      status: 'pending',
    });
  }

  // Check for download activity
  const downloads = activities.filter(a => a.type === 'download');
  if (downloads.length > 2) {
    actions.push({
      id: uuid(),
      contactId: contact.id,
      action: `Schedule a demo call with ${contact.firstName} — downloaded ${downloads.length} resources`,
      reason: 'Multiple resource downloads indicate high interest and readiness for a product demonstration.',
      priority: 0.75,
      channel: 'phone',
      suggestedAt: new Date().toISOString(),
      status: 'pending',
    });
  }

  return actions.sort((a, b) => b.priority - a.priority);
}

// ============================================================
// AI Service — Generative AI (Email Drafting)
// ============================================================

export function generateEmailDraft(
  contact: Contact,
  purpose: string,
  tone: 'formal' | 'friendly' | 'urgent' = 'friendly',
  keywords: string[] = [],
): EmailDraft {
  const greeting = tone === 'formal'
    ? `Sehr geehrte(r) ${contact.firstName} ${contact.lastName}`
    : `Hallo ${contact.firstName}`;

  const keywordSection = keywords.length > 0
    ? `\n\nBezüglich: ${keywords.join(', ')}`
    : '';

  const closing = tone === 'formal'
    ? 'Mit freundlichen Grüßen'
    : 'Beste Grüße';

  const templates: Record<string, { subject: string; body: string }> = {
    'follow_up': {
      subject: `Follow-up: ${contact.company ? `Zusammenarbeit mit ${contact.company}` : 'Unser Gespräch'}`,
      body: `${greeting},\n\nvielen Dank für Ihr Interesse und das angenehme Gespräch.${keywordSection}\n\nIch möchte gerne an unser letztes Gespräch anknüpfen und Ihnen weitere Informationen zukommen lassen.\n\nWann passt es Ihnen am besten für ein kurzes Telefonat?\n\n${closing}`,
    },
    'introduction': {
      subject: `Vorstellung: Wie wir ${contact.company || 'Ihrem Unternehmen'} helfen können`,
      body: `${greeting},\n\nich hoffe, diese Nachricht erreicht Sie gut.${keywordSection}\n\nWir unterstützen Unternehmen wie ${contact.company || 'Ihres'} dabei, ihre Geschäftsprozesse zu optimieren.\n\nGerne würde ich Ihnen in einem kurzen Gespräch zeigen, wie wir auch Ihnen helfen können.\n\n${closing}`,
    },
    'support': {
      subject: `Ihr Anliegen — Wir sind für Sie da`,
      body: `${greeting},\n\nvielen Dank, dass Sie sich an uns gewendet haben.${keywordSection}\n\nWir haben Ihr Anliegen erhalten und kümmern uns umgehend darum. Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.\n\n${closing}`,
    },
  };

  const template = templates[purpose] || templates['follow_up'];

  return {
    subject: template.subject,
    body: template.body,
    tone,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================
// AI Service — Conversation Summary
// ============================================================

export function summarizeConversation(messages: { sender: string; content: string }[]): ConversationSummary {
  const allText = messages.map(m => m.content).join(' ');
  const sentenceSplit = allText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const keyPoints = sentenceSplit.slice(0, Math.min(5, sentenceSplit.length)).map(s => s.trim());

  // Extract action items (sentences with action verbs)
  const actionVerbs = ['please', 'need', 'should', 'must', 'will', 'bitte', 'müssen', 'sollen', 'werden'];
  const actionItems = sentenceSplit
    .filter(s => actionVerbs.some(v => s.toLowerCase().includes(v)))
    .slice(0, 3)
    .map(s => s.trim());

  const sentiment = analyzeSentiment(allText);

  const summary = keyPoints.length > 0
    ? `Conversation with ${messages.length} messages. ${keyPoints[0]}.${keyPoints.length > 1 ? ` Additionally: ${keyPoints[1]}.` : ''}`
    : `Conversation with ${messages.length} messages. No significant content to summarize.`;

  return {
    summary,
    keyPoints,
    actionItems,
    sentiment,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================
// AI Service — Conversation Intelligence (Call Analysis)
// ============================================================

export function analyzeCall(transcript: { speaker: string; text: string; durationMs: number }[]): ConversationIntelligence {
  let agentTime = 0;
  let customerTime = 0;
  const allText: string[] = [];

  for (const segment of transcript) {
    if (segment.speaker === 'agent') agentTime += segment.durationMs;
    else customerTime += segment.durationMs;
    allText.push(segment.text);
  }

  const totalTime = agentTime + customerTime;
  const talkRatio = {
    agent: totalTime > 0 ? Math.round((agentTime / totalTime) * 100) : 50,
    customer: totalTime > 0 ? Math.round((customerTime / totalTime) * 100) : 50,
  };

  const fullText = allText.join(' ');
  const sentiment = analyzeSentiment(fullText);

  // Extract keywords
  const wordFreq: Record<string, number> = {};
  const stopWords = new Set(['the', 'a', 'an', 'is', 'was', 'are', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'aber', 'in', 'auf', 'an', 'zu', 'für', 'von', 'mit']);
  const words = fullText.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  const suggestions: string[] = [];
  if (talkRatio.agent > 70) suggestions.push('Consider letting the customer speak more — aim for a 60/40 or 50/50 ratio.');
  if (talkRatio.customer > 80) suggestions.push('Try to engage more actively in the conversation.');
  if (sentiment.label === 'negative') suggestions.push('Customer sentiment was negative — consider addressing concerns proactively.');
  if (keywords.length < 3) suggestions.push('The conversation had few distinctive keywords — try to focus on key topics.');

  return {
    callId: uuid(),
    duration: totalTime,
    talkRatio,
    sentiment,
    keywords,
    suggestions,
    analyzedAt: new Date().toISOString(),
  };
}
