import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Polyfill for Request, Response, Headers if not available (Next.js server side needs these)
if (typeof Request === "undefined") {
  global.Request = require("node-fetch").Request as any;
  global.Response = require("node-fetch").Response as any;
  global.Headers = require("node-fetch").Headers as any;
}

// Polyfill for Response.json if not available
if (typeof Response.json === "undefined") {
  (Response as any).json = (data: any, init?: any) => {
    const body = JSON.stringify(data);
    return new Response(body, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  };
}

// Global mock for lucide-react icons
jest.mock("lucide-react", () => ({
    Sun: () => "SunIcon",
    Moon: () => "MoonIcon",
    Search: () => "SearchIcon",
    User: () => "UserIcon",
    ArrowRight: () => "ArrowRightIcon",
    Check: () => "CheckIcon",
    X: () => "XIcon",
    AlertCircle: () => "AlertCircleIcon",
    Calendar: () => "CalendarIcon",
    Clock: () => "ClockIcon",
    Tag: () => "TagIcon",
    Menu: () => "MenuIcon",
    Mail: () => "MailIcon",
    Github: () => "GithubIcon",
    Twitter: () => "TwitterIcon",
    Linkedin: () => "LinkedinIcon",
    ExternalLink: () => "ExternalLinkIcon",
    Image: () => "ImageIcon",
    Plus: () => "PlusIcon",
    Trash: () => "TrashIcon",
    Edit: () => "EditIcon",
    ChevronLeft: () => "ChevronLeftIcon",
    ChevronRight: () => "ChevronRightIcon",
    Eye: () => "EyeIcon",
    Settings: () => "SettingsIcon",
    LogOut: () => "LogOutIcon",
    LayoutDashboard: () => "LayoutDashboardIcon",
    FileText: () => "FileTextIcon",
    Users: () => "UsersIcon",
}));
