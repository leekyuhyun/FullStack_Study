-- 유저 테이블 생성--
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
    user_name VARCHAR(50) NOT NULL,
    job VARCHAR(50),
    birth Date
);

-- 게사글 테이블 생성--
CREATE TABLE Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE NOW(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);