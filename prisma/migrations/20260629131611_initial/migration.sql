-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('SUMMARY', 'SKILLS', 'EXPERIENCE', 'EDUCATION', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES', 'AWARDS', 'REFERENCES', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE');

-- CreateEnum
CREATE TYPE "WorkModel" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "PageFormat" AS ENUM ('A4', 'LETTER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "role" "Role" DEFAULT 'user',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "aiCredits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    "activeOrganizationId" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twoFactor" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT true,
    "failedVerificationCount" INTEGER DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),

    CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3),
    "aaguid" TEXT,

    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "metadata" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculumVitae" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled CV',
    "templateId" TEXT NOT NULL DEFAULT 'classic',
    "pageFormat" "PageFormat" NOT NULL DEFAULT 'A4',
    "language" TEXT NOT NULL DEFAULT 'en-GB',
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/YYYY',
    "fontFamily" TEXT NOT NULL DEFAULT 'serif',
    "fontScale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "spacingScale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "accentColor" TEXT NOT NULL DEFAULT '#1f2937',
    "contentWidth" TEXT NOT NULL DEFAULT 'standard',
    "showDividers" BOOLEAN NOT NULL DEFAULT true,
    "headingStyle" TEXT NOT NULL DEFAULT 'normal',
    "headingWeight" TEXT NOT NULL DEFAULT 'bold',
    "showSectionIcons" BOOLEAN NOT NULL DEFAULT false,
    "footer" TEXT,
    "headerLayout" TEXT NOT NULL DEFAULT 'stacked',
    "entryStyle" TEXT NOT NULL DEFAULT 'bullet',
    "showEntryDates" BOOLEAN NOT NULL DEFAULT true,
    "showEntryLocation" BOOLEAN NOT NULL DEFAULT true,
    "showPhoto" BOOLEAN NOT NULL DEFAULT false,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "shareId" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculumVitae_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalDetails" (
    "id" TEXT NOT NULL,
    "curriculumVitaeId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "jobTitle" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "photoUrl" TEXT,
    "nationality" TEXT,
    "links" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculumVitaeSection" (
    "id" TEXT NOT NULL,
    "curriculumVitaeId" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculumVitaeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experienceEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "bullets" TEXT[],
    "order" INTEGER NOT NULL,

    CONSTRAINT "experienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educationEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "educationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,
    "description" TEXT,
    "technologies" TEXT[],
    "order" INTEGER NOT NULL,

    CONSTRAINT "projectEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skillGroup" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "skills" TEXT[],
    "order" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "skillGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificationEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "issueDate" TEXT,
    "expiryDate" TEXT,
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "certificationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languageEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proficiency" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "languageEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awardEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT,
    "date" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "awardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referenceEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "referenceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customEntry" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "link" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "location" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "customEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculumVitaeSnapshot" (
    "id" TEXT NOT NULL,
    "curriculumVitaeId" TEXT NOT NULL,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculumVitaeSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coverLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "curriculumVitaeId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Untitled Cover Letter',
    "fullName" TEXT NOT NULL DEFAULT '',
    "professionalTitle" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "recipientName" TEXT,
    "companyName" TEXT,
    "body" TEXT NOT NULL DEFAULT '',
    "fontFamily" TEXT NOT NULL DEFAULT 'serif',
    "templateId" TEXT NOT NULL DEFAULT 'classic',
    "accentColor" TEXT NOT NULL DEFAULT '#1f2937',
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT,
    "jobUrl" TEXT,
    "description" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'WISHLIST',
    "order" INTEGER NOT NULL DEFAULT 0,
    "curriculumVitaeId" TEXT,
    "coverLetterId" TEXT,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3),
    "followUpAt" TIMESTAMP(3),
    "interviewAt" TIMESTAMP(3),
    "companyWebsite" TEXT,
    "companyDescription" TEXT,
    "employmentType" "EmploymentType",
    "workModel" "WorkModel",
    "source" TEXT,
    "skills" TEXT[],
    "color" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobContact" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "linkedInUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobTimelineEvent" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobTimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobInterview" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "round" TEXT NOT NULL,
    "title" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER,
    "location" TEXT,
    "meetingLink" TEXT,
    "interviewers" TEXT[],
    "notes" TEXT,
    "feedback" TEXT,
    "type" TEXT NOT NULL DEFAULT 'video',
    "order" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobOffer" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT,
    "equityInfo" TEXT,
    "bonusInfo" TEXT,
    "benefits" TEXT[],
    "deadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savedSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendarConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "calendarId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendarConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "rawText" TEXT,
    "parsedData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "curriculumVitaeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "importJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aiGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "curriculumVitaeId" TEXT,
    "tokensIn" INTEGER NOT NULL DEFAULT 0,
    "tokensOut" INTEGER NOT NULL DEFAULT 0,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aiGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "twoFactor_secret_idx" ON "twoFactor"("secret");

-- CreateIndex
CREATE INDEX "twoFactor_userId_idx" ON "twoFactor"("userId");

-- CreateIndex
CREATE INDEX "passkey_userId_idx" ON "passkey"("userId");

-- CreateIndex
CREATE INDEX "passkey_credentialID_idx" ON "passkey"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "member_organizationId_idx" ON "member"("organizationId");

-- CreateIndex
CREATE INDEX "member_userId_idx" ON "member"("userId");

-- CreateIndex
CREATE INDEX "invitation_organizationId_idx" ON "invitation"("organizationId");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "curriculumVitae_shareId_key" ON "curriculumVitae"("shareId");

-- CreateIndex
CREATE INDEX "curriculumVitae_userId_idx" ON "curriculumVitae"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personalDetails_curriculumVitaeId_key" ON "personalDetails"("curriculumVitaeId");

