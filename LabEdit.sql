-- Active: 1679087135114@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);


SELECT *FROM users;
 DROP TABLE users;

 
INSERT INTO users (id, nickname, email, password)
VALUES
   ("U001", "Drica", "adriana@gmail.com", "adriana123"),
   ("U002", "Ze", "ezequiel@gmail.com", "ezequiel"),
   ("U003", "Poli", "poliana@gmail.com", "poliana10");



CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    creator_id TEXT NOT NULL, 
    content TEXT, 
    comments INTEGER DEFAULT(0) NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL, 
    dislikes INTEGER DEFAULT(0) NOT NULL, 
    created_at TEXT DEFAULT(DATETIME()) NOT NULL, 
    FOREIGN KEY (creator_id) REFERENCES users (id))
;


SELECT *FROM posts;
DROP TABLE posts;

INSERT INTO posts (id, creator_id, content)
VALUES
   ("P1","U001","Hoje e dia de role com o dog!"),
   ("P2","U002","A vida reflete aquilo que você sente. Sinta gratidão!"),
   ("P3","U003","Amanhã começo minha jornada como dev!");

CREATE TABLE comments_posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    creator_id TEXT NOT NULL, 
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL, 
    dislikes INTEGER DEFAULT(0) NOT NULL, 
    created_at TEXT DEFAULT(DATETIME()) NOT NULL, 
    post_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

INSERT INTO comments_posts (id, creator_id, content, post_id)
VALUES
("C1", "U002","Que cachorro lindo!","P1"),
("C2", "U001","concordo com você!","P2"),
("C3", "U002", "Parabéns!!!","P3");


SELECT *FROM comments_posts;
DROP TABLE comments_posts;


SELECT coments.id, 
coments.content,
users.id,
users.nickname
FROM coments LEFT JOIN users
ON users.id = coments.creator_id;

CREATE TABLE like_dislike (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES posts (id)      
 );



DROP TABLE  like_dislike;

 SELECT *From  like_dislike;

 INSERT INTO  like_dislike (user_id, post_id, like)
 VALUES
 ("U001","P1",0),
 ("U002","P2",1),
 ("U003","P3",0);


CREATE TABLE comments_likes_dislikes(
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL, 
    comment_id TEXT NOT NULL, 
    like INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY (comment_id) REFERENCES comments_posts(id));
INSERT INTO  comments_likes_dislikes (user_id, post_id, comment_id, like)
 VALUES
 ("U002","P1","C1",0),
 ("U001","P2","C2",0),
 ("U002","P3","C3",0);
SELECT * FROM  comments_likes_dislikes;
DROP TABLE  comments_likes_dislikes;

