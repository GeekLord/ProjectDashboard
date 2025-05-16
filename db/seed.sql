-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'project_manager') NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  `schema` JSON NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (username, password, role) VALUES (
  'Bishnu',
  '$2a$12$5.tQNGJfkkTCxw.FGJBoAeXPO/NO0vFBeXyp/XxUXpEJvuDZlKBU.', -- bcrypt hash of 'thakurabhiram@2'
  'admin'
);

-- Insert sample projects
INSERT INTO projects (name, description, created_by) VALUES
('Brick Kiln', 'Brick Kiln worker Survey', 1),
('Kris_MLA', 'Indian politicians views on democracy', 1),
('Vignesh_MLA', 'Vignesh MLA Survey', 1),
('Adam', 'Adam Survey', 1),
('Nikhitha_Academic', 'Nikhitha Academic Survey', 1),
('ECD', 'ECD Survey in Odisha', 1),
('Kompal', 'IndiQoL Survey for Kompal', 1),
('Rubina', 'Rubina Survey', 1);

-- Insert default forms for all projects
INSERT INTO forms (project_id, `schema`) VALUES
(1, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(2, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(3, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(4, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(5, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(6, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(7, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]'),
(8, '[{"name":"Date","label":"Date","type":"date","required":true},{"name":"State","label":"State","type":"dropdown","required":true,"options":["State1","State2"]},{"name":"Project_Manager","label":"Project Manager","type":"text","required":false},{"name":"School","label":"School","type":"text","required":false},{"name":"Total_Sample","label":"Total Sample","type":"number","required":false},{"name":"Total_Enumerator","label":"Total Enumerator","type":"number","required":false},{"name":"Productivity","label":"Productivity","type":"number","required":false},{"name":"Remaining_Sample","label":"Remaining Sample","type":"number","required":false},{"name":"Total_WTP","label":"Total WTP","type":"number","required":false},{"name":"Total_Lottey","label":"Total Lottey","type":"number","required":false},{"name":"Total_Completed","label":"Total Completed","type":"number","required":false},{"name":"Remark","label":"Remark","type":"textarea","required":false}]');

