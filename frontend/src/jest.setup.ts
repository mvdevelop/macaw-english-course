// Polyfill TextEncoder/TextDecoder for React Router v7 + jsdom
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
