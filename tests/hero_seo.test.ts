import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { getRollingBatchDate } from '../utils/batchDate';
import { ACTIVITY_POOL } from '../components/common/LiveRegistrationToast';

test('Hero Section Content Verification', () => {
  const landingPageFile = fs.readFileSync(
    path.join(__dirname, '../app/LandingPageClient.tsx'),
    'utf-8'
  );

  // Extract the hero section
  const heroMatch = landingPageFile.match(/{\/\* 3\. HERO SECTION \*\/}([\s\S]*?){\/\* 4\. MOVABLE COMPANY LOGOS/);
  assert.ok(heroMatch, 'Hero section should be found in LandingPageClient.tsx');
  const heroContent = heroMatch[1];

  // 1. TOP BADGE
  assert.ok(
    heroContent.includes('JOIN STUDENTS BUILDING FUTURE-READY SKILLS'),
    'Hero must contain top badge: JOIN STUDENTS BUILDING FUTURE-READY SKILLS'
  );

  // 2. MAIN HEADING
  assert.ok(
    heroContent.includes('100% Free') &&
    heroContent.includes('Verified Virtual Internship') &&
    heroContent.includes('2026') &&
    heroContent.includes('Pan-India'),
    'Hero heading must contain "100% Free Verified Virtual Internship 2026 | Pan-India"'
  );

  // 3. REMOVAL OF "Enrollment" AND "₹99"
  assert.ok(
    !heroContent.includes('Free Enrollment'),
    'Hero heading/content must not contain "Free Enrollment"'
  );
  assert.ok(
    !heroContent.toLowerCase().includes('enrollment'),
    'Hero must completely remove the word "Enrollment"'
  );
  assert.ok(
    !heroContent.includes('₹99'),
    'Hero must not display ₹99'
  );
  assert.ok(
    !heroContent.includes('certificate fee'),
    'Hero must not mention certificate fee'
  );

  // 4. HERO DESCRIPTION
  assert.ok(
    heroContent.includes(
      'Apply free, learn free, and complete your virtual internship. Choose from available domains, get an instant offer letter, and build real project experience online with InternJourneys.'
    ),
    'Hero description must match required copy'
  );

  // 5. DYNAMIC BATCH ANNOUNCEMENT PILL
  assert.ok(
    heroContent.includes('New Batch Starts:') &&
    heroContent.includes('Registration Open'),
    'Hero must have dynamic batch announcement pill with "New Batch Starts: ... | Registration Open"'
  );

  // 6. PRIMARY BUTTON
  assert.ok(
    heroContent.includes("Get Started Now (It's Free)") || heroContent.includes("Get Started Now (It&apos;s Free)"),
    'Primary button text must be "Get Started Now (It\'s Free)"'
  );
  assert.ok(
    heroContent.includes('href="/register"'),
    'Primary button must link to /register'
  );

  // 7. SECONDARY BUTTON
  assert.ok(
    heroContent.includes('Explore Domains') && heroContent.includes('href="#domains"'),
    'Secondary button must link to #domains'
  );

  // 8. TRUST INDICATORS
  assert.ok(heroContent.includes('Verified Program'), 'Trust indicator: Verified Program');
  assert.ok(heroContent.includes('Instant Offer Letter'), 'Trust indicator: Instant Offer Letter');
  assert.ok(heroContent.includes('100% Virtual'), 'Trust indicator: 100% Virtual');
});

test('Dynamic Batch Date Calculation', () => {
  const tomorrow = getRollingBatchDate();
  assert.ok(typeof tomorrow === 'string' && tomorrow.length > 8, 'Returns formatted date string');
  // Format check: DD Month YYYY (e.g. "31 October 2026")
  assert.match(tomorrow, /^\d{2}\s[A-Z][a-z]+\s\d{4}$/, 'Matches DD Month YYYY pattern');
});

test('Student Activity Toast Verification', () => {
  assert.ok(ACTIVITY_POOL.length >= 30, 'Pool must contain at least 30 activity records');
  assert.ok(ACTIVITY_POOL.every(item => item.name && item.city && item.domain && item.initials), 'All records have name, city, domain, and initials');
  
  const toastFile = fs.readFileSync(
    path.join(__dirname, '../components/common/LiveRegistrationToast.tsx'),
    'utf-8'
  );
  assert.ok(toastFile.includes('sessionStorage'), 'Remembers dismissal state via sessionStorage');
  assert.ok(!toastFile.includes('EXPLORE INTERNJOURNEYS – Discover project-based learning'), 'Old popup removed completely');
  assert.ok(toastFile.includes('Just applied for'), 'New student activity notification phrasing present');
});

test('Favicon Assets and HTML Configuration', () => {
  const publicDir = path.join(__dirname, '../public');
  assert.ok(fs.existsSync(path.join(publicDir, 'favicon.ico')), 'favicon.ico exists in public');
  assert.ok(fs.existsSync(path.join(publicDir, 'favicon-96x96.png')), 'favicon-96x96.png exists in public');
  assert.ok(fs.existsSync(path.join(publicDir, 'favicon-192x192.png')), 'favicon-192x192.png exists in public');
  assert.ok(fs.existsSync(path.join(publicDir, 'apple-touch-icon.png')), 'apple-touch-icon.png exists in public');

  const layoutFile = fs.readFileSync(path.join(__dirname, '../app/layout.tsx'), 'utf-8');
  assert.ok(layoutFile.includes("'/favicon.ico'"), 'layout.tsx configures favicon.ico');
  assert.ok(layoutFile.includes("'/favicon-96x96.png'"), 'layout.tsx configures favicon-96x96.png');
  assert.ok(layoutFile.includes("'/favicon-192x192.png'"), 'layout.tsx configures favicon-192x192.png');
  assert.ok(layoutFile.includes("'/apple-touch-icon.png'"), 'layout.tsx configures apple-touch-icon.png');
});

test('Mobile Navbar and Desktop Separation', () => {
  const landingPageFile = fs.readFileSync(
    path.join(__dirname, '../app/LandingPageClient.tsx'),
    'utf-8'
  );

  // Desktop keeps Explore Internships and Sign In
  assert.ok(landingPageFile.includes('hidden lg:flex items-center gap-3'), 'Desktop retains dedicated action container');
  assert.ok(landingPageFile.includes('Explore Internships'), 'Desktop retains Explore Internships button');

  // Mobile has Get Started Now and hamburger toggle
  assert.ok(landingPageFile.includes('flex lg:hidden items-center'), 'Mobile has dedicated action container');
  assert.ok(landingPageFile.includes('Get Started Now'), 'Mobile navbar has Get Started Now button');
  assert.ok(landingPageFile.includes('mobileMenuOpen'), 'Mobile menu state is managed');
  assert.ok(landingPageFile.includes('How It Works') && landingPageFile.includes('Verify Certificate'), 'Mobile drawer has full menu links');
});

test('Platform Statistics Update: 1,59,544+ Active Interns', () => {
  const landingPageFile = fs.readFileSync(
    path.join(__dirname, '../app/LandingPageClient.tsx'),
    'utf-8'
  );

  assert.ok(landingPageFile.includes('CountUpNumber target={159544} suffix="+"'), 'Active interns statistic uses CountUpNumber with 159544');
  assert.match(
    landingPageFile,
    />\s*16\s*<\/p>\s*<\/div>\s*<h2[^>]*>\s*Internship Domains/,
    'Internship domain count includes the four added tracks'
  );
  assert.ok(landingPageFile.includes('Active Interns'), 'Card label is Active Interns');
  assert.ok(!landingPageFile.includes('60+'), '60+ Tasks statistic has been removed');
  assert.ok(!landingPageFile.includes('Practical Tasks'), 'Practical Tasks heading has been replaced with Active Interns');
});

test('Homepage SEO and Structured Data Verification', () => {
  const pageFile = fs.readFileSync(path.join(__dirname, '../app/page.tsx'), 'utf-8');

  // Title
  assert.ok(
    pageFile.includes('Free Verified Virtual Internships 2026 in India | InternJourneys'),
    'Homepage SEO title must match requested tag'
  );

  // Meta description
  assert.ok(
    pageFile.includes(
      'Build future-ready skills with free, verified virtual internships at InternJourneys. Explore hands-on project tracks, receive an offer letter, and gain practical experience from anywhere in India.'
    ),
    'Homepage meta description must match requested copy'
  );

  // Canonical
  assert.ok(
    pageFile.includes('https://internjourneys.in/'),
    'Canonical URL must be https://internjourneys.in/'
  );

  // Keywords
  assert.ok(pageFile.includes('Online Internships'), 'Includes Online Internships keyword');
  assert.ok(pageFile.includes('Free Internships'), 'Includes Free Internships keyword');
  assert.ok(pageFile.includes('Virtual Internships'), 'Includes Virtual Internships keyword');
  assert.ok(pageFile.includes('AI Virtual Internship'), 'Includes AI Virtual Internship keyword');
  assert.ok(pageFile.includes('Data Science Internship'), 'Includes Data Science Internship keyword');

  // Structured Data
  const structuredDataFile = fs.readFileSync(
    path.join(__dirname, '../components/common/SiteStructuredData.tsx'),
    'utf-8'
  );
  assert.ok(structuredDataFile.includes("'Organization'"), 'Organization schema present');
  assert.ok(structuredDataFile.includes("'WebSite'"), 'WebSite schema present');
  assert.ok(structuredDataFile.includes("'BreadcrumbList'"), 'BreadcrumbList schema present');
  assert.ok(structuredDataFile.includes("'WebPage'"), 'Homepage WebPage schema present');
  assert.ok(pageFile.includes('openGraph:'), 'Homepage Open Graph metadata present');
  assert.ok(pageFile.includes('twitter:'), 'Homepage Twitter metadata present');
});
