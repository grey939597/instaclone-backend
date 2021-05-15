# Instaclone

Instaclone Backend.

## Prisma

- JS를 통해서 SQL DB와 소통
- prisma = ORM , ORM = Object Relational Mapping
- SQL 코드 직접 코딩 하지 않고 자바 스크립트 코드를 작성하여 DB와 연결 해주는 서비스

1. npm i @prisma/cli
2. npx prisma init -> prisma 폴더 생성, prisma/schema.prisma 생성
3. postgres app 설치
4. CREATE DATABASE instaclone;
5. .env에서 DATABASE_URL 설정
6. schema.prisma
   (1) db : db 종류와 url
   (2) client : 어떤 방식으로 db와 상호작용하는가
7. Prisma Migrate : schema.prisma 파일에 model들을 js로 작성하면, model을 sql로 db에 적용
8. schema.prisma에 model 작성
9. npx prisma migrate dev
10. new PrismaClient()로 client 생성
11. typeDefs와 model 일치
12. Prisma Studio: npx prisma studio (visual editor)

## GraphQL

- typeDefs
- resolvers : Query, Mutation

## User:

- [x] Create Account
- [x] See Profile
- [x] Login
- [x] Edit Profile
- [x] Change Avatar (Image Upload)
- [x] Follow User
- [x] Unfollow User
- [x] See Followers w/ Pagination
- [x] See Following w/ Pagination
- [x] Computed Fields : DB에는 없지만 graphql schema에는 존재
- [x] Search Users

## Photos

- [x] Upload Photo (Parse #)
- [x] See Photo
- [x] See Hashtags
- [x] Search Photos
- [x] Edit Photo
- [x] Like / Unlike Photo
- [ ] See Photo Likes
- [ ] See Feed

## Comments

- [ ] Comment on Photo
- [ ] Edit Comment
- [ ] Delete Comment

## Notepad

- Computed Field
- typeDefs 작성 시, Mutation은 return type을 생성
