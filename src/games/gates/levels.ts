export type Gate = "not" | "and" | "or" | "xor" | "nand" | "nor";

export type Tree =
  | { k: "in"; name: string }
  | { k: "gate"; g: Gate; kids: (Tree | null)[] };

export interface Level {
  title: string;
  tip: string;
  inputs: string[];
  gates: Gate[]; // parts available
  fn: (v: boolean[]) => boolean; // target behaviour
  sol: Tree; // reference circuit (defines par)
}

const I = (name: string): Tree => ({ k: "in", name });
const G = (g: Gate, ...kids: Tree[]): Tree => ({ k: "gate", g, kids });

const [A, B, C] = ["A", "B", "C"].map(I);
const S = I("S");

export const LEVELS: Level[] = [
  {
    title: "Inverter",
    tip: "Tap a socket to place a part. NOT flips its input.",
    inputs: ["A"],
    gates: ["not"],
    fn: ([a]) => !a,
    sol: G("not", A),
  },
  {
    title: "Both on",
    tip: "AND is 1 only when both inputs are 1.",
    inputs: ["A", "B"],
    gates: ["and"],
    fn: ([a, b]) => a && b,
    sol: G("and", A, B),
  },
  {
    title: "Either on",
    tip: "OR is 1 when at least one input is 1.",
    inputs: ["A", "B"],
    gates: ["or"],
    fn: ([a, b]) => a || b,
    sol: G("or", A, B),
  },
  {
    title: "NAND",
    tip: "Combine two parts: AND, then invert.",
    inputs: ["A", "B"],
    gates: ["and", "not"],
    fn: ([a, b]) => !(a && b),
    sol: G("not", G("and", A, B)),
  },
  {
    title: "Exclusive",
    tip: "XOR: one or the other, not both. You can reuse inputs.",
    inputs: ["A", "B"],
    gates: ["and", "or", "not"],
    fn: ([a, b]) => a !== b,
    sol: G("and", G("or", A, B), G("not", G("and", A, B))),
  },
  {
    title: "Equal",
    tip: "XNOR: 1 when both inputs match.",
    inputs: ["A", "B"],
    gates: ["and", "or", "not"],
    fn: ([a, b]) => a === b,
    sol: G("or", G("and", A, B), G("not", G("or", A, B))),
  },
  {
    title: "Majority",
    tip: "1 when at least two of three inputs are 1. Only AND and OR.",
    inputs: ["A", "B", "C"],
    gates: ["and", "or"],
    fn: ([a, b, c]) => (a && b) || (a && c) || (b && c),
    sol: G("or", G("and", A, B), G("and", C, G("or", A, B))),
  },
  {
    title: "NAND only: AND",
    tip: "NAND is universal. Feed one input to both pins to make NOT.",
    inputs: ["A", "B"],
    gates: ["nand"],
    fn: ([a, b]) => a && b,
    sol: G("nand", G("nand", A, B), G("nand", A, B)),
  },
  {
    title: "NAND only: OR",
    tip: "De Morgan: A OR B = NOT(NOT A AND NOT B).",
    inputs: ["A", "B"],
    gates: ["nand"],
    fn: ([a, b]) => a || b,
    sol: G("nand", G("nand", A, A), G("nand", B, B)),
  },
  {
    title: "NOR only: AND",
    tip: "NOR is universal too. Same trick, mirrored.",
    inputs: ["A", "B"],
    gates: ["nor"],
    fn: ([a, b]) => a && b,
    sol: G("nor", G("nor", A, A), G("nor", B, B)),
  },
  {
    title: "Multiplexer",
    tip: "S picks the output: S = 1 gives A, S = 0 gives B.",
    inputs: ["S", "A", "B"],
    gates: ["and", "or", "not"],
    fn: ([s, a, b]) => (s ? a : b),
    sol: G("or", G("and", S, A), G("and", G("not", S), B)),
  },
  {
    title: "Parity",
    tip: "1 when an odd number of inputs are 1. Chain XORs.",
    inputs: ["A", "B", "C"],
    gates: ["xor"],
    fn: ([a, b, c]) => a !== b !== c,
    sol: G("xor", G("xor", A, B), C),
  },
];
