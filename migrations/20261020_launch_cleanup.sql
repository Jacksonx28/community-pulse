-- Owner explicitly confirmed clearing all pre-launch profiles and activity.
-- Personal accounts and Supabase authentication are preserved.
-- Private backups are not queried by the application.
-- This migration runs once; do not rename or recreate it after application.
CREATE TABLE launch_backup_20261020_communities AS SELECT * FROM communities;
CREATE TABLE launch_backup_20261020_collaborations AS SELECT * FROM collaborations;
CREATE TABLE launch_backup_20261020_project_team AS SELECT * FROM project_team;
CREATE TABLE launch_backup_20261020_project_cm_contacts AS SELECT * FROM project_cm_contacts;
CREATE TABLE launch_backup_20261020_request_reads AS SELECT * FROM request_reads;
CREATE TABLE launch_backup_20261020_profile_reports AS SELECT * FROM profile_reports;

DELETE FROM request_reads;
DELETE FROM profile_reports;
DELETE FROM project_team;
DELETE FROM project_cm_contacts;
DELETE FROM collaborations;
DELETE FROM communities;
