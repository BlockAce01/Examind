-- User Related Tables
CREATE TABLE public."User"
(
    "UserID" serial NOT NULL,
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Email" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Password" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Points" integer DEFAULT 0,
    "Badges" text COLLATE pg_catalog."default",
    "SubscriptionStatus" character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'free'::character varying,
    "Role" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID"),
    CONSTRAINT user_email_unique UNIQUE ("Email")
);

CREATE TABLE public."Badge"
(
    "BadgeID" serial NOT NULL,
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "IconURL" character varying(2048) COLLATE pg_catalog."default",
    "Tier" character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT "Badge_pkey" PRIMARY KEY ("BadgeID")
);

CREATE TABLE public."UserBadge"
(
    "UserBadgeID" serial NOT NULL,
    "UserID" integer NOT NULL,
    "BadgeID" integer NOT NULL,
    "EarnedDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("UserBadgeID")
);

-- Subject Related Tables
CREATE TABLE public."Subject"
(
    "SubjectID" serial NOT NULL,
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    CONSTRAINT "Subject_pkey" PRIMARY KEY ("SubjectID")
);

CREATE TABLE public."StudentSubject"
(
    "UserID" integer NOT NULL,
    "SubjectID" integer NOT NULL,
    CONSTRAINT "StudentSubject_pkey" PRIMARY KEY ("UserID", "SubjectID")
);

CREATE TABLE public."TeacherSubject"
(
    "UserID" integer NOT NULL,
    "SubjectID" integer NOT NULL,
    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("UserID", "SubjectID")
);

-- Quiz Related Tables
CREATE TABLE public."Quiz"
(
    "QuizID" serial NOT NULL,
    "Title" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Subject" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "DifficultyLevel" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "TimeLimit" integer NOT NULL,
    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("QuizID")
);

CREATE TABLE public."Question"
(
    "QuestionID" serial NOT NULL,
    "QuizID" integer NOT NULL,
    "Text" text COLLATE pg_catalog."default" NOT NULL,
    "Options" text[] COLLATE pg_catalog."default" NOT NULL,
    "CorrectAnswerIndex" integer NOT NULL,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("QuestionID")
);

CREATE TABLE public."Takes"
(
    "UserID" integer NOT NULL,
    "QuizID" integer NOT NULL,
    "MarksObtained" integer NOT NULL,
    "SubmissionTime" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT takes_pkey PRIMARY KEY ("UserID", "QuizID")
);

CREATE TABLE "UserAnswers" (
    "UserID" INT NOT NULL,
    "QuizID" INT NOT NULL,
    "QuestionID" INT NOT NULL,
    "SubmittedAnswerIndex" INT,
    "SubmissionTime" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("UserID", "QuizID", "QuestionID")
);

-- Discussion Related Tables
CREATE TABLE public."DiscussionForum"
(
    "ForumID" serial NOT NULL,
    "Topic" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "PostCount" integer DEFAULT 0,
    "LastActivity" timestamp with time zone,
    "CreatorUserID" integer,
    "SubjectID" integer,
    CONSTRAINT "DiscussionForum_pkey" PRIMARY KEY ("ForumID")
);

CREATE TABLE public."Comment"
(
    "CommentID" serial NOT NULL,
    "ForumID" integer NOT NULL,
    "UserID" integer NOT NULL,
    "Content" text COLLATE pg_catalog."default" NOT NULL,
    "Upvotes" integer DEFAULT 0,
    "Date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "ParentCommentID" integer,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("CommentID")
);

CREATE TABLE public."CommentUpvotes" (
    "CommentID" integer NOT NULL,
    "UserID" integer NOT NULL,
    "UpvoteDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentUpvotes_pkey" PRIMARY KEY ("CommentID", "UserID")
);

-- Challenge and Reward Related Tables
CREATE TABLE public."Challenge"
(
    "ChallengeID" serial NOT NULL,
    "Type" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Subject" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Title" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "PointsReward" integer NOT NULL DEFAULT 0,
    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("ChallengeID")
);

CREATE TABLE public."Reward"
(
    "RewardID" serial NOT NULL,
    "Name" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "PointsRequired" integer NOT NULL DEFAULT 0,
    "AvailabilityStatus" character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'available'::character varying,
    "Type" character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'general'::character varying,
    CONSTRAINT "Reward_pkey" PRIMARY KEY ("RewardID")
);

CREATE TABLE public."Participate"
(
    "UserID" integer NOT NULL,
    "ChallengeID" integer NOT NULL,
    "CompletionStatus" character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::character varying,
    "CompletedDate" timestamp with time zone,
    CONSTRAINT "Participate_pkey" PRIMARY KEY ("UserID", "ChallengeID")
);

CREATE TABLE public."Earn"
(
    "EarnID" serial NOT NULL,
    "UserID" integer NOT NULL,
    "RewardID" integer NOT NULL,
    "ChallengeID" integer,
    "RedemptionDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Earn_pkey" PRIMARY KEY ("EarnID")
);

-- Resource Related Tables
CREATE TABLE public."Resource"
(
    "ResourceID" serial NOT NULL,
    "Title" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "Type" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "Subject" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "FileURL" character varying(2048) COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "UploadedDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UploaderUserID" integer,
    "Year" integer,
    CONSTRAINT "Resource_pkey" PRIMARY KEY ("ResourceID")
);

