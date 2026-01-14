-- 1. 사용자 테이블
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- 고유 식별자
    name VARCHAR(50) NOT NULL ,              -- 사용자 이름
    email VARCHAR(50) NOT NULL UNIQUE,       -- 로그인 ID (중복 불가)
    password VARCHAR(255) NOT NULL          -- 비밀번호 
);

-- 2. 공연 테이블
CREATE TABLE Performances (
    perf_id INT AUTO_INCREMENT PRIMARY KEY,  -- 공연 ID
    title VARCHAR(100) NOT NULL,             -- 공연명
    perf_date DATETIME NOT NULL,             -- 공연 일시
    price INT NOT NULL,                      -- 티켓 단가
    total_stock INT NOT NULL DEFAULT 100,    -- 전체 재고
    image_url VARCHAR(255),                  -- 이미지 URL
    description TEXT                         -- 공연 상세 설명
);

-- 3. 예매 테이블
CREATE TABLE Reservations (
    res_id INT AUTO_INCREMENT PRIMARY KEY,  -- 예매 번호
    user_id INT NOT NULL,                    -- 예매자 ID (FK)
    perf_id INT NOT NULL,                    -- 예매 공연 ID (FK)
    res_date DATETIME DEFAULT NOW(),         -- 예매 시점
    quantity INT NOT NULL,                   -- 수량 (인당 100제한 로직용)
    total_price INT NOT NULL,                -- 총 결제 금액

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (perf_id) REFERENCES Performances(perf_id)
);

-- 4. 데이터 삽입
INSERT INTO Users (name, email, password) VALUES
('이규현','leekh010502@naver.com','1234'),
('테스트 사용자','test@example.com','password123');

INSERT INTO Performances (title, perf_date, price, total_stock, image_url, description) VALUES
('뮤지컬 렌트', '2024-07-15 19:00:00', 80000, 150, 'http://example.com/rent.jpg', '뉴욕의 이스트 빌리지에서 펼쳐지는 청춘들의 이야기.'),
('연극 햄릿', '2024-08-01 20:00:00', 60000, 100, 'http://example.com/hamlet.jpg', '셰익스피어의 명작, 햄릿을 현대적으로 재해석한 공연.');

INSERT INTO Reservations (user_id, perf_id, quantity, total_price) VALUES
(1, 1, 2, 160000),
(2, 2, 1, 60000);

-- 5. 데이터 조회
SELECT * FROM Users;

SELECT * FROM Performances;

SELECT * FROM Reservations;

-- 6. 데이터 수정
UPDATE Users SET password = 'newpassword456' WHERE user_id = 2;

UPDATE Performances SET total_stock = total_stock + 2 WHERE perf_id = 1;

UPDATE Reservations SET quantity = 4, total_price = 320000 WHERE res_id = 1;