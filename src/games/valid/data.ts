export interface Cat {
  id: string;
  title: string;
  icon: string;
  /** Valid samples. */
  ok: string[];
  /** Invalid samples with the reason they fail. */
  bad: [string, string][];
}

export interface Card {
  s: string;
  ok: boolean;
  why: string;
  kind: string;
}

export const CATS: Cat[] = [
  {
    id: "email",
    title: "Email",
    icon: "✉️",
    ok: [
      "jane.doe@example.com", "user+tag@gmail.com", "a@b.co", "first_last@sub.domain.org", "x-y@my-site.io",
      "123@456.com", "o'brien@example.ie", "name@example.museum", "UPPER@EXAMPLE.COM", "me@localhost.dev",
    ],
    bad: [
      ["jane.doe@", "nothing after the @"],
      ["@example.com", "nothing before the @"],
      ["jane@@example.com", "two @ signs"],
      ["jane doe@example.com", "spaces aren't allowed"],
      ["jane..doe@example.com", "consecutive dots in the name"],
      [".jane@example.com", "name can't start with a dot"],
      ["jane@-example.com", "domain label can't start with a hyphen"],
      ["jane@example..com", "empty domain label"],
      ["jane@exa_mple.com", "underscore isn't allowed in a domain"],
      ["jane(at)example.com", "no @ sign"],
    ],
  },
  {
    id: "url",
    title: "URL",
    icon: "🌐",
    ok: [
      "https://example.com", "http://localhost:3000/app", "https://sub.example.co.uk/path?q=1#top",
      "ftp://files.example.org/readme.txt", "https://example.com/a%20b", "https://user:pass@host.io:8080/",
      "http://192.168.0.1/admin", "file:///etc/hosts", "https://[::1]:8080/", "mailto:hi@example.com",
    ],
    bad: [
      ["http//example.com", "missing the colon after the scheme"],
      ["https://exa mple.com", "space in the host"],
      ["https://example.com:abc/", "port must be a number"],
      ["https://example.com:99999", "port is above 65535"],
      ["example.com", "no scheme, just a hostname"],
      ["https://", "no host"],
      ["https://example..com", "empty host label"],
      ["https://example.com/pa th", "space must be encoded as %20"],
      ["https://[::1/", "unclosed IPv6 bracket"],
      ["https://user@@host.com", "two @ signs"],
    ],
  },
  {
    id: "ip",
    title: "IP address",
    icon: "📡",
    ok: [
      "192.168.1.1", "0.0.0.0", "255.255.255.255", "10.0.0.1", "127.0.0.1",
      "::1", "2001:db8::ff00:42:8329", "fe80::1", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "::ffff:192.0.2.1",
    ],
    bad: [
      ["256.1.1.1", "256 is above 255"],
      ["192.168.1", "only 3 octets"],
      ["192.168.1.1.1", "5 octets"],
      ["192.168.01.1", "leading zero"],
      ["1.2.3.4.", "trailing dot"],
      ["192.168.1.a", "letters in an octet"],
      ["2001:db8::1::2", "'::' used twice"],
      ["2001:db8:g::1", "'g' isn't a hex digit"],
      ["12345::1", "group has 5 hex digits"],
      ["1:2:3:4:5:6:7:8:9", "9 groups, max is 8"],
    ],
  },
  {
    id: "color",
    title: "Hex color",
    icon: "🎨",
    ok: [
      "#fff", "#FF00AA", "#1a2b3c", "#000", "#abcdef", "#ABC", "#12345678", "#f0f8", "#0a0", "#c0ffee",
    ],
    bad: [
      ["fff", "missing the #"],
      ["#ff", "only 2 digits"],
      ["#ggg", "'g' isn't a hex digit"],
      ["#12345", "5 digits, need 3, 4, 6 or 8"],
      ["#1234567", "7 digits, need 3, 4, 6 or 8"],
      ["##fff", "two # signs"],
      ["#ff 00 aa", "spaces aren't allowed"],
      ["0xff00ff", "that's a C literal, not CSS"],
      ["#xyz123", "'x', 'y', 'z' aren't hex digits"],
      ["#123456789", "9 digits, max is 8"],
    ],
  },
  {
    id: "uuid",
    title: "UUID",
    icon: "🔑",
    ok: [
      "123e4567-e89b-12d3-a456-426614174000", "550e8400-e29b-41d4-a716-446655440000",
      "00000000-0000-0000-0000-000000000000", "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF",
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "9b2d1c3e-4f5a-4b6c-8d7e-0f1a2b3c4d5e",
      "01890a5d-ac96-774b-bcce-b302099a8057", "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
      "deadbeef-dead-beef-dead-beefdeadbeef", "0a1b2c3d-4e5f-6789-abcd-ef0123456789",
    ],
    bad: [
      ["123e4567-e89b-12d3-a456-42661417400", "last group has 11 digits, needs 12"],
      ["123e4567e89b12d3a456426614174000", "missing hyphens"],
      ["123e4567-e89b-12d3-a456-4266141740000", "last group has 13 digits, needs 12"],
      ["123e4567-e89b-12d3-a456", "missing the last group"],
      ["123g4567-e89b-12d3-a456-426614174000", "'g' isn't a hex digit"],
      ["123e4567-e89b-12d3-a456-426614174000-", "trailing hyphen"],
      ["123e456-7e89b-12d3-a456-426614174000", "hyphens in the wrong places"],
      ["123E4567_E89B_12D3_A456_426614174000", "underscores instead of hyphens"],
      ["123e4567-e89b-12d3-a456-42661417400z", "'z' isn't a hex digit"],
      [" 123e4567-e89b-12d3-a456-426614174000", "leading space"],
    ],
  },
];

export const MIX = { id: "mix", title: "Mix", icon: "🎲" };

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** `n` cards, half valid and half invalid, shuffled. */
export function deal(id: string, n: number): Card[] {
  const pool = id === "mix" ? CATS : CATS.filter((c) => c.id === id);
  const ok = pool.flatMap((c) => c.ok.map((s): Card => ({ s, ok: true, why: "", kind: c.title })));
  const bad = pool.flatMap((c) => c.bad.map(([s, why]): Card => ({ s, ok: false, why, kind: c.title })));
  const half = Math.floor(n / 2);
  return shuffle([...shuffle(ok).slice(0, n - half), ...shuffle(bad).slice(0, half)]);
}
