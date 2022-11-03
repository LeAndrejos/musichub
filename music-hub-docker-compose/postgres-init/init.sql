CREATE DATABASE MusicHub;

GRANT ALL PRIVILEGES ON DATABASE MusicHub to musichubpsql;
grant all on schema public to public;
GRANT CONNECT ON DATABASE MusicHub TO musichubpsql;
GRANT USAGE ON SCHEMA public TO musichubpsql;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO musichubpsql;

CREATE TABLE IF NOT EXISTS users (
    user_id uuid NOT NULL,
	username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role varchar(255) NOT NULL,
    PRIMARY KEY(user_id)
);


CREATE TABLE IF NOT EXISTS chats (
    chat_id uuid NOT NULL,
    first_user_id uuid NOT NULL,
    second_user_id uuid NOT NULL,
    PRIMARY KEY(chat_id),
    	CONSTRAINT fkUser
    	  FOREIGN KEY(first_user_id)
    	    REFERENCES users,
    	CONSTRAINT fkUser2
          FOREIGN KEY(second_user_id)
            REFERENCES users
);

CREATE TABLE IF NOT EXISTS messages (
    message_id uuid NOT NULL,
    sender_id uuid NOT NULL,
	recipient_id uuid NOT NULL,
    content varchar(255) NOT NULL,
    date timestamp NOT NULL,
    PRIMARY KEY(message_id),
    	CONSTRAINT fkSender
          FOREIGN KEY(sender_id)
            REFERENCES users,
		CONSTRAINT fkRecipient
		  FOREIGN KEY(recipient_id)
		    REFERENCES users
);

CREATE TABLE IF NOT EXISTS chatattachmentsections (
    chat_attachment_section_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    section_name varchar(255) NOT NULL,
    PRIMARY KEY(chat_attachment_section_id),
    	CONSTRAINT fkChat
    	  FOREIGN KEY(chat_id)
    	    REFERENCES chats
);

CREATE TABLE IF NOT EXISTS chatattachments (
    chat_attachment_id uuid NOT NULL,
    chat_attachment_section_id uuid NOT NULL,
    attachment_name varchar(255) NOT NULL,
    PRIMARY KEY(chat_attachment_id),
    	CONSTRAINT fkChatSection
    	  FOREIGN KEY(chat_attachment_section_id)
    	    REFERENCES chatattachmentsections
);

CREATE TABLE IF NOT EXISTS courses (
    course_id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    avatar varchar(255) NOT NULL,
	is_full_course BOOLEAN NOT NULL,
    PRIMARY KEY(course_id),
    	CONSTRAINT fkUser
    	  FOREIGN KEY(teacher_id)
    	    REFERENCES users
);

CREATE TABLE IF NOT EXISTS coursetousers (
    course_to_user_id uuid NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    PRIMARY KEY(course_to_user_id),
    	CONSTRAINT fkUser
    	  FOREIGN KEY(user_id)
    	    REFERENCES users,
    	CONSTRAINT fkCourse
          FOREIGN KEY(course_id)
            REFERENCES courses
);

CREATE TABLE IF NOT EXISTS sections (
    section_id uuid NOT NULL,
    section_name varchar(255) NOT NULL,
    num_order int NOT NULL,
    description varchar(255) NOT NULL,
    course_id uuid NOT NULL,
	parent_section_id uuid,
    PRIMARY KEY(section_id),
    	CONSTRAINT fkCourse
          FOREIGN KEY(course_id)
            REFERENCES courses,
		CONSTRAINT fkSection
		  FOREIGN KEY (parent_section_id)
		    REFERENCES sections
);

CREATE TABLE IF NOT EXISTS attachments (
    attachment_id uuid NOT NULL,
    content varchar(255) NOT NULL,
    section_id uuid NOT NULL,
    type varchar(255) NOT NULL,
    user_id uuid NOT NULL,
    PRIMARY KEY(attachment_id),
    	CONSTRAINT fkSection
          FOREIGN KEY(section_id)
            REFERENCES sections,
		CONSTRAINT fkUser
		  FOREIGN KEY(user_id)
		    REFERENCES users
);

CREATE TABLE IF NOT EXISTS meetings (
	meeting_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	data varchar(255),
	start_time DATE NOT NULL,
	teacher_user_id uuid NOT NULL,
	student_user_id uuid NOT NULL,
	attachment_id uuid,
	course_id uuid NOT NULL,
	PRIMARY KEY (meeting_id),
		CONSTRAINT fkTeacher
			FOREIGN KEY (teacher_user_id)
				REFERENCES users,
		CONSTRAINT fkStudent
			FOREIGN KEY (student_user_id)
				REFERENCES users,
		CONSTRAINT fkAttachment
			FOREIGN KEY (attachment_id)
				REFERENCES attachments,
		CONSTRAINT fkCourse
			FOREIGN KEY (course_id)
				REFERENCES courses
		
);

INSERT INTO users(user_id, username, password, role) VALUES
('556a7e54-cc4a-11eb-b8bc-0242ac130003', 'admin', '$2a$10$UQh7YETj1L6C28wYezj8E.nbsTXtTI9apVcz.LIpo9ubdp/YuqI9y', 'ADMIN'); --password