-- CreateIndex
CREATE INDEX "curriculumVitaeSection_curriculumVitaeId_order_idx" ON "curriculumVitaeSection"("curriculumVitaeId", "order");

-- CreateIndex
CREATE INDEX "experienceEntry_sectionId_order_idx" ON "experienceEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "educationEntry_sectionId_order_idx" ON "educationEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "projectEntry_sectionId_order_idx" ON "projectEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "skillGroup_sectionId_order_idx" ON "skillGroup"("sectionId", "order");

-- CreateIndex
CREATE INDEX "certificationEntry_sectionId_order_idx" ON "certificationEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "languageEntry_sectionId_order_idx" ON "languageEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "awardEntry_sectionId_order_idx" ON "awardEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "referenceEntry_sectionId_order_idx" ON "referenceEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "customEntry_sectionId_order_idx" ON "customEntry"("sectionId", "order");

-- CreateIndex
CREATE INDEX "curriculumVitaeSnapshot_curriculumVitaeId_idx" ON "curriculumVitaeSnapshot"("curriculumVitaeId");

-- CreateIndex
CREATE INDEX "coverLetter_userId_idx" ON "coverLetter"("userId");

-- CreateIndex
CREATE INDEX "coverLetter_curriculumVitaeId_idx" ON "coverLetter"("curriculumVitaeId");

-- CreateIndex
CREATE INDEX "jobApplication_userId_status_idx" ON "jobApplication"("userId", "status");

-- CreateIndex
CREATE INDEX "jobApplication_userId_archived_idx" ON "jobApplication"("userId", "archived");

-- CreateIndex
CREATE INDEX "jobApplication_curriculumVitaeId_idx" ON "jobApplication"("curriculumVitaeId");

-- CreateIndex
CREATE INDEX "jobApplication_coverLetterId_idx" ON "jobApplication"("coverLetterId");

-- CreateIndex
CREATE INDEX "jobContact_jobApplicationId_idx" ON "jobContact"("jobApplicationId");

-- CreateIndex
CREATE INDEX "jobContact_userId_idx" ON "jobContact"("userId");

-- CreateIndex
CREATE INDEX "jobTimelineEvent_jobApplicationId_idx" ON "jobTimelineEvent"("jobApplicationId");

-- CreateIndex
CREATE INDEX "jobTimelineEvent_userId_eventDate_idx" ON "jobTimelineEvent"("userId", "eventDate");

-- CreateIndex
CREATE INDEX "jobInterview_jobApplicationId_idx" ON "jobInterview"("jobApplicationId");

-- CreateIndex
CREATE INDEX "jobOffer_jobApplicationId_idx" ON "jobOffer"("jobApplicationId");

-- CreateIndex
CREATE INDEX "savedSearch_userId_idx" ON "savedSearch"("userId");

-- CreateIndex
CREATE INDEX "calendarConnection_userId_idx" ON "calendarConnection"("userId");

-- CreateIndex
CREATE INDEX "importJob_userId_status_idx" ON "importJob"("userId", "status");

-- CreateIndex
CREATE INDEX "aiGeneration_userId_createdAt_idx" ON "aiGeneration"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeCustomerId_key" ON "subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeSubscriptionId_key" ON "subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculumVitae" ADD CONSTRAINT "curriculumVitae_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalDetails" ADD CONSTRAINT "personalDetails_curriculumVitaeId_fkey" FOREIGN KEY ("curriculumVitaeId") REFERENCES "curriculumVitae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculumVitaeSection" ADD CONSTRAINT "curriculumVitaeSection_curriculumVitaeId_fkey" FOREIGN KEY ("curriculumVitaeId") REFERENCES "curriculumVitae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experienceEntry" ADD CONSTRAINT "experienceEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educationEntry" ADD CONSTRAINT "educationEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectEntry" ADD CONSTRAINT "projectEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skillGroup" ADD CONSTRAINT "skillGroup_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificationEntry" ADD CONSTRAINT "certificationEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languageEntry" ADD CONSTRAINT "languageEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awardEntry" ADD CONSTRAINT "awardEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referenceEntry" ADD CONSTRAINT "referenceEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customEntry" ADD CONSTRAINT "customEntry_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "curriculumVitaeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculumVitaeSnapshot" ADD CONSTRAINT "curriculumVitaeSnapshot_curriculumVitaeId_fkey" FOREIGN KEY ("curriculumVitaeId") REFERENCES "curriculumVitae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coverLetter" ADD CONSTRAINT "coverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coverLetter" ADD CONSTRAINT "coverLetter_curriculumVitaeId_fkey" FOREIGN KEY ("curriculumVitaeId") REFERENCES "curriculumVitae"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplication" ADD CONSTRAINT "jobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplication" ADD CONSTRAINT "jobApplication_curriculumVitaeId_fkey" FOREIGN KEY ("curriculumVitaeId") REFERENCES "curriculumVitae"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplication" ADD CONSTRAINT "jobApplication_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES "coverLetter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobContact" ADD CONSTRAINT "jobContact_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "jobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobContact" ADD CONSTRAINT "jobContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobTimelineEvent" ADD CONSTRAINT "jobTimelineEvent_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "jobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobTimelineEvent" ADD CONSTRAINT "jobTimelineEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobInterview" ADD CONSTRAINT "jobInterview_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "jobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobOffer" ADD CONSTRAINT "jobOffer_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "jobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedSearch" ADD CONSTRAINT "savedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendarConnection" ADD CONSTRAINT "calendarConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "importJob" ADD CONSTRAINT "importJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aiGeneration" ADD CONSTRAINT "aiGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