CREATE TABLE public."Access"
(
    "AccessID" serial NOT NULL,
    "UserID" integer NOT NULL,
    "ResourceID" integer NOT NULL,
    "AccessDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessID")
);


-- Foreign Key Constraints

-- User Related
ALTER TABLE public."UserBadge"
    ADD CONSTRAINT "UserBadge_UserID_fkey" FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT "UserBadge_BadgeID_fkey" FOREIGN KEY ("BadgeID")
    REFERENCES public."Badge" ("BadgeID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

-- Subject Related
ALTER TABLE public."StudentSubject"
    ADD CONSTRAINT "StudentSubject_UserID_fkey" FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT "StudentSubject_SubjectID_fkey" FOREIGN KEY ("SubjectID")
    REFERENCES public."Subject" ("SubjectID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE public."TeacherSubject"
    ADD CONSTRAINT "TeacherSubject_UserID_fkey" FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT "TeacherSubject_SubjectID_fkey" FOREIGN KEY ("SubjectID")
    REFERENCES public."Subject" ("SubjectID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

-- Quiz Related
ALTER TABLE public."Question"
    ADD CONSTRAINT question_quizid_foreign FOREIGN KEY ("QuizID")
    REFERENCES public."Quiz" ("QuizID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE public."Takes"
    ADD CONSTRAINT takes_quizid_foreign FOREIGN KEY ("QuizID")
    REFERENCES public."Quiz" ("QuizID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT takes_userid_foreign FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE "UserAnswers"
    ADD FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE CASCADE,
    ADD FOREIGN KEY ("QuizID") REFERENCES "Quiz"("QuizID") ON DELETE CASCADE,
    ADD FOREIGN KEY ("QuestionID") REFERENCES "Question"("QuestionID") ON DELETE CASCADE;

-- Discussion Related
ALTER TABLE public."DiscussionForum"
    ADD CONSTRAINT forum_creator_userid_foreign FOREIGN KEY ("CreatorUserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL,
    ADD CONSTRAINT "DiscussionForum_SubjectID_fkey" FOREIGN KEY ("SubjectID")
    REFERENCES public."Subject" ("SubjectID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL;

ALTER TABLE public."Comment"
    ADD CONSTRAINT comment_forumid_foreign FOREIGN KEY ("ForumID")
    REFERENCES public."DiscussionForum" ("ForumID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT comment_parent_commentid_foreign FOREIGN KEY ("ParentCommentID")
    REFERENCES public."Comment" ("CommentID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT comment_userid_foreign FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE public."CommentUpvotes"
    ADD CONSTRAINT "CommentUpvotes_CommentID_fkey" FOREIGN KEY ("CommentID")
    REFERENCES public."Comment" ("CommentID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT "CommentUpvotes_UserID_fkey" FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

-- Challenge and Reward Related
ALTER TABLE public."Participate"
    ADD CONSTRAINT participate_challengeid_foreign FOREIGN KEY ("ChallengeID")
    REFERENCES public."Challenge" ("ChallengeID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT participate_userid_foreign FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE public."Earn"
    ADD CONSTRAINT earn_rewardid_foreign FOREIGN KEY ("RewardID")
    REFERENCES public."Reward" ("RewardID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT earn_userid_foreign FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT earn_challengeid_foreign FOREIGN KEY ("ChallengeID")
    REFERENCES public."Challenge" ("ChallengeID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

-- Resource Related
ALTER TABLE public."Resource"
    ADD CONSTRAINT resource_uploader_userid_foreign FOREIGN KEY ("UploaderUserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL;

ALTER TABLE public."Access"
    ADD CONSTRAINT access_resourceid_foreign FOREIGN KEY ("ResourceID")
    REFERENCES public."Resource" ("ResourceID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
    ADD CONSTRAINT access_userid_foreign FOREIGN KEY ("UserID")
    REFERENCES public."User" ("UserID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comment_forumid
    ON public."Comment"("ForumID");
CREATE INDEX IF NOT EXISTS idx_comment_userid
    ON public."Comment"("UserID");
CREATE INDEX IF NOT EXISTS idx_question_quizid
    ON public."Question"("QuizID");
CREATE INDEX IF NOT EXISTS idx_takes_quizid
    ON public."Takes"("QuizID");
CREATE INDEX IF NOT EXISTS idx_takes_userid
    ON public."Takes"("UserID");
CREATE INDEX "idx_useranswers_quiz_user" ON "UserAnswers" ("QuizID", "UserID");
CREATE INDEX "idx_useranswers_question" ON "UserAnswers" ("QuestionID");
CREATE INDEX IF NOT EXISTS idx_commentupvotes_commentid
    ON public."CommentUpvotes"("CommentID");
CREATE INDEX IF NOT EXISTS idx_commentupvotes_userid
    ON public."CommentUpvotes"("UserID");
CREATE INDEX IF NOT EXISTS idx_userbadge_userid
    ON public."UserBadge"("UserID");
CREATE INDEX IF NOT EXISTS idx_userbadge_badgeid
    ON public."UserBadge"("BadgeID");
