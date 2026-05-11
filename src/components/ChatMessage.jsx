import { parseTimestamps } from './TimestampChip';
import AppIcon from './AppIcon';

function inlineFormat(text, keyPrefix) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-${match.index}`} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={`${keyPrefix}-${match.index}`} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-sky-300">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      parts.push(
        <em key={`${keyPrefix}-${match.index}`} className="text-amber-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderMarkdown(text, onSeek) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3) || 'code';
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      elements.push(
        <div key={`code-${index}`} className="my-3 overflow-hidden rounded-xl border border-white/10 bg-black">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="font-mono text-[11px] text-white/40">{lang}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted">Code</span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-xs leading-6 text-slate-200">
            <code>{code.join('\n')}</code>
          </pre>
        </div>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index}`} className="mb-2 mt-5 text-base font-bold text-white">
          {inlineFormat(trimmed.slice(4), `h3-${index}`)}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index}`} className="mb-2 mt-6 border-b border-accent/20 pb-2 text-lg font-extrabold text-accent">
          {inlineFormat(trimmed.slice(3), `h2-${index}`)}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = [];
      while (index < lines.length && /^[-*]\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      elements.push(
        <ul key={`ul-${index}`} className="my-2 flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-slate-300">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{parseTimestamps(item, onSeek).map((part, partIndex) => (typeof part === 'string' ? inlineFormat(part, `uli-${index}-${itemIndex}-${partIndex}`) : part))}</li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, ''));
        index += 1;
      }
      elements.push(
        <ol key={`ol-${index}`} className="my-2 flex list-decimal flex-col gap-1 pl-5 text-sm leading-6 text-slate-300">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{parseTimestamps(item, onSeek).map((part, partIndex) => (typeof part === 'string' ? inlineFormat(part, `oli-${index}-${itemIndex}-${partIndex}`) : part))}</li>
          ))}
        </ol>
      );
      continue;
    } else if (trimmed === '') {
      elements.push(<div key={`sp-${index}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${index}`} className="mb-1 text-sm leading-7 text-slate-300">
          {parseTimestamps(line, onSeek).map((part, partIndex) =>
            typeof part === 'string' ? inlineFormat(part, `p-${index}-${partIndex}`) : part
          )}
        </p>
      );
    }
    index += 1;
  }

  return elements;
}

export default function ChatMessage({ message, onSeek, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <AppIcon name="sparkles" size={16} />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl border px-4 py-3 text-sm ${
          isUser
            ? 'rounded-br bg-accent text-white border-accent'
            : 'rounded-bl bg-surface-card text-slate-200 border-line'
        }`}
      >
        {isUser ? <span className="leading-6">{message.content}</span> : <div className="break-words">{renderMarkdown(message.content, onSeek)}</div>}
        {isStreaming && <span className="ml-1 inline-block h-4 w-2 animate-blink rounded-sm bg-accent align-middle" />}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-white">
          <AppIcon name="user" size={16} />
        </div>
      )}
    </div>
  );
}
