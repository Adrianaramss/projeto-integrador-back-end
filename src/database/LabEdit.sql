-- Active: 1674655381273@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);


SELECT *FROM users;
 DROP TABLE users;

 
INSERT INTO users (id, name, email, password, role)
VALUES
   ("U001", "Adriana", "adriana@gmail.com", "adriana123","admin"),
   ("U002", "Ezequiel", "ezequiel@gmail.com", "ezequiel","normal"),
   ("U003", "Poliana", "poliana@gmail.com", "poliana10", "normal");



CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    coment INTEGER DEFAULT(0) NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);


SELECT *FROM posts;
DROP TABLE posts;

INSERT INTO posts (id, creator_id, content)
VALUES
   ("P1","U001","Hoje e dia de role com o dog!"),
   ("P2","U002","A vida reflete aquilo que você sente. Sinta gratidão!"),
   ("P3","U003","Amanhã começo minha jornada como dev!");

CREATE TABLE coments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    creator_id TEXT NOT NULL, 
    content TEXT,
    likes INTEGER DEFAULT(0) NOT NULL, 
    dislikes INTEGER DEFAULT(0) NOT NULL, 
    created_at TEXT DEFAULT(DATETIME()) NOT NULL, 
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    post_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

INSERT INTO coments (id, creator_id, content, post_id)
VALUES
("C1", "U002","Que cachorro lindo!","P1"),
("C2", "U001","concordo com você!","P2"),
("C3", "U002", "Parabéns!!!","P3");


SELECT *FROM coments;
DROP TABLE coments;


SELECT coments.id, 
coments.content,
users.id,
users.name
FROM coments LEFT JOIN users
ON users.id = coments.creator_id;

CREATE TABLE likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (post_id) REFERENCES posts (id)      
 );



DROP TABLE likes_dislikes;

 SELECT *From likes_dislikes;

 INSERT INTO likes_dislikes (user_id, post_id, like)
 VALUES
 ("U001","P1",0),
 ("U002","P2",1),
 ("U003","P3",0);


CREATE TABLE likes_dislikes_coments(
    user_id TEXT NOT NULL, 
    coment_id TEXT NOT NULL, 
    like INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY (coment_id) REFERENCES coments(id));
INSERT INTO likes_dislikes_coments (user_id, coment_id, like)
 VALUES
 ("U001","C1",0),
 ("U002","C2",1),
 ("U003","C2",0);
SELECT * FROM likes_dislikes_coments;
DROP TABLE likes_dislikes_coments;

