export interface Level {
  title: string;
  tip: string;
  match: string[]; // regex must match each
  avoid: string[]; // regex must match none
  par: string; // reference solution
}

/** Unanchored `RegExp.test`, no flags — anchor yourself with ^ and $. */
export const LEVELS: Level[] = [
  {
    title: "Warm-up",
    tip: "A regex can just be literal text.",
    match: ["cat", "car", "cab", "can"],
    avoid: ["bat", "rat", "hat", "mat"],
    par: "ca",
  },
  {
    title: "Endings",
    tip: "$ pins the pattern to the end of the string.",
    match: ["cat", "bat", "rat", "hat"],
    avoid: ["cats", "bath", "ate", "tab"],
    par: "at$",
  },
  {
    title: "Wildcard",
    tip: ". matches any single character.",
    match: ["bog", "bug", "big", "bag"],
    avoid: ["bg", "bang", "bring", "brag"],
    par: "b.g",
  },
  {
    title: "Optional",
    tip: "? makes the previous token optional.",
    match: ["color", "colour"],
    avoid: ["colr", "colouur", "cooler"],
    par: "colou?r",
  },
  {
    title: "Repeat",
    tip: "+ means one or more of the previous token.",
    match: ["ab", "aab", "aaab", "aaaab"],
    avoid: ["b", "a", "ba", "bbb"],
    par: "a+b",
  },
  {
    title: "Digits",
    tip: "\\d is a digit; {n} repeats exactly n times.",
    match: ["2024", "1999", "0001", "4242"],
    avoid: ["202", "20245", "abcd", "12a4"],
    par: "^\\d{4}$",
  },
  {
    title: "Backreference",
    tip: "\\1 repeats whatever group 1 captured.",
    match: ["abab", "cdcd", "efef"],
    avoid: ["abba", "abcd", "aabb"],
    par: "(..)\\1",
  },
  {
    title: "Doubles",
    tip: "Capture one character, then require it again.",
    match: ["book", "deer", "moon", "ball"],
    avoid: ["boat", "deal", "mono", "bale"],
    par: "(.)\\1",
  },
  {
    title: "Palindromes",
    tip: "Five letters that read the same both ways.",
    match: ["level", "radar", "civic", "rotor"],
    avoid: ["lever", "radio", "civil", "motor"],
    par: "^(.)(.).\\2\\1$",
  },
  {
    title: "Both kinds",
    tip: "Needs at least one digit AND one letter, any order.",
    match: ["a1", "1a", "x9z", "7b7"],
    avoid: ["ab", "12", "99", "zz"],
    par: "\\d.*[a-z]|[a-z].*\\d",
  },
  {
    title: "Emails",
    tip: "Something @ something . something.",
    match: ["a@b.co", "me@x.io", "hi@z.dev"],
    avoid: ["a@b", "@b.co", "a@.co", "a b@c.io"],
    par: "^\\w+@\\w+\\.\\w+$",
  },
  {
    title: "Hex colors",
    tip: "# then 3 or 6 hex digits (both cases).",
    match: ["#fff", "#a1B2c3", "#000000", "#ABCDEF"],
    avoid: ["#ff", "#ggg", "fff", "#ab12c"],
    par: "^#([\\da-fA-F]{3}){1,2}$",
  },
];
