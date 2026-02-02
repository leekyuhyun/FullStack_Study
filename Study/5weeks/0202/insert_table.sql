-- User 테이블 데이터 넣기--
INSERT INTO User (user_name, job, birth) VALUES 
('kyulee', '학생', '2001-05-02'),
('tester2', '건물주', '1980-04-11'),
('tester3', '유튜버', '2000-04-22'),
('tester4', '배우', '2002-11-12');

-- 게시글 테이블 값 넣기--
INSERT INTO Post (title, content, created_at, updated_at, user_id) VALUES 
('check1', 'test', '2026-01-21', '2026-01-23', 1),
('wowwow', 'test22', '2026-01-22', '2026-01-23', 2),
('zzz', 'tzzz', '2025-12-30', '2026-01-23', 3),
('wow', 'ohoh', '2025-01-12', '2026-01-23', 1),
('woew', 't333333', '2026-01-22', NULL, 2),
('w4w', 't4444', '2026-01-22', NULL, 4);

select * from User;
select * from Post;

select * from Post left join User on Post.user_id = User.user_id;