-- dev data synthesized by gpt
-- sri balaji muruganandam - Sept 26th, 2023
-- from Ubuntu 25.04 - 10:04PM

-- Role
INSERT INTO main.home_role (role_id, role_name, role_description) VALUES
(1, 'Analyst', 'Entry level consultant focused on research and analysis.'),
(2, 'Consultant', 'Mid-level consultant delivering client solutions.'),
(3, 'Manager', 'Leads workstreams and manages client communication.'),
(4, 'Partner', 'Drives client relationships and firm growth.');

-- Person
INSERT INTO main.home_person (employee_id, role_id, first_name, last_name, email, hire_date, is_active) VALUES
(1, 1, 'Alice', 'Wong', 'alice.wong@firm.com', '2022-01-15', 1),
(2, 2, 'Bob', 'Smith', 'bob.smith@firm.com', '2021-03-01', 1),
(3, 2, 'Charlie', 'Patel', 'charlie.patel@firm.com', '2020-07-20', 1),
(4, 3, 'Diana', 'Lopez', 'diana.lopez@firm.com', '2019-09-05', 1),
(5, 4, 'Edward', 'Johnson', 'edward.johnson@firm.com', '2015-02-10', 1);

-- Project
INSERT INTO main.home_project (project_id, project_name, client_name, start_date, end_date) VALUES
(1, 'Digital Transformation', 'GlobalBank', '2023-01-01', '2023-06-30'),
(2, 'Cost Optimization', 'HealthCorp', '2023-02-15', '2023-08-15'),
(3, 'AI Strategy', 'RetailCo', '2023-03-01', '2023-09-30');

-- Engagement
INSERT INTO main.home_engagement (engagement_id, person_id, project_id, role_on_project, start_date, end_date) VALUES
(1, 1, 1, 'Analyst', '2023-01-01', '2023-06-30'),
(2, 2, 1, 'Consultant', '2023-01-01', '2023-06-30'),
(3, 3, 2, 'Consultant', '2023-02-15', '2023-08-15'),
(4, 4, 2, 'Manager', '2023-02-15', '2023-08-15'),
(5, 1, 3, 'Analyst', '2023-03-01', '2023-09-30');

-- Review
INSERT INTO main.home_review (review_id, person_id, engagement_id, overall_score, outcome, review_date) VALUES
(1, 1, 1, 4.2, 'Promising analyst, developing communication skills', '2023-07-01'),
(2, 2, 2, 4.5, 'Strong problem solving, recommended for promotion', '2023-07-01'),
(3, 3, 3, 3.8, 'Good technical work, needs stronger client presence', '2023-09-01'),
(4, 4, 4, 4.7, 'Excellent leadership, exceeded client expectations', '2023-09-01');

-- Rating_STD
INSERT INTO main.home_rating_std (category_id, category_name, weight) VALUES
(1, 'Client Impact', 0.3),
(2, 'Problem Solving', 0.3),
(3, 'Communication', 0.2),
(4, 'Leadership', 0.2);

-- Rating_Rating
INSERT INTO main.home_rating_rating (review_rating_id, review_id, category_id, score, comments) VALUES
(1, 1, 1, 4, 'Delivered strong analysis with minor gaps.'),
(2, 1, 2, 4, 'Good problem solving.'),
(3, 1, 3, 3, 'Needs improvement in presentations.'),
(4, 2, 1, 5, 'Client trusted him fully.'),
(5, 2, 2, 5, 'Creative problem solving.'),
(6, 2, 3, 4, 'Clear communicator.'),
(7, 2, 4, 4, 'Emerging leadership.'),
(8, 3, 1, 4, 'Delivered value to client.'),
(9, 3, 2, 3, 'Some technical errors.'),
(10, 3, 3, 3, 'Average communication.'),
(11, 4, 1, 5, 'Outstanding client impact.'),
(12, 4, 2, 5, 'Innovative solutions.'),
(13, 4, 3, 5, 'Crystal clear communication.'),
(14, 4, 4, 5, 'Strong leadership.');

-- Feedback_Source
INSERT INTO main.home_feedback_source (feedback_source_id, feedback_source_name) VALUES
(1, 'Peer'),
(2, 'Manager'),
(3, 'Client');

-- Feedback
INSERT INTO main.home_feedback (feedback_id, author_person_id, subject_person_id, engagement_id, feedback_source_id, strengths, areas_for_growth, submitted_at) VALUES
(1, 2, 1, 1, 2, 'Collaborative teammate', 'Could prepare slides faster', '2023-06-30'),
(2, 4, 2, 2, 3, 'Client loved working with him', 'Sometimes too detail heavy', '2023-06-30'),
(3, 2, 3, 3, 1, 'Supportive peer', 'Needs to speak up more', '2023-08-15'),
(4, 5, 4, 4, 3, 'Exceptional client handling', 'Work-life balance concern', '2023-08-15');

-- Utilization_Type
INSERT INTO main.home_utilization_type (utilization_type_id, utilization_type_name) VALUES
(1, 'Billable'),
(2, 'Non-Billable'),
(3, 'PTO'),
(4, 'Learning');

-- Utilization
INSERT INTO main.home_utilization (utilization_id, person_id, project_id, week_start_date, hours, utilization_type_id) VALUES
(1, 1, 1, '2023-03-06', 40, 1),
(2, 2, 1, '2023-03-06', 42, 1),
(3, 3, 2, '2023-04-03', 38, 1),
(4, 4, 2, '2023-04-03', 40, 1),
(5, 1, 3, '2023-05-01', 36, 1);

-- DevelopmentPlan
INSERT INTO main.home_developmentplan (plan_id, review_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- DevelopmentGoal
INSERT INTO main.home_developmentgoal (action_id, plan_id, goal_description, due_date, status) VALUES
(1, 1, 'Improve presentation skills', '2023-12-01', 'planned'),
(2, 2, 'Take on more client-facing roles', '2023-12-01', 'in_progress'),
(3, 3, 'Attend client communication workshop', '2023-12-01', 'planned'),
(4, 4, 'Mentor junior consultants', '2023-12-01', 'in_progress');
