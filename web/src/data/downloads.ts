

export interface DownloadVariant {
  label: string;
  arch: string;
  size: string;
  ext: string;
  checksum: string;
  url: string;
}

export interface PlatformDownload {
  os: string;
  icon: string;
  variants: DownloadVariant[];
  recommended: string;
  instructions: string[];
  verifySignature?: string;
}

export const downloads: PlatformDownload[] = [
  {
    os: 'Windows',
    icon: 'Monitor',
    variants: [
      {
        label: 'NSIS Installer (Recommended)',
        arch: 'x64',
        size: '45 MB',
        ext: '.exe',
        checksum: 'sha256:a1b2c3d4e5f6...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64-setup.exe',
      },
      {
        label: 'Portable',
        arch: 'x64',
        size: '42 MB',
        ext: '.exe',
        checksum: 'sha256:f6e5d4c3b2a1...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64-portable.exe',
      },
    ],
    recommended: 'NSIS Installer',
    instructions: [
      'Download the NSIS installer (.exe)',
      'Run the installer and follow the setup wizard',
      'Launch AI Context Studio from Start Menu or Desktop shortcut',
      'Optional: Verify checksum with `certutil -hashfile <file> SHA256`',
    ],
    verifySignature:
      'Windows installer is code-signed with EV certificate. Verify in file Properties → Digital Signatures.',
  },
  {
    os: 'macOS',
    icon: 'Monitor',
    variants: [
      {
        label: 'Universal DMG (Apple Silicon + Intel)',
        arch: 'universal',
        size: '52 MB',
        ext: '.dmg',
        checksum: 'sha256:b2c3d4e5f6a1...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-universal.dmg',
      },
      {
        label: 'Apple Silicon (ARM64)',
        arch: 'arm64',
        size: '48 MB',
        ext: '.dmg',
        checksum: 'sha256:c3d4e5f6a1b2...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-arm64.dmg',
      },
    ],
    recommended: 'Universal DMG',
    instructions: [
      'Download the DMG file',
      'Open the DMG and drag AI Context Studio to Applications',
      'Launch from Applications folder or Spotlight',
      'On first run, right-click → Open to bypass Gatekeeper (unsigned builds)',
      'Optional: Verify checksum with `shasum -a 256 <file>`',
    ],
    verifySignature:
      'macOS builds are notarized by Apple. Verify with `spctl -a -v /Applications/AI\\ Context\\ Studio.app`',
  },
  {
    os: 'Linux',
    icon: 'Monitor',
    variants: [
      {
        label: 'AppImage (Universal)',
        arch: 'x64',
        size: '48 MB',
        ext: '.AppImage',
        checksum: 'sha256:d4e5f6a1b2c3...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64.AppImage',
      },
      {
        label: 'Debian/Ubuntu',
        arch: 'x64',
        size: '44 MB',
        ext: '.deb',
        checksum: 'sha256:e5f6a1b2c3d4...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64.deb',
      },
      {
        label: 'RPM (Fedora/RHEL/openSUSE)',
        arch: 'x64',
        size: '44 MB',
        ext: '.rpm',
        checksum: 'sha256:f6a1b2c3d4e5...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64.rpm',
      },
      {
        label: 'Tarball',
        arch: 'x64',
        size: '42 MB',
        ext: '.tar.gz',
        checksum: 'sha256:a1b2c3d4e5f6...',
        url: 'https://github.com/ai-context-studio/releases/download/v1.0.0/ai-context-studio-1.0.0-x64.tar.gz',
      },
    ],
    recommended: 'AppImage',
    instructions: [
      'Download your preferred format',
      'For AppImage: `chmod +x *.AppImage && ./*.AppImage`',
      'For DEB: `sudo dpkg -i *.deb && sudo apt-get install -f`',
      'For RPM: `sudo rpm -i *.rpm`',
      'For Tarball: `tar -xzf *.tar.gz && ./ai-context-studio`',
      'Optional: Verify checksum with `sha256sum <file>`',
    ],
    verifySignature:
      'Linux binaries are signed with GPG. Verify with `gpg --verify *.sig *.AppImage`',
  },
];

export const sourceCode = {
  label: 'Source Code',
  description: 'Build from source or audit the codebase.',
  url: 'https://github.com/ai-context-studio/ai-context-studio',
  releasesUrl: 'https://github.com/ai-context-studio/ai-context-studio/releases',
  instructions: [
    'Clone: `git clone https://github.com/ai-context-studio/ai-context-studio.git`',
    'Install: `cd ai-context-studio/desktop && npm install`',
    'Build: `npm run build && npm run tauri build`',
    'Requirements: Node.js 20+, Rust 1.77+, system dependencies',
  ],
};

export const releaseNotes = [
  {
    version: '1.0.0',
    date: '2024-02-15',
    title: 'Initial Release',
    highlights: [
      'Full workspace: Dashboard, Prompt Library, Prompt Engine, Personas, Skills, Workflows, Memories, MCP Manager',
      'Asset Validator and Prompt Optimizer',
      'Export to 10+ targets: Cursor, Claude Code, Windsurf, VS Code, Copilot, Codex, Continue, Roo, OpenCode, Generic',
      'Marketplace browser with 300+ assets',
      'Local-first, offline-capable, no telemetry',
      'Windows (NSIS), macOS (DMG), Linux (AppImage/DEB/RPM)',
    ],
    breaking: false,
  },
  {
    version: '0.9.0',
    date: '2024-01-20',
    title: 'Release Candidate 2',
    highlights: [
      'MCP Manager with server validation',
      'Improved export pipeline',
      'Performance optimizations',
      'Bug fixes and stability improvements',
    ],
    breaking: false,
  },
  {
    version: '0.8.0',
    date: '2024-01-05',
    title: 'Release Candidate 1',
    highlights: [
      'Complete workspace implementation',
      'Marketplace integration',
      'Registry specification v1.0',
      'Documentation site launch',
    ],
    breaking: false,
  },
];

export const systemRequirements = {
  windows: 'Windows 10 1903+ (64-bit)',
  macos: 'macOS 12+ (Monterey) — Universal binary supports both Intel and Apple Silicon',
  linux: 'glibc 2.31+, GTK 3.24+, WebKit2GTK 2.38+ — AppImage runs on most modern distributions',
  node: 'Node.js 20+ (for development)',
  rust: 'Rust 1.77+ (for development)',
  memory: 'Minimum 512 MB RAM, Recommended 2 GB+',
  disk: '200 MB for app + assets',
};
