-- ==============================================================
-- ScholarPulse AI - Database Schema & Data Dump (MySQL 8.0+)
-- Author: Vatsal Patel (https://github.com/vatsalpatel23)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS scholarship_portal;
USE scholarship_portal;

-- --------------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'student',
  `power` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- Table structure for `students`
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `stdid` INT NOT NULL AUTO_INCREMENT,
  `stdname` VARCHAR(100) NOT NULL,
  `collegeName` VARCHAR(255) DEFAULT NULL,
  `stdpercent` INT DEFAULT NULL,
  `stdincome` INT DEFAULT NULL,
  `stdgender` VARCHAR(45) NOT NULL,
  `education` INT DEFAULT NULL,
  `caste` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stdid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- Table structure for `sclrinfo`
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `sclrinfo`;
CREATE TABLE `sclrinfo` (
  `sclrid` INT NOT NULL AUTO_INCREMENT,
  `sclrname` VARCHAR(255) NOT NULL,
  `percentreeq` INT DEFAULT NULL,
  `miniincome` INT DEFAULT NULL,
  `gender` VARCHAR(45) DEFAULT NULL,
  `educationqualifiation` INT DEFAULT NULL,
  `caste` VARCHAR(45) DEFAULT NULL,
  `amount` VARCHAR(100) DEFAULT NULL,
  `application_link` VARCHAR(500) DEFAULT NULL,
  `deadline` VARCHAR(45) DEFAULT NULL,
  `draft` INT DEFAULT 0,
  `provider` VARCHAR(150) DEFAULT 'Scholarship Foundation',
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`sclrid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- Seed Data: Demo Users
-- Admin: admin@scholarpulse.com (password: admin123)
-- Student: vatsal@scholarpulse.com (password: student123)
-- --------------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password`, `role`, `power`) VALUES
('Administrator', 'admin@scholarpulse.com', 'scrypt:32768:8:1$u7h50B3QG0x1uG9b$bb51bc573a62886c52a0a3901ca9f847528e5ee6006f71d5b3531bcf9ceb0b2e353e83bfe155a80572e9d240e1b21217c062776c5f78ecfe10efc7793dcaab55', 'admin', 1),
('Vatsal Patel', 'vatsal@scholarpulse.com', 'scrypt:32768:8:1$7e90K74mH7B1lF5c$16e1c2a0db8a67d0f983636f8daec3e6a2b8e390c5fe56fa39fbfb6bc21e6eb6b29d472c29bc96fa996c5e7b51b3a6ef532bfaee39218d6e9ea4c7595ea11a54', 'student', 0);

-- --------------------------------------------------------------
-- Seed Data: Scholarships Catalog
-- --------------------------------------------------------------
INSERT INTO `sclrinfo` (`sclrname`, `percentreeq`, `miniincome`, `gender`, `educationqualifiation`, `caste`, `amount`, `application_link`, `deadline`, `draft`, `provider`, `description`) VALUES
('Tata Capital Pankh Scholarship', 60, 250000, NULL, 11, NULL, 'Up to ₹80,000', 'https://www.tatacapital.com/scholarship-program.html', '26-12-2027', 0, 'Tata Capital Ltd', 'Empowering high-school and undergraduate students from economically challenged backgrounds.'),
('HDFC Bank Parivartan ECS Scheme', 55, 250000, NULL, NULL, NULL, 'Up to ₹75,000', 'https://www.hdfcbankecss.com', '31-12-2027', 0, 'HDFC Bank Foundation', 'Financial assistance for meritorious school and college students overcoming socio-economic constraints.'),
('Reliance Foundation Undergraduate Scholarships', 60, 150000, NULL, 12, NULL, 'Up to ₹2,00,000', 'https://scholarships.reliancefoundation.org', '30-11-2027', 0, 'Reliance Foundation', 'Merit-cum-means scholarship supporting ambitious students pursuing first-year degree programs.'),
('Santoor Women Scholarship (Wipro)', 45, 100000, 'Female', 12, NULL, '₹24,000 / year', 'https://www.santoorscholarships.com', '31-10-2027', 0, 'Wipro Consumer Care', 'Encouraging young women from underprivileged backgrounds to pursue higher education.'),
('LIC Golden Jubilee Scholarship Scheme', 60, 250000, NULL, 12, NULL, '₹20,000 / year', 'https://licindia.in', '31-12-2027', 0, 'Life Insurance Corporation of India', 'Supporting economically weaker students pursuing medicine, engineering, or degree courses.'),
('Post-Matric Scholarship for Minority Communities', 50, 200000, NULL, NULL, 'Minority', 'Full Tuition Fees', 'https://scholarships.gov.in', '31-10-2027', 0, 'Ministry of Minority Affairs', 'Centrally sponsored scholarship scheme assisting minority students in secondary and tertiary education.'),
('Savitribai Phule Special Girls Fellowship', 45, 300000, 'Female', NULL, 'OBC', '₹12,000 / year', 'https://mahadbt.maharashtra.gov.in', '31-03-2027', 0, 'Government of Maharashtra', 'Financial incentive program for OBC girl students pursuing secondary & higher secondary qualifications.'),
('Begum Hazrat Mahal National Scholarship', 50, 200000, 'Female', NULL, 'Minority', '₹6,000 - ₹12,000 / year', 'https://scholarships.gov.in', '31-10-2027', 0, 'Maulana Azad Education Foundation', 'Targeted fellowship for meritorious female students belonging to recognized minority communities.'),
('L\'Oréal India For Young Women In Science', 85, 600000, 'Female', 12, NULL, '₹2,50,000 grant', 'https://www.loreal.com/en/india/', '15-07-2027', 0, 'L\'Oréal India', 'Prestigious national grant dedicated to empowering women pursuing STEM and natural science disciplines.'),
('Kotak Kanya Scholarship Program', 75, 600000, 'Female', 12, NULL, 'Up to ₹1,50,000 / year', 'https://www.buddy4study.com/page/kotak-kanya-scholarship', '15-12-2027', 0, 'Kotak Education Foundation', 'Comprehensive financial assistance for high-potential female students pursuing professional degrees.'),
('Post-Matric Scholarship for SC Candidates', 45, 250000, NULL, NULL, 'SC', 'Complete Tuition + Maintenance', 'https://scholarships.gov.in', '31-10-2027', 0, 'Ministry of Social Justice and Empowerment', 'Comprehensive tuition and academic support for Scheduled Caste students post-matriculation.'),
('Post-Matric Scholarship for ST Candidates', 45, 250000, NULL, NULL, 'ST', 'Complete Tuition Fee Reimbursement', 'https://scholarships.gov.in', '31-10-2027', 0, 'Ministry of Tribal Affairs', 'Government grant covering compulsory fees and monthly maintenance for Scheduled Tribe students.'),
('OBC Post-Matric State Educational Grant', 45, 250000, NULL, NULL, 'OBC', 'Tuition & Exam Fees', 'https://scholarships.gov.in', '31-10-2027', 0, 'State Social Welfare Department', 'State government initiative supporting Other Backward Class students across diverse faculties.'),
('Merit-cum-Means Scholarship for Professional Studies', 50, 250000, NULL, 12, 'Minority', '₹20,000 / year', 'https://scholarships.gov.in', '31-10-2027', 0, 'National Scholarship Portal', 'Financial aid to deserving students pursuing undergraduate or postgraduate technical courses.'),
('National Fellowship for Higher Education (ST)', 50, 600000, NULL, 12, 'ST', '₹31,000 / month + Contingency', 'https://fellowships.gov.in', '31-01-2028', 0, 'Ministry of Tribal Affairs', 'High-tier research and degree fellowship for Scheduled Tribe candidates.'),
('Sitaram Jindal Foundation Scholarship', 60, 250000, NULL, NULL, NULL, 'Up to ₹3,200 / month', 'https://www.sitaramjindalfoundation.org', '31-12-2027', 0, 'Sitaram Jindal Foundation', 'Open merit-based fellowship available throughout the academic year for secondary and degree students.');
