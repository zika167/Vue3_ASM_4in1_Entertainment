-- =====================================================
-- IMPROVED DATABASE SCHEMA WITH COMMENT TABLE
-- Database: java4_db_asm (MariaDB)
-- =====================================================

-- Drop existing tables if they exist (for clean deployment)
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Share;
DROP TABLE IF EXISTS Favorite;
DROP TABLE IF EXISTS Video;
DROP TABLE IF EXISTS `User`;

-- =====================================================
-- TABLE: `User`
-- Description: Stores user account information
-- =====================================================
CREATE TABLE `User` (
    Id          VARCHAR(50) PRIMARY KEY,
    Password    VARCHAR(255) NOT NULL,
    Email       VARCHAR(100) NOT NULL UNIQUE,
    Fullname    VARCHAR(100) NOT NULL,
    Admin       BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME NULL ON UPDATE CURRENT_TIMESTAMP  -- ✨ CẢI THIỆN: Auto update
);

-- =====================================================
-- TABLE: Video
-- Description: Stores video information
-- =====================================================
CREATE TABLE Video (
    Id          VARCHAR(50) PRIMARY KEY,
    Title       VARCHAR(255) NOT NULL,
    Poster      VARCHAR(500) NULL,
    Views       INT NOT NULL DEFAULT 0,
    Description LONGTEXT NULL,
    Active      BOOLEAN NOT NULL DEFAULT TRUE,
    UserId      VARCHAR(50) NULL,               -- ✨ THÊM: Uploaded by user
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,  -- ✨ CẢI THIỆN: Auto update
    FOREIGN KEY (UserId) REFERENCES `User`(Id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE: Favorite
-- Description: Stores user's favorite videos
-- =====================================================
CREATE TABLE Favorite (
    Id       BIGINT PRIMARY KEY AUTO_INCREMENT,
    UserId   VARCHAR(50) NOT NULL,
    VideoId  VARCHAR(50) NOT NULL,
    LikeDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (UserId, VideoId),
    FOREIGN KEY (UserId) REFERENCES `User`(Id) ON DELETE CASCADE,
    FOREIGN KEY (VideoId) REFERENCES Video(Id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: Share
-- Description: Stores video sharing information
-- =====================================================
CREATE TABLE Share (
    Id        BIGINT PRIMARY KEY AUTO_INCREMENT,
    UserId    VARCHAR(50) NOT NULL,
    VideoId   VARCHAR(50) NOT NULL,
    Emails    LONGTEXT NOT NULL,
    ShareDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES `User`(Id) ON DELETE CASCADE,
    FOREIGN KEY (VideoId) REFERENCES Video(Id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE: Comment (✨ MỚI)
-- Description: Stores user comments on videos
-- =====================================================
CREATE TABLE Comment (
    Id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    UserId      VARCHAR(50) NOT NULL,
    VideoId     VARCHAR(50) NOT NULL,
    Content     LONGTEXT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES `User`(Id) ON DELETE CASCADE,
    FOREIGN KEY (VideoId) REFERENCES Video(Id) ON DELETE CASCADE
);

-- =====================================================
-- CREATE INDEXES FOR BETTER QUERY PERFORMANCE
-- =====================================================
-- User indexes
CREATE INDEX IX_User_Email ON `User`(Email);

-- Video indexes
CREATE INDEX IX_Video_Active ON Video(Active);
CREATE INDEX IX_Video_UserId ON Video(UserId);
CREATE INDEX IX_Video_Views ON Video(Views);  -- ✨ THÊM: Cho query popular videos

-- Favorite indexes
CREATE INDEX IX_Favorite_UserId ON Favorite(UserId);
CREATE INDEX IX_Favorite_VideoId ON Favorite(VideoId);
CREATE INDEX IX_Favorite_LikeDate ON Favorite(LikeDate);  -- ✨ THÊM: Cho query recent favorites

-- Share indexes
CREATE INDEX IX_Share_UserId ON Share(UserId);
CREATE INDEX IX_Share_VideoId ON Share(VideoId);
CREATE INDEX IX_Share_ShareDate ON Share(ShareDate);  -- ✨ THÊM: Cho query recent shares

-- Comment indexes (✨ MỚI)
CREATE INDEX IX_Comment_UserId ON Comment(UserId);
CREATE INDEX IX_Comment_VideoId ON Comment(VideoId);
CREATE INDEX IX_Comment_CreatedDate ON Comment(CreatedDate);
